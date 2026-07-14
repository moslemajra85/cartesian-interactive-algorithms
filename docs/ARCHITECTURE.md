# Cartesian Architecture

This document explains the current runtime design, the boundaries that should remain stable, and the decisions intentionally deferred while the application grows beyond its first sorting lesson family.

## System goal

Cartesian turns algorithm execution into a timeline a learner can inspect. Each state must support:

- Deterministic replay
- Forward and backward stepping
- Synchronized visualization, code, and explanation
- Playback at different speeds
- Unit testing without rendering React

## Runtime flow

```mermaid
sequenceDiagram
    actor Learner
    participant Lesson as Lesson component
    participant Algorithm as Pure event generator
    participant Player as Playback state
    participant View as Visualization and code

    Learner->>Lesson: Enter, choose, or shuffle input
    Lesson->>Lesson: Validate size, type, and range
    Lesson->>Algorithm: createSteps(input, optional target)
    Algorithm-->>Lesson: Immutable step timeline
    Learner->>Player: Play, pause, or seek
    Player->>Player: Select step index
    Player-->>View: Current semantic step
    View-->>Learner: Bars, code line, and explanation
```

The arrows show ownership: the lesson owns the input, the algorithm owns event creation, the player owns time, and the view owns presentation.

## Responsibility boundaries

### Algorithm event generators

Locations: `src/features/sorting/*.ts` and `src/features/searching/binarySearch.ts`

Responsibilities:

- Accept plain input data
- Avoid mutating caller-owned values
- Execute the real algorithm
- Record meaningful semantic snapshots
- Return deterministic output

It must not import React, access the DOM, start timers, or choose colors.

### Shared playback and visualization

Locations: `src/features/learning/useStepPlayback.ts`, `src/features/sorting/ArrayVisualizer.tsx`, and `src/features/sorting/SortLesson.tsx`

Responsibilities:

- Let each lesson own its accepted input and generated timeline
- Own the timeline cursor and schedule automatic playback
- Convert learner actions into cursor changes
- Render common semantic array state in memory-tape and magnitude-bar views
- Keep visualization, pseudocode, and narration synchronized

Bubble Sort, Selection Sort, Insertion Sort, and Merge Sort use the configurable `SortLesson`. Binary Search has a dedicated lesson shell because it owns a target as well as an array, but reuses the same playback hook and `ArrayVisualizer`. The Foundations lessons also reuse playback while rendering growth-rate, operation-count, memory, and case comparisons. `PlaybackControls` owns the consistent buttons, timeline, and shortcut reference; `useStepPlayback` owns their state transitions. `InputSizeExperiment` seeks that same timeline directly, so slider experiments cannot create a second visualization state that drifts from narration or completion. These concrete use cases keep time control shared without forcing unlike visual models into one oversized component.

The algorithm-specific wrapper components contain educational content rather than playback mechanics. This keeps lesson configuration explicit while preventing duplicated visualization code.

### Custom array input

Locations: `src/features/sorting/ArrayInputControls.tsx` and `src/features/sorting/arrayInput.ts`

The control owns temporary form state; the lesson owns the accepted array. A pure parser converts comma- or whitespace-separated text into normalized numeric values before the lesson can replace its timeline input.

The parser accepts 2–8 whole numbers from 1–99 and preserves duplicates. These are product constraints rather than algorithm constraints: positive values keep bar geometry and labels meaningful, while eight bars remain readable at the smallest supported viewport. Invalid text never reaches an event generator. Applying valid values pauses playback and returns the cursor to the initial event; shuffling preserves the chosen array length.

### Binary Search input

Locations: `src/features/searching/SearchInputControls.tsx` and `src/features/searching/searchInput.ts`

Binary Search requires a nondecreasing array. The interface validates the same 2–8 whole-number array boundary, sorts accepted values explicitly, and displays that behavior beside the controls. The pure generator independently rejects unordered input with a `RangeError`; correctness therefore does not depend on the UI remembering the precondition. A separate target parser accepts one whole number from 1–99. Changing values or target rebuilds the immutable timeline and restarts playback.

### Prediction checkpoint

Location: `src/features/learning/PredictionCheckpoint.tsx`

Responsibilities:

- Render an algorithm-specific reasoning question
- Allow repeated attempts after an incorrect answer
- Reveal a targeted hint without exposing the correct option
- Lock options and explain the invariant after a correct answer
- Reset independently from algorithm playback

Checkpoint definitions live beside lesson content. They do not inspect timeline events or duplicate algorithm execution. This keeps the question pedagogically intentional and allows the component to be reused by future trees, graphs, and problem-solving lessons.

### Application shell

Location: `src/App.tsx`

Responsibilities:

- Render the handbook identity and learning path
- Own global chapter-menu state
- Select a typed application route
- Synchronize home, catalogue, lesson, and not-found screens with browser history
- Update document titles and move focus after client-side navigation

Route parsing and serialization live in `src/features/catalog/routing.ts`. The application uses a discriminated union rather than arbitrary route strings, so only catalogue-validated lesson slugs can reach lesson rendering or progress persistence. Existing `#bubble-sort`-style links remain valid, while `#arrays` addresses the chapter catalogue and unknown hashes render an explicit recovery screen.

The typed curriculum registry in `src/features/catalog/curriculum.tsx` is the source for available chapter routes, lesson routes, switcher labels, chapter counts, progress validation, catalogue copy, cards, and component selection. Each chapter catalogue is rendered from the same component and filtered registry; adding a chapter does not add another App-level route branch. Educational definitions remain in their feature folders rather than moving into the routing layer.

## Event design

Events describe algorithm meaning rather than animation instructions.

Good event fields:

- `compared: [left, right]`
- `swapped: [left, right]`
- `sortedIndices: number[]`
- `line: number`
- `activeRange: [start, end]`
- `splitAt: middle`
- `mergedRange: [start, end]`

Avoid fields such as:

- `moveBarLeftBy: 76`
- `flashColor: "#ff655c"`
- `waitMilliseconds: 400`

The first group survives a redesign. The second couples algorithm correctness to a particular layout and animation speed.

### Recursive merge events

Merge Sort keeps the visible segment unchanged while comparing the front candidates of two ordered halves. It builds the merged result in auxiliary algorithm state, then commits the complete range in one immutable event. This matters because writing one value at a time would overwrite bars that later comparison events still need to reference, making the visual comparison semantically false.

`activeRange` dims unrelated recursion branches, `splitAt` identifies the boundary between the two halves, and `mergedRange` identifies a newly ordered result. The React view decides how those meanings look; the generator never emits opacity, spacing, or colors.

### Binary Search events

Binary Search emits a midpoint comparison followed by either a found state or a smaller `activeRange`. The range is an inclusive pair of stable indices, so discarded cells can remain visible as evidence while visually receding. An empty interval is represented as `[0, -1]`, which gives the renderer an explicit not-found state without inventing a nullable special event. The generator verifies that each input is already ordered before producing any events.

### Motion and dual array representation

The shared player renders every array in two synchronized forms:

- The memory tape emphasizes fixed indices and value storage.
- The bars emphasize relative magnitude and movement.

Both derive from the same immutable `SortStep`; neither owns algorithm state. Comparison, swapped, merged, sorted, and inactive-range classes are calculated once per index and applied to both representations.

Directional swap motion is derived from the semantic pair `[left, right]`. The view computes a signed starting offset, so the new value at the left index arrives from the right and vice versa. Merge events use their index position only to stagger a settling animation across the committed range. Search events lift the inspected midpoint and transition discarded indices into a smaller, desaturated state. These are presentation calculations: event generators still know nothing about distance, duration, easing, or color.

Narration remounts by timeline index so each explanation enters as a distinct beat, while the current pseudocode line receives a short emphasis transition. A play-state pulse communicates that time is advancing. The global `prefers-reduced-motion` rule reduces all animations and transitions to effectively instantaneous state changes.

## State model

```mermaid
stateDiagram-v2
    [*] --> Ready
    Ready --> Playing: play
    Playing --> Paused: pause
    Paused --> Playing: play
    Ready --> Paused: next or previous
    Playing --> Complete: final step
    Paused --> Complete: seek to final step
    Complete --> Ready: replay or shuffle
    Playing --> Ready: restart or shuffle
    Paused --> Ready: restart or shuffle
```

The visualization does not own a separate copy of algorithm state. It derives everything from the current timeline step, which prevents code highlighting and visible values from drifting apart.

## Testing boundaries

Unit tests cover event generators, custom-input parsing, and persistence because they contain correctness-sensitive transformations. Binary Search tests additionally prove logarithmic comparison bounds, interval shrinkage, and rejection of unordered input. Component tests cover prediction interaction and sorting/search form behavior. The next useful test layers are:

1. Shared player interaction tests for button and timer behavior.
2. Browser-level focus and accessible-state tests.
3. One end-to-end catalogue-to-completion flow in a real browser.

Snapshot-testing the entire page is deliberately avoided. Large markup snapshots are noisy and do not prove that algorithm states are correct.

## Progress persistence

Progress is stored under the versioned key `cartesian.learning-progress.v1`. The payload intentionally contains only source-of-truth identifiers:

```ts
type LearningProgress = {
  version: 1
  completedLessonSlugs: string[]
  lastLessonSlug: string | null
}
```

Chapter percentages, completion counts, resume labels, and navigation badges are derived at render time. They are not persisted, because derived values would become stale when lessons are added or removed.

The loader validates the schema, removes duplicate and unknown slugs, and falls back to empty progress for malformed JSON, unsupported versions, or unavailable browser storage. The application continues to function when persistence fails.

Current trade-offs:

- Progress belongs to one browser profile and does not synchronize across devices.
- Clearing site data removes progress.
- No personal data or algorithm input values are stored.
- A future account system can replace the storage adapter without changing the lesson event model.

## Accessibility

Current foundations:

- Semantic buttons for every interactive control
- Descriptive labels for icon-only buttons
- Live narration region for step changes
- Keyboard playback bindings for play/pause, stepping, restart, and speed
- Protection for native browser shortcuts and focused interactive elements
- Labeled custom-array field with described constraints and live validation errors
- Visible shortcut reference in every interactive array lesson
- Indexed memory tape paired with magnitude bars for visual redundancy
- Reduced-motion fallback for swaps, merges, search elimination, narration, code emphasis, and playback pulses
- Live prediction feedback with retryable answers
- Disabled answer state only after a correct response
- Reduced-motion media query
- Responsive layouts that preserve content order

Known gaps:

- Screen-reader behavior still needs manual verification with multiple browser and assistive-technology combinations.

## Performance

The current timelines are intentionally precomputed. For small teaching inputs, this makes seeking and replay simple while memory use remains negligible.

For algorithms that generate very large traces, possible strategies include input-size limits, event compression, checkpoints, or lazy generation. Merge Sort creates recursive split, comparison, and merge events while Binary Search creates only logarithmically many checks; none of those strategies is justified by the input limit of eight educational values.

## Delivery pipeline

The GitHub Actions workflow has two responsibility boundaries:

1. The quality job installs the lockfile exactly, then runs tests, static analysis, and the production build.
2. The deployment job runs only for a verified `main` build and receives the `pages: write` and OpenID Connect permissions required by GitHub Pages.

Pull requests run the same quality gate but cannot upload or deploy the site. Actions are pinned to full commit SHAs to reduce the risk of a mutable third-party tag changing the pipeline unexpectedly. Vite prefixes production assets with `/cartesian-interactive-algorithms/`; local development stays at `/`.

## Deferred decisions

- **Global state library:** local state is sufficient today.
- **Animation library:** CSS keyframes and transitions cover the current semantic choreography. Revisit this only when interruptible or layout-measured timelines become difficult to coordinate reliably.
- **Backend:** progress can begin in local storage.
- **Content management:** typed local lesson modules are simpler at the current scale.
- **Routing library:** the typed hash layer supports the current flat catalogue and works without server fallback configuration on GitHub Pages. A dependency becomes justified for nested layouts, route loaders, or URL parameters.

These are deliberate deferrals, not missing architecture. Each should be revisited when a concrete feature makes the current solution painful.
