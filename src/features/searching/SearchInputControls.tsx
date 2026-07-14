import { useEffect, useId, useState, type FormEvent } from 'react'
import { parseArrayInput } from '../sorting/arrayInput'
import { parseSearchTarget } from './searchInput'

type SearchInputControlsProps = {
  values: number[]
  target: number
  onApply: (values: number[], target: number) => void
  onNewExample: () => void
}

export function SearchInputControls({ values, target, onApply, onNewExample }: SearchInputControlsProps) {
  const id = useId()
  const [isOpen, setIsOpen] = useState(false)
  const [valuesDraft, setValuesDraft] = useState(values.join(', '))
  const [targetDraft, setTargetDraft] = useState(String(target))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setValuesDraft(values.join(', '))
    setTargetDraft(String(target))
    setError(null)
  }, [target, values])

  const close = () => {
    setValuesDraft(values.join(', '))
    setTargetDraft(String(target))
    setError(null)
    setIsOpen(false)
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const arrayResult = parseArrayInput(valuesDraft)
    if (!arrayResult.ok) {
      setError(arrayResult.error)
      return
    }

    const targetResult = parseSearchTarget(targetDraft)
    if (!targetResult.ok) {
      setError(targetResult.error)
      return
    }

    const orderedValues = [...arrayResult.values].sort((left, right) => left - right)
    onApply(orderedValues, targetResult.target)
    setIsOpen(false)
    setError(null)
  }

  return (
    <>
      <div className="panel-label">
        <span>LIVE SEARCH · TARGET {target}</span>
        <div className="panel-actions">
          <button type="button" onClick={() => { setIsOpen(false); onNewExample() }}>New example</button>
          <button
            type="button"
            onClick={() => { setError(null); setIsOpen((current) => !current) }}
            aria-expanded={isOpen}
            aria-controls={`${id}-panel`}
          >
            Set search
          </button>
        </div>
      </div>

      {isOpen && (
        <form className="search-input-panel" id={`${id}-panel`} onSubmit={submit}>
          <div className="search-input-copy">
            <strong>Search setup</strong>
            <span>Values are sorted automatically—the required Binary Search precondition.</span>
          </div>
          <label htmlFor={`${id}-values`}>
            Values
            <input
              id={`${id}-values`}
              value={valuesDraft}
              onChange={(event) => { setValuesDraft(event.target.value); setError(null) }}
              aria-invalid={error ? 'true' : undefined}
              autoFocus
            />
          </label>
          <label htmlFor={`${id}-target`}>
            Target
            <input
              id={`${id}-target`}
              value={targetDraft}
              onChange={(event) => { setTargetDraft(event.target.value); setError(null) }}
              inputMode="numeric"
              aria-invalid={error ? 'true' : undefined}
            />
          </label>
          <div className="search-input-actions">
            <button type="submit">Apply</button>
            <button type="button" onClick={close}>Cancel</button>
          </div>
          {error && <p className="array-input-error" role="alert">{error}</p>}
        </form>
      )}
    </>
  )
}
