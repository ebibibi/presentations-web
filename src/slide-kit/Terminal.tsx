import { useEnter, useStagger } from './motion'

/** One rendered line. `prompt` is typed in, `output` comes back, `comment` explains. */
export type TerminalLineKind = 'prompt' | 'output' | 'comment'

export type TerminalLine = {
  kind?: TerminalLineKind
  body: string
}

export type TerminalProps = {
  frame: number
  /** Window title, for example a file name or a channel name. */
  caption?: string
  lines: TerminalLine[]
  delay?: number
  /** Reveal lines one after another instead of all at once. */
  stagger?: boolean
}

const PREFIX: Record<TerminalLineKind, string> = {
  prompt: '$ ',
  output: '',
  comment: '# '
}

/**
 * A terminal or code window.
 *
 * Every deck that showed a command had rebuilt this chrome with its own class
 * prefix. Lines are data rather than JSX children so a deck can add, delete and
 * reorder them from the browser editor.
 */
export function Terminal({ frame, caption, lines, delay = 0, stagger = false }: TerminalProps) {
  const shell = useEnter(frame, delay, 28)
  const lineStyles = useStagger(frame, lines.length, { start: delay + 12, step: 8, distance: 12 })

  return (
    <div className="sk-terminal" style={shell}>
      <div className="sk-terminal-bar">
        <span />
        <span />
        <span />
        {caption ? <strong>{caption}</strong> : null}
      </div>
      <div className="sk-terminal-body">
        {lines.map((line, index) => {
          const kind = line.kind ?? 'output'

          return (
            <code
              key={`${line.body}-${index}`}
              className={`sk-terminal-line sk-terminal-${kind}`}
              style={stagger ? lineStyles[index] : undefined}
            >
              <span className="sk-terminal-prefix">{PREFIX[kind]}</span>
              {line.body}
            </code>
          )
        })}
      </div>
    </div>
  )
}
