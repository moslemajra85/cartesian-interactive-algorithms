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

GitHub Actions repeats these checks for pull requests and pushes to `main`. Successful `main` builds deploy automatically to GitHub Pages, so a red quality job is a release blocker rather than an advisory signal.

## Adding an algorithm lesson

1. Implement a pure event generator.
2. Define semantic events independent of CSS and DOM positions.
3. Cover final output, mutation safety, and important edge cases with unit tests.
4. Build the lesson around a learner question, not only an animation.
5. Synchronize each event with pseudocode and a plain-language explanation.
6. Verify desktop and mobile layouts.
7. Check reduced-motion behavior and keyboard access.
8. Update the roadmap and documentation if project behavior changes.

Sorting event generators may support broader numeric inputs than the interface. The current visualization contract is intentionally narrower: 2–8 whole numbers from 1–99. Change `arrayInput.ts`, its tests, the visible guidance, and responsive bar verification together if that product boundary changes.

Register a new lesson once in `features/catalog/curriculum.tsx` and keep its educational definition in `features/sorting/lessonDefinitions.ts`. Do not add parallel slug checks to `App.tsx`, progress storage, or navigation components; those consumers must continue deriving their behavior from the registry.

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
