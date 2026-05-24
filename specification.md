# MemoryBuilder Project Context & Specifications (v2)

## Project Overview
* **Name**: memorybuilder
* **Version**: 2.0.0
* **Description**: React-based responsive web application for memory building, wrapped with Capacitor for cross-platform Android and iOS deployment.
* **Root Directory**: `memory-builder`

---

## Technical Stack
* **Framework**: React 19
* **Language & Compiler**: TypeScript 6 / ES Modules
* **Build System & Dev Server**: Vite 8
* **Styling**: Bulma CSS 1.0 (with Sass support)
* **Mobile Runtime Wrapper**: Capacitor 6 (Android & iOS)

---

## Key Libraries & Dependencies
* **Core Packages**:
  * `react` (^19.0.0): Core view framework
  * `react-dom` (^19.0.0): DOM renderer
  * `bulma` (^1.0.4): Responsive CSS UI system
  * `sass` (^1.72.0): SCSS compiler supporting modular styles
* **Mobile Integration**:
  * `@capacitor/core` (^6.0.0): Client bridge
  * `@capacitor/cli` (^6.0.0): Command line tool
  * `@capacitor/android` (^6.2.1): Android platform runtime shell
  * `@capacitor/ios` (^6.2.1): iOS platform Xcode runtime shell

---

## Game Rules
A sequence of random color blocks is presented to the user and shown for a set period of time.
After this time, the sequence disappears (blocks turn white), and the user needs to recreate the exact order by dragging and dropping color blocks onto target cells.

* **Drag-and-Drop UX**: Color options sit in a palette at the top (`SelectGrid`). Target question slots (white background, red dashed border) are displayed at the bottom (`MemoryGrid`).
* **Game Progress States**:
  1. **Start Screen**: User sees the settings panel. Pressing **Start** initializes Round 1.
  2. **Memorisation State**: A new sequence of blocks is shown. The status is set to "First Round" or "Correct" / "Incorrect". The user has a set period of seconds (memorizing time) to look at the blocks. The action button displays **Start Round**.
  3. **Recall/Building State**: Clicking **Start Round** or waiting for the timer to reach 0 turns target cells to blank question blocks. The action button changes to **Next Round**. The user drags and drops colors to rebuild the sequence.
  4. **Evaluation State**: Clicking **Next Round** evaluates the block sequence:
     * **If Correct**: State increments `round` by 1, appends new blocks to the grid, increases the memorization duration, and begins the memorization state.
     * **If Incorrect**: State reduces remaining time (memorization penalty time) and starts the memorization timer again, showing incorrect cells and allowing the user to correct them until time runs out.

---

## Draggable UI/UX Refined Rules (React Implementation)
1. **Static Source**: Built using absolute CSS layering (`static-layer` beneath `drag-layer` inside `SelectBlock.tsx`). When an element is dragged, the transparent drag placeholder reveals the static colored block directly beneath it, showing a clean copy operation.
2. **Drag Preview**: Configured in native drag systems. The custom drag image is formatted inside `SelectBlock.scss` to scale dynamically to **90%** of its size and **80%** opacity.
3. **Hover Preview**: Achieved by introducing a global `draggedColourPos` pointer state in `MemoryGameContext.tsx`. When a color block is being dragged, any target cell (`MemoryBlock.tsx`) triggering an `onDragEnter` event temporarily adopts that color as its background. On `onDragLeave` or drop, the cell resets its preview back to normal.
4. **No Return Animation**: When drag actions are cancelled, target cells reset instantly. We disabled the default return animation by applying `transition: none !important; opacity: 0 !important;` styles inside `SelectBlock.scss`.
5. **Target Stability**: Target grid boxes use explicit width/height dimensions (`40px`) and `MemoryGrid.scss` enforces explicit pixel grid tracks (`repeat(10, 40px)`) combined with `width: max-content`. This guarantees **absolutely zero layout shift** or alignment distortions when new blocks are appended.

---

## Available Settings (configured at round 0)
1. **Number of blocks to start with**: Min 3, Max 110 (default 3)
2. **Number of blocks to increase after every round**: Min 1, Max 5 (default 1)
3. **Number of colours to use**: Min 3, Max 8 (default 6)
4. **Memorising time added after each round**: Min 1s, Max 7s (default 1s)
5. **Memorising penalty time reduced after incorrect answer**: Min 1s, Max 3s (default 1s)

---

## Project Structure
* **`src/interfaces/colours.ts`**: Declares arrays for standard game colors, contrasting borders, and utility colors.
* **`src/context/MemoryGameContext.tsx`**: Replaces Angular's RxJS-based singleton services. Hosts game state machine context, state parameters (`round`, `blocks`, `showTime`, `timePenalty`, `isMemorising`, `isCorrect`), active timers, local storage synchronization, and range sliders mutators.
* **`src/hooks/useMemoryGame.ts`**: Re-usable custom hook enabling child components to safely consume game states.
* **`src/components/shared/Slider.tsx`**: Lightweight customizable slider component wrapping range input tracks.
* **`src/components/memory/SelectBlock.tsx` / `SelectGrid.tsx`**: Renders choices and implements HTML5 drag start events.
* **`src/components/memory/MemoryBlock.tsx` / `MemoryGrid.tsx`**: Handles drop operations, preview hovers, and incorrect answer outlines.
* **`src/components/memory/MemoryGame.tsx`**: Main gameplay view orchestrating level status panels, alert notifications, and action buttons.
* **`src/components/countdown/Countdown.tsx`**: Secondary countdown clock calculating days/hours until project targets.
* **`src/App.tsx` / `src/main.tsx`**: Render initialization files importing global stylesheets.

---

## Development Commands
* **Local Web Dev Server**: `npm run dev` (Runs Vite server at `http://localhost:5173/`)
* **Production Asset Compiler**: `npm run build` (Compiles static assets into `/dist`)
* **Capacitor Assets Sync**: `npx cap sync` (Synchronizes compiled bundles into Android/iOS directories)
* **Code Linter**: `npm run lint` (Checks styles and coding standards)
* **Code Formatter**: `npm run pretty` (Applies Prettier code formatting)
