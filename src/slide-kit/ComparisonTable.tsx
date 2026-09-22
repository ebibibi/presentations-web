import { useEnter, useStagger } from './motion'

export type ComparisonColumn = {
  label: string
  /** Marks the column the viewer should end up choosing. */
  accent?: boolean
}

export type ComparisonRow = {
  /** Row label in the leftmost column. */
  label: string
  /** One cell per column, in the same order as `columns`. */
  cells: string[]
}

export type ComparisonTableProps = {
  frame: number
  columns: ComparisonColumn[]
  rows: ComparisonRow[]
  delay?: number
}

/**
 * Before/after or option A/B/C, as a real table.
 *
 * The row label column is fixed and the value columns share the rest evenly, so
 * the table fills whichever canvas the deck uses without a horizontal scroll.
 */
export function ComparisonTable({ frame, columns, rows, delay = 18 }: ComparisonTableProps) {
  const head = useEnter(frame, delay, 20)
  const rowStyles = useStagger(frame, rows.length, { start: delay + 10, step: 8, distance: 18 })
  const template = `minmax(180px, 1fr) repeat(${columns.length}, minmax(0, 1.4fr))`

  return (
    <div className="sk-table" role="table">
      <div className="sk-table-head" role="row" style={{ ...head, gridTemplateColumns: template }}>
        <span role="columnheader" />
        {columns.map((column) => (
          <span
            key={column.label}
            role="columnheader"
            className={column.accent ? 'sk-table-accent' : undefined}
          >
            {column.label}
          </span>
        ))}
      </div>
      {rows.map((row, index) => (
        <div
          key={row.label}
          role="row"
          className="sk-table-row"
          style={{ ...rowStyles[index], gridTemplateColumns: template }}
        >
          <strong role="rowheader">{row.label}</strong>
          {row.cells.map((cell, cellIndex) => (
            <span
              key={`${row.label}-${cellIndex}`}
              role="cell"
              className={columns[cellIndex]?.accent ? 'sk-table-accent' : undefined}
            >
              {cell}
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}
