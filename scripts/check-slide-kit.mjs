import { mkdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { chromium } from '@playwright/test'
import ts from 'typescript'
import { COPY_ATTRIBUTES, collectTsxStrings } from './deck-text-core.mjs'
import { startStaticSite } from './static-site-server.mjs'

// Guards the two promises src/slide-kit makes to every deck built on it:
//
//   1. A kit slide fills the canvas exactly and never spills out of it. A
//      component is shared, so one padding change quietly clips text in every
//      deck at once — and the overflow is invisible in the editor, because the
//      canvas is scaled down to fit the browser before anyone looks at it.
//   2. Copy passed to a kit component stays visible to the click-to-edit layer.
//      Only the prop names in COPY_ATTRIBUTES are extracted; a headline handed
//      over under any other name is copy nobody can ever click again.
const port = 5186
const deckSlug = 'slide-kit-showcase'
const canvas = { width: 1280, height: 1080 }
const deckDir = join(process.cwd(), 'content', 'decks', deckSlug)
const kitDir = join(process.cwd(), 'src', 'slide-kit')

/** Kit props that carry configuration, not copy, and so are never extracted. */
const CONFIG_PROPS = new Set([
  'frame',
  'delay',
  'className',
  'tone',
  'grid',
  'logo',
  'center',
  'orientation',
  'stagger',
  'arrow',
  'icon',
  'embed',
  'videoId',
  'poster',
  'motion',
  'bpm',
  'start',
  'every',
  'enter',
  'length',
  'count',
  'seed',
  'grain',
  'vignette',
  'glitch',
  'glitchLength',
  'key'
])

await mkdir('tmp', { recursive: true })
await checkCopyProps()
await checkCanvas()

console.log('Slide kit check passed.')

/**
 * Every attribute a showcase slide hands to a kit component is either
 * registered copy or declared configuration. Anything else is a new prop that
 * nobody decided about, and the safe default is to fail loudly here.
 */
async function checkCopyProps() {
  const components = await kitComponentNames()
  const path = join(deckDir, 'slides.tsx')
  const source = await readFile(path, 'utf8')
  const file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const problems = []

  const visit = (node) => {
    if (ts.isJsxOpeningLikeElement(node)) {
      const tag = node.tagName.getText(file)

      if (components.has(tag)) {
        for (const attribute of node.attributes.properties) {
          if (!ts.isJsxAttribute(attribute)) continue
          const name = attribute.name.getText(file)
          if (COPY_ATTRIBUTES.has(name) || CONFIG_PROPS.has(name)) continue
          const line = file.getLineAndCharacterOfPosition(attribute.getStart(file)).line + 1
          problems.push(
            `${deckSlug}/slides.tsx:${line} passes "${name}" to <${tag}>. ` +
              'Add it to COPY_ATTRIBUTES in scripts/deck-text-core.mjs if it carries copy, ' +
              'or to CONFIG_PROPS in this script if it does not.'
          )
        }
      }
    }

    ts.forEachChild(node, visit)
  }

  visit(file)

  if (problems.length) {
    throw new Error(`Slide kit prop check failed:\n  - ${problems.join('\n  - ')}`)
  }

  const extracted = collectTsxStrings(path, source)

  if (!extracted.length) {
    throw new Error(`${deckSlug}/slides.tsx yielded no editable copy.`)
  }

  console.log(`Copy props checked (${components.size} components, ${extracted.length} editable strings).`)
}

/** Component names the kit exports, so the prop check only judges kit usage. */
async function kitComponentNames() {
  const source = await readFile(join(kitDir, 'index.ts'), 'utf8')
  const names = new Set()

  for (const match of source.matchAll(/^export \{([^}]+)\} from/gm)) {
    for (const name of match[1].split(',')) {
      const trimmed = name.trim()
      if (/^[A-Z]/.test(trimmed)) names.add(trimmed)
    }
  }

  if (!names.size) {
    throw new Error('No components found in src/slide-kit/index.ts')
  }

  return names
}

/**
 * Walks the showcase deck a slide at a time and measures the rendered surface.
 * Remotion scales the composition with a transform, so layout pixels inside the
 * player are still canvas pixels: a 1281px scrollWidth here is a real overflow.
 */
async function checkCanvas() {
  const site = await startStaticSite({
    port,
    clientId: 'local-slide-kit-check',
    session: {
      authenticated: true,
      canRecord: true,
      user: { email: 'ebibibi@gmail.com', name: 'Slide kit check' }
    }
  })

  const browser = await chromium.launch()

  try {
    const page = await browser.newPage({ viewport: { width: 1512, height: 950 } })
    await page.goto(`${site.baseUrl}/decks/${deckSlug}`)
    await page.locator('.slide-frame .remotion-slide').waitFor({ timeout: 15000 })

    const total = await slideCount(page)
    const problems = []

    for (let index = 1; index <= total; index += 1) {
      if (index > 1) {
        await page.keyboard.press('ArrowRight')
        await page
          .locator('.viewer-footer span')
          .filter({ hasText: `${index} / ${total}` })
          .waitFor({ timeout: 15000 })
      }

      // The footer counter flips when the slide transition starts, not when it
      // ends, so measuring straight away catches the entrance mid-flight: every
      // delayed element is still at opacity 0 and takes up no visible room.
      // Wait for the animation itself to finish instead of guessing a duration.
      await settleEntrance(page)

      const box = await page.evaluate(() => {
        const slide = document.querySelector('.slide-frame .remotion-slide')
        if (!slide) return null
        return {
          clientWidth: slide.clientWidth,
          clientHeight: slide.clientHeight,
          scrollWidth: slide.scrollWidth,
          scrollHeight: slide.scrollHeight
        }
      })

      if (!box) {
        problems.push(`slide ${index}: no .remotion-slide rendered`)
        continue
      }

      if (box.clientWidth !== canvas.width || box.clientHeight !== canvas.height) {
        problems.push(
          `slide ${index}: canvas is ${box.clientWidth}x${box.clientHeight}, expected ${canvas.width}x${canvas.height}`
        )
      }

      if (box.scrollWidth > box.clientWidth || box.scrollHeight > box.clientHeight) {
        problems.push(
          `slide ${index}: content overflows the canvas ` +
            `(${box.scrollWidth}x${box.scrollHeight} inside ${box.clientWidth}x${box.clientHeight})`
        )
      }

      await page.screenshot({ path: `tmp/slide-kit-${index}.png` })
    }

    if (problems.length) {
      throw new Error(`Slide kit canvas check failed:\n  - ${problems.join('\n  - ')}`)
    }

    console.log(`Canvas checked (${total} slides at ${canvas.width}x${canvas.height}).`)
    console.log(`Screenshots: tmp/slide-kit-1.png … tmp/slide-kit-${total}.png`)
  } finally {
    await browser.close()
    await site.close()
  }
}

/** Resolves once every animated element on the current slide has faded in. */
async function settleEntrance(page) {
  await page.waitForFunction(
    () => {
      const animated = document.querySelectorAll(
        '.slide-frame .remotion-slide [style*="opacity"]'
      )

      return [...animated].every(
        (element) => Number.parseFloat(window.getComputedStyle(element).opacity) >= 0.99
      )
    },
    undefined,
    { timeout: 20000 }
  )
}

async function slideCount(page) {
  const text = await page.locator('.viewer-footer span').first().textContent()
  const total = Number.parseInt(text?.split('/').at(1)?.trim() || '', 10)

  if (!Number.isFinite(total) || total < 1) {
    throw new Error(`Could not read the slide count (footer said "${text}")`)
  }

  return total
}
