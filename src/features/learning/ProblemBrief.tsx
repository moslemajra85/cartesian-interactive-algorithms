export type ProblemBriefDefinition = {
  title: string
  scenario: string
  constraints: readonly string[]
  question: string
}

type ProblemBriefProps = {
  definition: ProblemBriefDefinition
  headingId: string
}

export function ProblemBrief({ definition, headingId }: ProblemBriefProps) {
  return (
    <section className="problem-brief" aria-labelledby={headingId}>
      <div className="problem-brief-label">
        <span>REAL PROBLEM</span>
        <i>Context before technique</i>
      </div>
      <div className="problem-brief-story">
        <h2 id={headingId}>{definition.title}</h2>
        <p>{definition.scenario}</p>
      </div>
      <div className="problem-brief-constraints">
        <strong>CONSTRAINTS</strong>
        <ul>{definition.constraints.map((constraint) => <li key={constraint}>{constraint}</li>)}</ul>
      </div>
      <div className="problem-brief-question">
        <span>ENGINEERING QUESTION</span>
        <p>{definition.question}</p>
      </div>
    </section>
  )
}
