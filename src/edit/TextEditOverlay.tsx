/**
 * Click-to-edit layer for slide copy.
 *
 * Click any text on a slide, retype it, save. Where the edit goes depends on the
 * environment (see `backend.ts`): on the dev server it rewrites the file on disk
 * and hot-reloads; in production it commits on GitHub and appears once the
 * deploy finishes. In production the editor only appears for a signed-in owner.
 *
 * Editing happens in a floating panel rather than contentEditable on the node
 * itself: the Remotion player re-renders the slide on every seek and would
 * throw away in-place DOM edits.
 *
 * On a phone the whole slide is scaled down — body copy renders a few pixels
 * tall — so tapping an exact word is not realistic. Narrow screens get a list
 * of the copy on the current slide instead, and the editor opens as a bottom
 * sheet.
 */
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { createBackend, type Candidate } from './backend'

type Target = { rect: DOMRect; candidates: Candidate[] }

const PANEL_WIDTH = 460
const PUBLISH_KEY = 'deck-text-publish'
const STATUS_KEY = 'deck-text-status'

function currentSlug(): string | undefined {
  return window.location.pathname.match(/\/decks\/([^/]+)/)?.[1]
}

/** The slide currently on screen, ignoring the offscreen recording surface. */
function visibleSlide(): Element | null {
  const slides = [...document.querySelectorAll('.remotion-slide')]
  let best: { element: Element; area: number } | null = null

  for (const element of slides) {
    const rect = element.getBoundingClientRect()
    const visible =
      Math.max(0, Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0)) *
      Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0))
    if (visible > 0 && (!best || visible > best.area)) best = { element, area: visible }
  }

  return best?.element ?? null
}

/** Every piece of copy rendered on the current slide, in reading order. */
function slideTextNodes(): Text[] {
  const slide = visibleSlide()
  if (!slide) return []

  const walker = document.createTreeWalker(slide, NodeFilter.SHOW_TEXT)
  const nodes: Text[] = []
  let node = walker.nextNode()

  while (node) {
    if (node.textContent?.trim()) nodes.push(node as Text)
    node = walker.nextNode()
  }

  return nodes
}

function textNodeAt(event: MouseEvent): Text | null {
  const { clientX: x, clientY: y } = event

  const fromCaret = caretTextNode(x, y)
  if (fromCaret) return fromCaret

  // Slides stack decorative layers (grids, gradients) over the copy, so the
  // click target is often not the element that owns the text. Walk what is
  // actually under the pointer and look for a text node covering the point.
  const stack = [event.target, ...document.elementsFromPoint(x, y)]
  for (const candidate of stack) {
    if (!(candidate instanceof Element)) continue
    const node = textNodeInElement(candidate, x, y)
    if (node) return node
  }
  return null
}

function textNodeInElement(element: Element, x: number, y: number): Text | null {
  let fallback: Text | null = null

  for (const child of element.childNodes) {
    if (child.nodeType !== Node.TEXT_NODE || !child.textContent?.trim()) continue
    const node = child as Text
    fallback ??= node
    const range = document.createRange()
    range.selectNodeContents(node)
    for (const rect of range.getClientRects()) {
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) return node
    }
  }

  return fallback
}

function caretTextNode(x: number, y: number): Text | null {
  const document_ = document as Document & {
    caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node } | null
    caretRangeFromPoint?: (x: number, y: number) => Range | null
  }

  const node =
    document_.caretPositionFromPoint?.(x, y)?.offsetNode ??
    document_.caretRangeFromPoint?.(x, y)?.startContainer

  return node && node.nodeType === Node.TEXT_NODE && node.textContent?.trim() ? (node as Text) : null
}

function rectOf(node: Text): DOMRect {
  const range = document.createRange()
  range.selectNodeContents(node)
  return range.getBoundingClientRect()
}

export function TextEditOverlay() {
  const backend = useMemo(() => createBackend(), [])
  const [isActive, setIsActive] = useState(false)
  const [target, setTarget] = useState<Target | null>(null)
  const [chosen, setChosen] = useState(0)
  const [editAll, setEditAll] = useState(true)
  const [draft, setDraft] = useState('')
  // Publishing can pull in remote changes, which makes Vite reload the page and
  // would otherwise take the result of the save with it.
  const [status, setStatus] = useState<{ tone: 'info' | 'error'; message: string } | null>(() => {
    const stored = window.sessionStorage.getItem(STATUS_KEY)
    window.sessionStorage.removeItem(STATUS_KEY)
    return stored ? (JSON.parse(stored) as { tone: 'info' | 'error'; message: string }) : null
  })

  useEffect(() => {
    if (status) window.sessionStorage.setItem(STATUS_KEY, JSON.stringify(status))
    else window.sessionStorage.removeItem(STATUS_KEY)
  }, [status])
  const [isSaving, setIsSaving] = useState(false)
  const [hover, setHover] = useState<DOMRect | null>(null)
  const [list, setList] = useState<Text[] | null>(null)
  const [isNarrow, setIsNarrow] = useState(() => window.innerWidth < 700)
  const [publishOnSave, setPublishOnSave] = useState(
    () => window.localStorage.getItem(PUBLISH_KEY) !== 'off'
  )
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const onResize = () => setIsNarrow(window.innerWidth < 700)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const close = useCallback(() => {
    setTarget(null)
    setHover(null)
  }, [])

  /** Resolves a rendered text node back to source and opens the editor on it. */
  const openFor = useCallback(async (node: Text) => {
    const text = node.textContent ?? ''
    const rect = rectOf(node)

    try {
      const candidates = await backend.find(text, currentSlug())
      if (!candidates.length) {
        setStatus({
          tone: 'error',
          message: `「${text.trim().slice(0, 24)}」はソースの文字列として見つかりませんでした（共通部品や自動生成かもしれません）`
        })
        return
      }
      setList(null)
      setTarget({ rect, candidates })
      setChosen(0)
      setEditAll(true)
      setDraft(candidates[0].text)
      setStatus(null)
    } catch (error) {
      setStatus({ tone: 'error', message: error instanceof Error ? error.message : String(error) })
    }
  }, [backend])

  // Pick a string by clicking it. Capture phase + preventDefault keeps the
  // click from reaching the deck viewer's own navigation handlers.
  useEffect(() => {
    if (!isActive || target || list) return

    const onMove = (event: MouseEvent) => {
      const node = textNodeAt(event)
      setHover(node ? rectOf(node) : null)
    }

    const onClick = (event: MouseEvent) => {
      if ((event.target as Element | null)?.closest('[data-deck-text-ui]')) return
      const node = textNodeAt(event)
      if (!node) return

      event.preventDefault()
      event.stopPropagation()
      void openFor(node)
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('click', onClick, true)
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('click', onClick, true)
    }
  }, [isActive, target, list, openFor])

  useEffect(() => {
    if (target) inputRef.current?.focus()
  }, [target])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!target) return
      if (event.key === 'Escape') {
        close()
        return
      }
      // Arrow keys move the deck to another slide, so the panel would end up
      // anchored to copy that is no longer on screen.
      const insidePanel = (event.target as Element | null)?.closest('[data-deck-text-ui]')
      if (!insidePanel && event.key.startsWith('Arrow')) close()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [target, close])

  const save = async () => {
    if (!target || isSaving) return
    // Slide headings are often duplicated in deck.yaml (timeline titles), so the
    // default is to move every occurrence together and keep them in sync.
    const candidates = editAll ? target.candidates : [target.candidates[chosen]]

    setIsSaving(true)
    try {
      setStatus(await backend.save(candidates, draft, publishOnSave))
      close()
    } catch (error) {
      setStatus({ tone: 'error', message: error instanceof Error ? error.message : String(error) })
    } finally {
      setIsSaving(false)
    }
  }

  const panelWidth = Math.min(PANEL_WIDTH, window.innerWidth - 24)
  // A phone renders slide copy a few pixels tall, so anchoring the editor to the
  // text is pointless there; dock it to the bottom of the screen instead.
  const panelStyle: CSSProperties = isNarrow
    ? { left: 12, right: 12, bottom: 12, width: 'auto' }
    : {
        top: target ? Math.min(target.rect.bottom + 12, window.innerHeight - 220) : 0,
        left: target
          ? Math.max(12, Math.min(target.rect.left, window.innerWidth - panelWidth - 12))
          : 0,
        width: panelWidth
      }

  const openList = async () => {
    const nodes = slideTextNodes()

    // Not everything rendered is editable copy (numbering, generated labels), so
    // ask the server which strings it can resolve before listing them.
    let editable = nodes
    try {
      const matches = await backend.countMatches(
        nodes.map((node) => node.textContent ?? ''),
        currentSlug()
      )
      editable = nodes.filter((_node: Text, index: number) => matches[index] > 0)
    } catch {
      // Fall back to the unfiltered list rather than blocking the edit.
    }

    setList(editable)
    setStatus(
      editable.length
        ? null
        : { tone: 'error', message: 'このスライドに編集できる文言が見つかりませんでした' }
    )
  }

  return (
    <div data-deck-text-ui="root">
      <button
        data-deck-text-ui="toggle"
        onClick={() => {
          const next = !isActive
          setIsActive(next)
          close()
          setList(null)
          setStatus(null)
          // Tapping an exact word is not realistic at phone scale.
          if (next && isNarrow) void openList()
        }}
        style={{
          position: 'fixed',
          left: 16,
          bottom: 16,
          zIndex: 2147483000,
          padding: '8px 14px',
          borderRadius: 999,
          border: 'none',
          cursor: 'pointer',
          fontSize: 13,
          fontWeight: 700,
          color: isActive ? '#0b1020' : '#e8ecff',
          background: isActive ? '#7cf5c4' : 'rgba(20,26,48,0.9)',
          boxShadow: '0 6px 20px rgba(0,0,0,0.35)'
        }}
      >
        {isActive ? '✏️ 文字編集: ON' : '✏️ 文字編集'}
      </button>

      {isActive && !target && !list && (
        <button
          data-deck-text-ui="open-list"
          onClick={() => void openList()}
          style={{
            position: 'fixed',
            left: 16,
            bottom: 60,
            zIndex: 2147483000,
            padding: '8px 14px',
            borderRadius: 999,
            border: '1px solid rgba(255,255,255,0.25)',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 700,
            color: '#e8ecff',
            background: 'rgba(20,26,48,0.9)'
          }}
        >
          ☰ このスライドの文言
        </button>
      )}

      {list && (
        <div
          data-deck-text-ui="list"
          style={{
            position: 'fixed',
            left: 12,
            right: 12,
            bottom: 12,
            maxHeight: '70vh',
            overflowY: 'auto',
            zIndex: 2147483000,
            padding: 12,
            borderRadius: 12,
            background: 'rgba(12,16,32,0.97)',
            border: '1px solid rgba(124,245,196,0.4)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
            color: '#e8ecff'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <strong style={{ fontSize: 14 }}>このスライドの文言（{list.length}）</strong>
            <button
              onClick={() => setList(null)}
              style={{
                border: 'none',
                background: 'transparent',
                color: '#e8ecff',
                fontSize: 16,
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          </div>
          {list.map((node, index) => (
            <button
              key={index}
              onClick={() => void openFor(node)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                marginBottom: 6,
                padding: '12px 10px',
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.04)',
                color: '#e8ecff',
                fontSize: 15,
                lineHeight: 1.5,
                cursor: 'pointer'
              }}
            >
              {node.textContent?.trim()}
            </button>
          ))}
        </div>
      )}

      {isActive && (target?.rect ?? hover) && (
        <div
          style={{
            position: 'fixed',
            top: (target?.rect ?? hover)!.top - 2,
            left: (target?.rect ?? hover)!.left - 2,
            width: (target?.rect ?? hover)!.width + 4,
            height: (target?.rect ?? hover)!.height + 4,
            border: target ? '2px solid #ffd479' : '2px solid #7cf5c4',
            borderRadius: 4,
            pointerEvents: 'none',
            zIndex: 2147482000
          }}
        />
      )}

      {status && (
        <div
          data-deck-text-ui="status"
          onClick={() => setStatus(null)}
          style={{
            position: 'fixed',
            left: 16,
            bottom: 64,
            maxWidth: 420,
            zIndex: 2147483000,
            padding: '10px 14px',
            borderRadius: 10,
            fontSize: 13,
            lineHeight: 1.5,
            cursor: 'pointer',
            color: '#0b1020',
            background: status.tone === 'error' ? '#ffb4a8' : '#7cf5c4'
          }}
        >
          {status.message}
        </div>
      )}

      {target && (
        <div
          data-deck-text-ui="panel"
          style={{
            position: 'fixed',
            ...panelStyle,
            zIndex: 2147483000,
            padding: 14,
            borderRadius: 12,
            background: 'rgba(12,16,32,0.97)',
            border: '1px solid rgba(124,245,196,0.4)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
            color: '#e8ecff',
            fontSize: 13
          }}
        >
          <div style={{ opacity: 0.7, marginBottom: 8 }}>
            {target.candidates[chosen].label}
          </div>

          {target.candidates.length > 1 && (
            <div style={{ marginBottom: 8 }}>
              <label style={{ display: 'flex', gap: 6, alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={editAll}
                  onChange={(event) => setEditAll(event.target.checked)}
                />
                同じ文言 {target.candidates.length} 箇所をまとめて直す
              </label>
              {!editAll && (
                <select
                  value={chosen}
                  onChange={(event) => setChosen(Number(event.target.value))}
                  style={{ width: '100%', marginTop: 6, padding: 6, borderRadius: 6 }}
                >
                  {target.candidates.map((candidate, index) => (
                    <option key={candidate.label} value={index}>
                      {candidate.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          <textarea
            ref={inputRef}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) void save()
            }}
            rows={Math.min(8, Math.max(2, Math.ceil(draft.length / 40)))}
            style={{
              width: '100%',
              padding: 10,
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(0,0,0,0.4)',
              color: '#fff',
              fontSize: 16,
              lineHeight: 1.6,
              resize: 'vertical'
            }}
          />

          {backend.mode === 'dev' && (
          <label
            style={{
              display: 'flex',
              gap: 6,
              alignItems: 'center',
              marginTop: 10,
              cursor: 'pointer',
              opacity: 0.85
            }}
          >
            <input
              type="checkbox"
              checked={publishOnSave}
              onChange={(event) => {
                setPublishOnSave(event.target.checked)
                window.localStorage.setItem(PUBLISH_KEY, event.target.checked ? 'on' : 'off')
              }}
            />
            保存したら公開（commit &amp; push）
          </label>
          )}

          <div style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'center' }}>
            <button
              onClick={() => void save()}
              disabled={isSaving || !draft.trim()}
              style={{
                padding: '7px 16px',
                borderRadius: 8,
                border: 'none',
                fontWeight: 700,
                cursor: 'pointer',
                background: '#7cf5c4',
                color: '#0b1020'
              }}
            >
              {isSaving ? (publishOnSave ? '公開中…' : '保存中…') : publishOnSave ? '保存して公開' : '保存 (⌘/Ctrl+Enter)'}
            </button>
            <button
              onClick={() => {
                close()
                if (isNarrow) void openList()
              }}
              style={{
                padding: '7px 12px',
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.25)',
                background: 'transparent',
                color: '#e8ecff',
                cursor: 'pointer'
              }}
            >
              キャンセル (Esc)
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
