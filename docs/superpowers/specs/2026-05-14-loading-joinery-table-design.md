# Loading Joinery Table Design

## Goal

Replace the current `Loading Sanctuary...` spinner-style loading screen with an elegant, minimal animation that assembles a dining table and runs until the website content is ready.

## Scope

This change affects:

- The app loading state UI in `src/App.tsx`
- The visual loading animation implementation, likely as a dedicated component in `src/components/`

This change does not affect:

- Page routing
- Content loading logic
- Post-load page animations

## Requirements

- Remove the loading spinner and loading text treatment currently used in the app shell.
- Replace it with a captionless animated dining-table assembly.
- The animation must feel elegant and minimal.
- The animation must loop until the site is loaded.
- The animation must not use a circular spinner metaphor.
- The animation must remain visually lightweight and fast to render.

## Visual Direction

### Concept

Use a `Joinery Build` animation:

- A tabletop slab is visible in a softened initial state.
- Two table legs rise upward and align beneath the tabletop.
- Once aligned, the tabletop settles into full presence.
- The finished table holds briefly, then the motion loops.

### Motion Character

- Smooth, restrained easing
- No bounce-heavy motion
- No playful overshoot
- No rotating parts
- Very subtle final settling movement once the table is assembled

### Composition

- Centered in the viewport
- Built from simple geometric shapes rather than detailed illustration
- Approximate parts:
  - 1 tabletop
  - 2 legs
- Optional subtle shadow or grounded line beneath the table if it improves legibility

### Color

- Use the site’s existing warm cream and brown palette
- Table pieces should feel wood-inspired, not flat black or bright accent color
- Keep contrast sufficient without overpowering the screen

### Text

- No caption
- No loading sentence
- No progress label

## Behavior

- Show the loading animation whenever global page content is still loading.
- Stop showing it as soon as the current loading gate resolves.
- The animation should be CSS-driven where possible for simplicity and performance.
- The component should not depend on timers in JavaScript unless absolutely necessary.

## Implementation Direction

### `src/components/LoadingJoineryTable.tsx`

- Create a dedicated loading component.
- Render the table using simple nested `div`s or lightweight SVG.
- Prefer CSS animation with staggered timing for the legs and tabletop settle.

### `src/App.tsx`

- Replace the current spinner/loading text block with the new loading component.
- Keep the same loading condition already used by the app.

## Testing

- Verify the loading screen renders while `isLoading` is true.
- Verify the spinner markup/text is no longer present.
- Verify the new loading component is shown instead.
- Verify the normal app shell renders once loading completes.

## Risks

- Overdesign could make the loader feel gimmicky instead of premium.
- Too much motion could make the loop distracting.
- SVG or CSS timing that is too subtle may become unreadable on smaller screens, so proportions and contrast must be checked.
