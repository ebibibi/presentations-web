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
import { createBackend, type Candidate, type DeckSource,
  type SlideAction,
  type SlideEntry
} from './backend'

type Target = { rect: DOMRect; candidates: Candidate[] }

/**
 * `sourceHint` is the string the editor could not resolve. It rides along with
 * the message so the way out of a dead end is one click away, and it survives
 * the reload a publish can trigger because it is only ever text.
 */
type Status = { tone: 'info' | 'error'; message: string; sourceHint?: string }

const PANEL_WIDTH = 460
const slideButton: CSSProperties = {
  padding: '4px 9px',
  borderRadius: 7,
  border: '1px solid rgba(255,255,255,0.25)',
  background: 'transparent',
  color: '#e8ecff',
  fontSize: 13,
  cursor: 'pointer'
}

const secondaryButton: CSSProperties = {
  padding: '8px 14px',
  borderRadius: 999,
  border: '1px solid rgba(255,255,255,0.25)',
  cursor: 'pointer',
  fontSize: 13,
  fontWeight: 700,
  color: '#e8ecff',
  background: 'rgba(20,26,48,0.9)'
}
const PUBLISH_KEY = 'deck-text-publish'
const STATUS_KEY = 'deck-text-status'

function currentSlug(): string | undefined {
  return window.location.pathname.match(/\/decks\/([^/]+)/)?.[1]
}

/** The 1-based slide number the viewer keeps in the URL hash. */
function currentSlideNumber(): number {
  const parsed = Number.parseInt(window.location.hash.replace('#', ''), 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1
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
  const [status, setStatus] = useState<Status | null>(() => {
    const stored = window.sessionStorage.getItem(STATUS_KEY)
    window.sessionStorage.removeItem(STATUS_KEY)
    return stored ? (JSON.parse(stored) as Status) : null
  })

  useEffect(() => {
    if (status) window.sessionStorage.setItem(STATUS_KEY, JSON.stringify(status))
    else window.sessionStorage.removeItem(STATUS_KEY)
  }, [status])
  const [isSaving, setIsSaving] = useState(false)
  const [hover, setHover] = useState<DOMRect | null>(null)
  const [list, setList] = useState<Text[] | null>(null)
  const [isNarrow, setIsNarrow] = useState(() => window.innerWidth < 700)
  // Slide-level editing: the deck's slides in running order, and which one the
  // viewer is on. The hash is the slide number the viewer keeps in the URL.
  const [slides, setSlides] = useState<SlideEntry[] | null | undefined>(undefined)
  const [slideNumber, setSlideNumber] = useState(() => currentSlideNumber())
  const [publishOnSave, setPublishOnSave] = useState(
    () => window.localStorage.getItem(PUBLISH_KEY) !== 'off'
  )
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [sourceFiles, setSourceFiles] = useState<DeckSource[] | null>(null)
  const [sourceIndex, setSourceIndex] = useState(0)
  const [sourceDraft, setSourceDraft] = useState('')
  const [isSavingSource, setIsSavingSource] = useState(false)
  const sourceRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const onResize = () => setIsNarrow(window.innerWidth < 700)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const close = useCallback(() => {
    setTarget(null)
    setHover(null)
  }, [])

  const closeSource = useCallback(() => {
    setSourceFiles(null)
    setSourceDraft('')
  }, [])

  /**
   * Opens the raw source of the current deck, scrolled to `focus` when the
   * caller knows which string sent the human here. This is the way out when the
   * copy editor cannot resolve what is on screen — a leftover character between
   * two inline tags has no clickable owner, but it is still right there in the
   * file.
   */
  const openSource = useCallback(
    async (focus?: string) => {
      const slug = currentSlug()
      if (!backend.source || !slug) return

      try {
        const files = await backend.source.read(slug)
        if (!files.length) return

        const needle = focus?.trim() ?? ''
        const found = needle ? files.findIndex((file) => file.text.includes(needle)) : -1
        const index = found >= 0 ? found : 0

        close()
        setList(null)
        setStatus(null)
        setSourceFiles(files)
        setSourceIndex(index)
        setSourceDraft(files[index].text)

        if (found >= 0) {
          // Selecting the string is the point: the human sees where the stray
          // text lives before deciding what to cut.
          const at = files[index].text.indexOf(needle)
          requestAnimationFrame(() => {
            const box = sourceRef.current
            if (!box) return
            box.focus()
            box.setSelectionRange(at, at + needle.length)
            const line = files[index].text.slice(0, at).split('\n').length
            const lineHeight = Number.parseFloat(getComputedStyle(box).lineHeight) || 18
            box.scrollTop = Math.max(0, (line - 4) * lineHeight)
          })
        }
      } catch (error) {
        setStatus({ tone: 'error', message: error instanceof Error ? error.message : String(error) })
      }
    },
    [backend, close]
  )

  /** Resolves a rendered text node back to source and opens the editor on it. */
  const openFor = useCallback(async (node: Text) => {
    const text = node.textContent ?? ''
    const rect = rectOf(node)

    try {
      const candidates = await backend.find(text, currentSlug())
      if (!candidates.length) {
        setStatus({
          tone: 'error',
          message: `「${text.trim().slice(0, 24)}」はソースの文字列として見つかりませんでした（共通部品や自動生成かもしれません）`,
          sourceHint: backend.source ? text : undefined
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
    if (!isActive || target || list || sourceFiles) return

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
  }, [isActive, target, list, sourceFiles, openFor])

  useEffect(() => {
    if (target) inputRef.current?.focus()
  }, [target])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (sourceFiles) {
        if (event.key === 'Escape') closeSource()
        return
      }
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
  }, [target, close, sourceFiles, closeSource])

  // Slide headings are often duplicated in deck.yaml (timeline titles), so the
  // default is to move every occurrence together and keep them in sync.
  const selected = target ? (editAll ? target.candidates : [target.candidates[chosen]]) : []
  // Deleting the copy means deleting what holds it — an empty <p> still takes
  // its own margin and decoration with it. Only offered when every selected
  // occurrence sits in something that can go.
  const removeLabel = selected.length && selected.every((candidate) => candidate.removeLabel)
    ? selected[0].removeLabel
    : null
  // Duplicating repeats a whole list entry, so it only makes sense for one
  // occurrence at a time: "every place this sentence appears" is a set of
  // unrelated lists.
  const duplicateLabel =
    selected.length === 1 ? (selected[0].duplicateLabel ?? null) : null
  const isRequired = selected.some((candidate) => candidate.required)
  const isBlank = !draft.trim()

  const save = async (remove = false, duplicate = false) => {
    if (!target || isSaving) return
    if (remove && selected.length > 1 && !window.confirm(`${selected.length} 箇所をまとめて削除します。よろしいですか？`)) {
      return
    }

    setIsSaving(true)
    try {
      setStatus(
        await backend.save(selected, { text: draft, publish: publishOnSave, remove, duplicate })
      )
      close()
    } catch (error) {
      setStatus({ tone: 'error', message: error instanceof Error ? error.message : String(error) })
    } finally {
      setIsSaving(false)
    }
  }

  useEffect(() => {
    const onHashChange = () => setSlideNumber(currentSlideNumber())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    const slug = currentSlug()
    if (!isActive || slides !== undefined || !slug) return
    void backend
      .listSlides(slug)
      .then(setSlides)
      .catch(() => setSlides(null))
  }, [backend, isActive, slides])

  const currentSlide = slides?.[slideNumber - 1] ?? null

  const editSlide = async (action: SlideAction, offset?: -1 | 1) => {
    const slug = currentSlug()
    if (!slug || !currentSlide || isSaving) return
    if (
      action === 'delete' &&
      !window.confirm(`スライド ${slideNumber}「${currentSlide.id}」を削除します。よろしいですか？`)
    ) {
      return
    }

    setIsSaving(true)
    try {
      const outcome = await backend.editSlide(slug, currentSlide.id, action, {
        offset,
        publish: publishOnSave
      })
      setStatus(outcome)
      // The deck's shape changed, so the list this panel was built from is stale.
      setSlides(undefined)
    } catch (error) {
      setStatus({ tone: 'error', message: error instanceof Error ? error.message : String(error) })
    } finally {
      setIsSaving(false)
    }
  }

  const sourceFile = sourceFiles?.[sourceIndex] ?? null
  const isSourceDirty = Boolean(sourceFile && sourceFile.text !== sourceDraft)

  const saveSource = async () => {
    const slug = currentSlug()
    if (!sourceFiles || !sourceFile || !backend.source || !slug || isSavingSource) return

    setIsSavingSource(true)
    try {
      const { outcome, hash } = await backend.source.save(slug, sourceFile, sourceDraft, publishOnSave)
      setSourceFiles(
        sourceFiles.map((file, index) =>
          index === sourceIndex ? { ...file, text: sourceDraft, hash } : file
        )
      )
      setStatus(outcome)
    } catch (error) {
      setStatus({ tone: 'error', message: error instanceof Error ? error.message : String(error) })
    } finally {
      setIsSavingSource(false)
    }
  }

  const showSourceFile = (index: number) => {
    if (!sourceFiles) return
    if (isSourceDirty && !window.confirm('保存していない変更は失われます。切り替えますか？')) return
    setSourceIndex(index)
    setSourceDraft(sourceFiles[index].text)
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
        : {
            tone: 'error',
            message: 'このスライドに編集できる文言が見つかりませんでした',
            sourceHint: backend.source ? '' : undefined
          }
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
          closeSource()
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

      {isActive && !target && !list && !sourceFiles && (
        <div
          data-deck-text-ui="actions"
          style={{
            position: 'fixed',
            left: 16,
            bottom: 60,
            zIndex: 2147483000,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8
          }}
        >
          <button
            data-deck-text-ui="open-list"
            onClick={() => void openList()}
            style={secondaryButton}
          >
            ☰ このスライドの文言
          </button>
          {currentSlide && (
            <div
              data-deck-text-ui="slide-actions"
              style={{
                display: 'flex',
                gap: 6,
                alignItems: 'center',
                padding: '4px 8px',
                borderRadius: 10,
                background: 'rgba(20,26,48,0.9)',
                border: '1px solid rgba(124,245,196,0.35)'
              }}
            >
              <span style={{ fontSize: 12, opacity: 0.8, color: '#e8ecff' }}>
                {slideNumber}/{slides?.length} {currentSlide.id}
              </span>
              <button
                data-deck-text-ui="slide-up"
                onClick={() => void editSlide('move', -1)}
                disabled={isSaving || slideNumber <= 1}
                title="1つ前へ移動"
                style={slideButton}
              >
                ←
              </button>
              <button
                data-deck-text-ui="slide-down"
                onClick={() => void editSlide('move', 1)}
                disabled={isSaving || slideNumber >= (slides?.length ?? 0)}
                title="1つ後ろへ移動"
                style={slideButton}
              >
                →
              </button>
              <button
                data-deck-text-ui="slide-duplicate"
                onClick={() => void editSlide('duplicate')}
                disabled={isSaving || !currentSlide.canDuplicate}
                title={
                  currentSlide.canDuplicate
                    ? 'このスライドをすぐ後ろに複製します'
                    : 'このスライドは共通の部品を描画しているので複製できません'
                }
                style={slideButton}
              >
                複製
              </button>
              <button
                data-deck-text-ui="slide-delete"
                onClick={() => void editSlide('delete')}
                disabled={isSaving || (slides?.length ?? 0) <= 1}
                title="このスライドを削除します"
                style={{ ...slideButton, color: '#ffb4a8', borderColor: 'rgba(255,180,168,0.5)' }}
              >
                削除
              </button>
            </div>
          )}
          {backend.source && (
            <button
              data-deck-text-ui="open-source"
              onClick={() => void openSource()}
              title="スライドのソースをそのまま編集します"
              style={secondaryButton}
            >
              {'</> ソースを直接編集'}
            </button>
          )}
        </div>
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
          style={{
            position: 'fixed',
            left: 16,
            bottom: 108,
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
          <div>{status.message}</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            {status.sourceHint !== undefined && (
              <button
                data-deck-text-ui="status-source"
                onClick={() => void openSource(status.sourceHint)}
                style={{
                  padding: '5px 10px',
                  borderRadius: 8,
                  border: '1px solid rgba(11,16,32,0.4)',
                  background: 'rgba(11,16,32,0.12)',
                  color: '#0b1020',
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: 'pointer'
                }}
              >
                {'</> ソースを開く'}
              </button>
            )}
            <button
              onClick={() => setStatus(null)}
              style={{
                padding: '5px 10px',
                borderRadius: 8,
                border: 'none',
                background: 'transparent',
                color: '#0b1020',
                fontSize: 12,
                cursor: 'pointer'
              }}
            >
              閉じる
            </button>
          </div>
        </div>
      )}

      {sourceFiles && sourceFile && (
        <div
          data-deck-text-ui="source"
          style={{
            position: 'fixed',
            inset: 12,
            zIndex: 2147483000,
            display: 'flex',
            flexDirection: 'column',
            padding: 14,
            borderRadius: 12,
            background: 'rgba(8,11,24,0.98)',
            border: '1px solid rgba(124,245,196,0.4)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
            color: '#e8ecff',
            fontSize: 13
          }}
        >
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
            {sourceFiles.map((file, index) => (
              <button
                key={file.name}
                onClick={() => showSourceFile(index)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.2)',
                  cursor: 'pointer',
                  fontWeight: 700,
                  color: index === sourceIndex ? '#0b1020' : '#e8ecff',
                  background: index === sourceIndex ? '#7cf5c4' : 'transparent'
                }}
              >
                {file.name}
              </button>
            ))}
            <span style={{ opacity: 0.6, marginLeft: 4 }}>
              {sourceFile.path}
              {isSourceDirty ? '（未保存）' : ''}
            </span>
            <button
              onClick={closeSource}
              style={{
                marginLeft: 'auto',
                border: 'none',
                background: 'transparent',
                color: '#e8ecff',
                fontSize: 18,
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          </div>

          <textarea
            ref={sourceRef}
            value={sourceDraft}
            onChange={(event) => setSourceDraft(event.target.value)}
            spellCheck={false}
            style={{
              flex: 1,
              width: '100%',
              padding: 12,
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(0,0,0,0.5)',
              color: '#e8ecff',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              fontSize: 13,
              lineHeight: 1.6,
              whiteSpace: 'pre',
              resize: 'none'
            }}
          />

          <div style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'center' }}>
            <button
              data-deck-text-ui="save-source"
              onClick={() => void saveSource()}
              disabled={isSavingSource || !isSourceDirty}
              style={{
                padding: '7px 16px',
                borderRadius: 8,
                border: 'none',
                fontWeight: 700,
                cursor: isSourceDirty ? 'pointer' : 'default',
                opacity: isSourceDirty ? 1 : 0.5,
                background: '#7cf5c4',
                color: '#0b1020'
              }}
            >
              {isSavingSource ? (publishOnSave ? '公開中…' : '保存中…') : publishOnSave ? '保存して公開' : '保存'}
            </button>
            <label style={{ display: 'flex', gap: 6, alignItems: 'center', cursor: 'pointer', opacity: 0.85 }}>
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
            <span style={{ marginLeft: 'auto', opacity: 0.6 }}>
              構文が壊れていると保存しません（Esc で閉じる）
            </span>
          </div>
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
              if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
                void save(isBlank && Boolean(removeLabel))
              }
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

          <div data-deck-text-ui="hint" style={{ marginTop: 8, fontSize: 12, opacity: 0.75 }}>
            {removeLabel
              ? `文字を全部消して保存すると、${removeLabel} ごと削除します`
              : isRequired
                ? 'この項目は必須なので、空にも削除にもできません'
                : 'この文字は要素ごと削除できません（空にすると枠だけ残ります）'}
            {duplicateLabel && `／「増やす」で${duplicateLabel}をもう1つ足せます`}
          </div>

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
              data-deck-text-ui="save"
              onClick={() => void save(isBlank && Boolean(removeLabel))}
              disabled={isSaving || (isBlank && isRequired)}
              style={{
                padding: '7px 16px',
                borderRadius: 8,
                border: 'none',
                fontWeight: 700,
                cursor: 'pointer',
                background: isBlank && removeLabel ? '#ffb4a8' : '#7cf5c4',
                color: '#0b1020'
              }}
            >
              {isSaving
                ? (publishOnSave ? '公開中…' : '保存中…')
                : isBlank && removeLabel
                  ? '削除 (⌘/Ctrl+Enter)'
                  : publishOnSave
                    ? '保存して公開'
                    : '保存 (⌘/Ctrl+Enter)'}
            </button>
            {duplicateLabel && !isBlank && (
              <button
                data-deck-text-ui="duplicate"
                onClick={() => void save(false, true)}
                disabled={isSaving}
                title={`${duplicateLabel}をこの直後にもう1つ足します（中身は同じなので、そのあと書き換えます）`}
                style={{
                  padding: '7px 12px',
                  borderRadius: 8,
                  border: '1px solid rgba(124,245,196,0.6)',
                  background: 'transparent',
                  color: '#7cf5c4',
                  cursor: 'pointer'
                }}
              >
                増やす
              </button>
            )}
            {removeLabel && !isBlank && (
              <button
                data-deck-text-ui="delete"
                onClick={() => void save(true)}
                disabled={isSaving}
                title={`${removeLabel} ごと削除します`}
                style={{
                  padding: '7px 12px',
                  borderRadius: 8,
                  border: '1px solid rgba(255,180,168,0.6)',
                  background: 'transparent',
                  color: '#ffb4a8',
                  cursor: 'pointer'
                }}
              >
                削除
              </button>
            )}
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
