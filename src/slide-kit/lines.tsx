/**
 * Japanese headlines break where the author decides, not where the box ends.
 *
 * A "\n" inside a copy prop becomes a real line break here, so the headline
 * stays one editable string instead of being split across <br/> tags that the
 * click-to-edit layer would offer as separate, meaningless fragments.
 */
export function renderLines(text: string) {
  return text.split('\n').map((line, index) => (
    <span key={`${line}-${index}`} className="sk-line">
      {line}
    </span>
  ))
}
