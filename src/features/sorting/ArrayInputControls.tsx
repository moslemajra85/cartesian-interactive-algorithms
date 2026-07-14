import { useEffect, useId, useState, type FormEvent } from 'react'
import { parseArrayInput } from './arrayInput'

type ArrayInputControlsProps = {
  values: number[]
  onApply: (values: number[]) => void
  onShuffle: () => void
}

export function ArrayInputControls({ values, onApply, onShuffle }: ArrayInputControlsProps) {
  const inputId = useId()
  const [isOpen, setIsOpen] = useState(false)
  const [draft, setDraft] = useState(values.join(', '))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setDraft(values.join(', '))
    setError(null)
  }, [values])

  const close = () => {
    setDraft(values.join(', '))
    setError(null)
    setIsOpen(false)
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const result = parseArrayInput(draft)

    if (!result.ok) {
      setError(result.error)
      return
    }

    onApply(result.values)
    setDraft(result.normalized)
    setError(null)
    setIsOpen(false)
  }

  const shuffle = () => {
    setIsOpen(false)
    onShuffle()
  }

  return (
    <>
      <div className="panel-label">
        <span>LIVE VISUALIZATION</span>
        <div className="panel-actions">
          <button type="button" onClick={shuffle}>Shuffle</button>
          <button
            type="button"
            onClick={() => {
              setError(null)
              setIsOpen((current) => !current)
            }}
            aria-expanded={isOpen}
            aria-controls={`${inputId}-panel`}
          >
            Set values
          </button>
        </div>
      </div>

      {isOpen && (
        <form className="array-input-panel" id={`${inputId}-panel`} onSubmit={submit}>
          <div className="array-input-copy">
            <label htmlFor={inputId}>Your array</label>
            <span>2–8 whole numbers · 1–99 · duplicates allowed</span>
          </div>
          <div className="array-input-field">
            <input
              id={inputId}
              value={draft}
              onChange={(event) => {
                setDraft(event.target.value)
                setError(null)
              }}
              aria-describedby={`${inputId}-help${error ? ` ${inputId}-error` : ''}`}
              aria-invalid={error ? 'true' : undefined}
              autoFocus
            />
            <span className="sr-only" id={`${inputId}-help`}>Separate values with commas or spaces.</span>
            <button type="submit">Apply</button>
            <button type="button" onClick={close}>Cancel</button>
          </div>
          {error && <p className="array-input-error" id={`${inputId}-error`} role="alert">{error}</p>}
        </form>
      )}
    </>
  )
}
