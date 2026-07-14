# Contributing to Cartesian

Cartesian is built as a learning product, not a gallery of disconnected algorithm animations. Changes should improve both algorithm correctness and the learner's ability to understand why a step happens.

## Local workflow

```bash
npm install
npm run dev
```

Before committing:

```bash
npm test
npm run lint
npm run build
```

All three commands must pass.

## Adding an algorithm lesson

1. Implement a pure event generator.
2. Define semantic events independent of CSS and DOM positions.
3. Cover final output, mutation safety, and important edge cases with unit tests.
4. Build the lesson around a learner question, not only an animation.
5. Synchronize each event with pseudocode and a plain-language explanation.
6. Verify desktop and mobile layouts.
7. Check reduced-motion behavior and keyboard access.
8. Update the roadmap and documentation if project behavior changes.

Every lesson should also include a prediction checkpoint that tests the algorithm's invariant or decision process. Avoid syntax trivia and questions that can be answered without understanding the visualization.

## Event quality checklist

An event should answer at least one of these questions:

- What values or nodes are being examined?
- What changed?
- Which part of the structure is complete?
- Which pseudocode statement caused this state?
- What should the learner notice?

Do not emit pixel positions, colors, or animation delays from algorithm code.

## Commit style

Use focused conventional commits:

```text
feat: add selection sort lesson
fix: preserve duplicate values in sort events
test: cover early-exit sorting behavior
docs: explain playback event architecture
```

Commit completed milestones. Avoid mixing unrelated refactors, visual changes, and algorithm behavior in one commit.

## Pull request expectations

A strong change explains:

- The learner problem being solved
- The technical approach
- Important alternatives or trade-offs
- How correctness was verified
- Screenshots for visual changes
- Known limitations left for later
