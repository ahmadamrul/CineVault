# CineVault — QA Test Plan
Workspace: current dir (root, no nested folder)
Stack: React/Vite + TMDB API
Severity: Critical / High / Medium / Low / Cosmetic

Areas:
1. Navigation & routing
2. Homepage (hero, trending, popular, top-rated, TV)
3. Movie detail (poster, backdrop, overview, rating, genres, cast, recommendations, trailer/empty-state)
4. TV detail (same structure)
5. Search (movie + TV) — loading, empty, error
6. Genre filter
7. Favorites / Watchlist — localStorage persistence after refresh
8. Responsive (mobile/tablet/desktop)
9. API errors / rate limit / missing data
10. Accessibility (contrast, aria-labels)

Bug report format: Title, Severity, Env, Repro steps, Expected, Actual, Evidence, Suspected cause.
Retest required after fix.
