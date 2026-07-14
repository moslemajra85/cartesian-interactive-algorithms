import { useId, useState } from 'react'

export type PredictionOption = {
  id: string
  label: string
}

export type PredictionCheckpointDefinition = {
  question: string
  options: readonly PredictionOption[]
  correctOptionId: string
  hint: string
  explanation: string
}

type PredictionCheckpointProps = {
  definition: PredictionCheckpointDefinition
}

export function PredictionCheckpoint({ definition }: PredictionCheckpointProps) {
  const questionId = useId()
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const answeredCorrectly = selectedOptionId === definition.correctOptionId
  const hasIncorrectAttempt = selectedOptionId !== null && !answeredCorrectly

  const reset = () => setSelectedOptionId(null)

  return (
    <section className="prediction-checkpoint" aria-labelledby={questionId}>
      <div className="checkpoint-heading">
        <span className="checkpoint-number">02</span>
        <div>
          <p className="eyebrow"><span /> PREDICTION CHECKPOINT</p>
          <h2 id={questionId}>Pause before the answer.</h2>
          <p>Reason from the invariant, then choose the claim you can prove.</p>
        </div>
      </div>

      <fieldset>
        <legend>{definition.question}</legend>
        <div className="prediction-options">
          {definition.options.map((option, index) => {
            const isSelected = selectedOptionId === option.id
            const isCorrect = isSelected && answeredCorrectly
            const isWrong = isSelected && hasIncorrectAttempt

            return (
              <button
                className={`${isCorrect ? 'is-correct' : ''} ${isWrong ? 'is-wrong' : ''}`.trim()}
                type="button"
                aria-label={option.label}
                aria-pressed={isSelected}
                disabled={answeredCorrectly}
                onClick={() => setSelectedOptionId(option.id)}
                key={option.id}
              >
                <span>{String.fromCharCode(65 + index)}</span>
                {option.label}
                {isCorrect && <i aria-hidden="true">✓</i>}
                {isWrong && <i aria-hidden="true">×</i>}
              </button>
            )
          })}
        </div>
      </fieldset>

      {hasIncorrectAttempt && (
        <div className="checkpoint-feedback is-hint" role="status" aria-live="polite">
          <strong>Not quite—look at the invariant.</strong>
          <p>{definition.hint}</p>
        </div>
      )}

      {answeredCorrectly && (
        <div className="checkpoint-feedback is-success" role="status" aria-live="polite">
          <div><strong>That reasoning holds.</strong><p>{definition.explanation}</p></div>
          <button type="button" onClick={reset}>Reset checkpoint</button>
        </div>
      )}
    </section>
  )
}
