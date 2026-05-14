# Mobile Bottom Dock Navigation Design

## Goal

Replace the current mobile hamburger menu with a fixed bottom navigation dock that behaves like an iPhone-style app dock while preserving the existing desktop navigation and top-header cart access.

## Scope

This change affects:

- Mobile navigation behavior in `src/components/SiteNav.tsx`
- Mobile page layout spacing in `src/App.tsx`
- Visual treatment of the mobile navigation dock

This change does not affect:

- Desktop navigation structure
- Cart placement in the top header
- Admin authentication rules
- Page routing model based on `PageKey`

## Requirements

- Desktop navigation remains unchanged.
- Mobile view removes the hamburger menu entirely.
- Mobile view adds a fixed bottom dock for page navigation only.
- The top header still shows the brand and cart control on mobile.
- The bottom dock includes `Home`, `Chairs`, `Tables`, and `Collections`.
- When admin is authenticated, the bottom dock adds an `Admin` item and all dock items reflow evenly.
- The existing long-press logo behavior for opening admin/login remains intact.
- Active mobile nav items must be visually distinct.
- Page content and footer must remain visible above the fixed dock on mobile.

## UX Design

### Header

- Keep the current sticky top header.
- Keep the logo/brand block and cart button.
- Remove the mobile hamburger trigger and dropdown menu.

### Bottom Dock

- Render only on mobile breakpoints.
- Use a fixed position near the bottom edge with safe horizontal inset.
- Style it as a rounded translucent dock with blur, warm-toned background, border, and soft shadow.
- Each dock item contains an icon above a short label.
- Active item uses stronger color, a subtle highlighted background, and fuller opacity.
- Inactive items use muted text and gain stronger contrast on press/hover.

### Icon Mapping

- `Home`: house
- `Chairs`: armchair
- `Tables`: table-like grid/surface metaphor
- `Collections`: stacked tiles/gallery
- `Admin`: shield or lock

Icons should come from the project’s existing icon library usage pattern if available. Prefer `lucide-react` since it is already installed.

## Behavior

- Tapping a dock item navigates directly to that page.
- If authenticated, `Admin` appears as an extra dock item.
- Dock item widths should not be hardcoded per page; layout should adapt cleanly whether there are 4 or 5 items.
- Cart behavior remains unchanged and continues to open from the header.

## Implementation Plan

### `src/components/SiteNav.tsx`

- Replace the mobile menu state and hamburger UI with a bottom dock renderer.
- Define a shared mobile nav item list from page metadata instead of maintaining separate desktop/mobile label sets.
- Add icon components for each page.
- Append the `Admin` dock item only when authenticated.
- Keep desktop nav links and top header cart behavior intact.

### `src/App.tsx`

- Add mobile-only bottom padding to the main content wrapper so the dock does not overlap page content.
- Add matching mobile bottom spacing around the footer area if needed so footer controls remain tappable.

## Error Handling

- If the user is not authenticated, no `Admin` dock item is shown.
- If the current page is `Admin` and auth is lost, the existing redirect behavior in `App.tsx` remains the source of truth.

## Testing

- Verify mobile nav shows 4 items when logged out.
- Verify mobile nav shows 5 items when authenticated.
- Verify active page styling updates correctly.
- Verify cart remains in the top header on mobile.
- Verify no hamburger button or dropdown remains in mobile view.
- Verify main content and footer are not hidden behind the dock.
- Verify desktop nav remains unchanged.

## Risks

- Fixed-bottom UI can overlap content if spacing is insufficient.
- Adding `Admin` dynamically can make items too tight on smaller devices if spacing is not balanced.
- Icon choice must stay visually legible at small sizes.
