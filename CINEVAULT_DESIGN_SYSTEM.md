# CineVault — UI/UX Design System (v1.0)

Root: current workspace (`C:\Users\ahmad`) — no nested folder.

## Palette (dark cinematic)
- bg: #0b0c15, surface: #13142a, card: #181b35, border: #2a2d4a, accent: #e8b84d (gold), text: #f0f0f5 / #a0a4c0 muted, error: #e86a6a, success: #6ae86a.

## Typography
- Sans-serif system (Inter/Segoe). Headline 2.5rem bold, body 1rem/1.6, muted 0.875rem.

## Layout
- Responsive: mobile (1 col) → tablet (2 col) → desktop (4-5 col) → large desktop (6 col). Max-width 1280px centered.

## Components
- Hero (backdrop + gradient, title, rating, CTA). Movie/TV cards (poster 2:3, title, year, rating badge, genre chips). Detail (2-col: poster + info; cast row; recommendations; trailer embed if YouTube key exists else empty-state banner). Search (input with icon, loading skeleton, empty-state message, error banner). Favorites/Watchlist (persisted to localStorage; toggle heart/plus on card; list page with remove action).

## States
- Default, hover (lift shadow + border), focus (accent ring), active (pressed), disabled (50% opacity, no pointer), loading (skeleton shimmer), empty (illustrated message), error (red banner + retry).

## Accessibility
- Keyboard nav (Tab through cards/search), focus visible, aria-labels on icons, alt text on posters, color contrast ≥4.5:1, reduced-motion respected.

## Responsive
- Mobile nav collapses to bottom bar; detail stacks vertical; cards scale 1→2→4 cols.
