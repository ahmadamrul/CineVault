# CineVault
Movie + TV discovery app using TMDB API.

## Setup
1. `npm install`
2. Copy `.env.example` to `.env` and add `VITE_TMDB_API_KEY`
3. `npm run dev` (dev) or `npm run build` (production)

## Features
- One responsive film grid with a single Popular / Trending Weekly / Today / Rilis Terbaru / Top Rated / Upcoming dropdown, with type, genre and country filters and load-more pagination
- Movie / TV search with loading/empty/error states
- Movie detail (cast, recommendations, trailer, favorites, watchlist)
- TV listing + TV detail
- Genres route
- Favorites & Watchlist (localStorage)
- 404 page + responsive layout
- API fallback behavior

## Routes
`/`, `/movie/:id`, `/tv`, `/tv/:id`, `/search`, `/genres`, `/favorites`, `/watchlist`, `/watch/:id`, `/watch/tv/:id?season=1&episode=1`

## Build
`npm run build` — verified passing.

## Video playback
External movie servers are enabled by default. The Watch page shows an advertising warning in a native dialog before mounting the iframe. Cancel and Escape leave the player unloaded; accepting mounts only the selected server. Switching server or trailer shows the warning again. The site itself does not inject advertising scripts.

Set `VITE_ALLOW_EXTERNAL_PLAYERS=false` for native-video-only mode. Restart Vite after changing environment settings.

`/watch/:id` uses the selected TMDB movie ID with two free third-party embed servers (VidSrc.sh and VixSrc). The Trailer button remains a separate option. Movie availability and playback depend on the external provider; an iframe loading is not proof that its stream works.

`/watch/big-buck-bunny` plays the complete Blender open movie without an API key. It obtains a 480p MP4 from Blender's PeerTube REST API, with Internet Archive as fallback. Attribution: © 2008 Blender Foundation, CC BY 3.0, https://peach.blender.org/about/.

TMDB metadata now connects directly to `https://api.themoviedb.org/3`; no local Python proxy is needed. Set `VITE_TMDB_BASE_URL` to use a different metadata endpoint.

## Video quality
The detail and watch pages query VidSrc.sh's public `/info/movie/{id}.json` endpoint with a 10-second timeout and a five-minute memory cache. The label names its source. 1080p / 720p are resolution labels and do not prove a Blu-ray source. CAM or BD is shown only when explicitly present in the server value; otherwise the source remains unverified. Server 2 does not inherit Server 1's quality. Failed checks display an unknown state rather than guessing from the TMDB rating or release date.

## October 10 catalog and playback update
- Server 2 is now VixSrc (`https://vixsrc.to/movie/{tmdbId}/`), replacing the old VidSrc.to embed. Its public API requires no key. TV embeds use `/tv/{id}/{season}/{episode}/`.
- The catalog has one ordering dropdown, plus separate type, genre and origin-country filters. Quick collections cover Korean dramas, Indonesian films, Thailand and Japanese animation. TMDB supplies live catalog data; it does not provide the full video stream.
- TV detail pages now load seasons and their actual episode lists. `/watch/tv/:id?season=1&episode=1` passes both numbers to the selected player.
- The homepage uses a compact black/red cinema layout inspired by the reference, with six poster columns on desktop and three on mobile. No account is required and CineVault injects no advertising scripts. Third-party iframe ads remain outside its control and still require the warning dialog.
- Subtitle preferences are limited in the CineVault controls to Indonesia and English. VidSrc receives `ds_lang=id,en` by default, or `ds_lang=en`. This is a documented language priority, not a guarantee that a track exists or is synchronized. The third-party CC menu can still list other languages.
- VixSrc does not document a subtitle-language URL parameter: `lang` selects audio. Its CineVault language control therefore displays English as a disabled indicator with instructions to select English in the native CC menu. Indonesian tracks have not been verified there. No misleading subtitle parameter is sent.
- Quality remains unknown for TV episodes and Server 2; movie resolution from Server 1 is not assumed to be BD.

IDLIX was inspected as a design reference. No documented official public API was found during this check, so the app uses the existing TMDB integration rather than an unverified IDLIX scraper.


## Simplified homepage and poster quality
Homepage now keeps search and one ordering dropdown visible. Type, collection, genre and country live inside the collapsed “Genre & negara” menu. Collection buttons and the extra homepage banner were removed; the featured panel is smaller.

Catalog loading collects 24 distinct titles at a time from TMDB's 20-item pages. Successful page responses are reused while browsing the current mounted catalog. Additional batches preserve API leftovers and order, and fetch more pages as necessary after deduplication. Layouts use 6, 4, 3 or 2 columns so each 24-title batch fills its rows. A catalog that actually ends with fewer titles remains incomplete rather than duplicating films.

Poster badges use Server 1's real quality response. CAM/HDTS and BD are displayed only when reported; 1080p/720p remain HD resolution labels, not BD claims. Missing data shows “Kualitas ?”; an explicit missing video shows “Belum tersedia”. Series quality is unknown until an episode is selected. Checks start near the viewport, run at most four at once, and share cached/in-flight results with the detail quality component.

Verification: 24 initial cards and six aligned cards in the final desktop row; load-more produced 48 unique cards. Live metadata showed HD 1080p on multiple posters and CAM for Verity. Homepage search for Inception returned 12 titles. Batch/deduplication/end-of-catalog tests, badge classification, and quality queue/cache checks passed.

## Cinematic homepage design
The reference screenshots now guide a full-width backdrop hero, floating translucent navigation, five manually selectable featured titles, and a horizontal recommendation rail with poster/backdrop cards. Hero content, ratings, dates and genres come from the actual catalog; no episode counts or latest-episode claims are fabricated. Film links lead to the existing detail and warning-gated watch flow. The layout retains search, collapsed filters, 24-item batches, and real quality labels on hero/recommendation/grid posters.

The new styles live in `src/cinema.css` and apply the full-width layout only to homepage and TV catalog routes. Detail and watch pages keep their existing compact layout. Hero transitions honor reduced-motion preferences. Desktop shows three recommendation cards at a time; phones show one and a preview of the next.

UI verification: hero selection changed title and destination; the recommendation arrow advanced the scroll rail. At 1440px the document stayed within its 1425px content width. At 390px, client and scroll widths both measured 375px and the movie grid retained three 105px columns. Screenshots: `state/cinema-desktop.png`, `state/cinema-mobile.png`.

## Navigation, autoplay and personal collections
- Header selection now takes the query filters into account: Drakor and Anime highlight themselves rather than Beranda. The country menu provides direct catalog links, closes on navigation and fits mobile screens. Search uses a magnifying-glass control; optional filters use SVG icons.
- Featured titles and the recommendation rail advance every 5 seconds. Hovering each area pauses its timer; a shared pause/resume control is available, and hidden browser documents do not advance. Manual dots/arrows remain available.
- Movie/TV details use heart (Favorite) and bookmark (Watch later) actions with immediate accessible toast feedback, without page reloads. Saved metadata includes posters, year, rating and media type. Movie/TV IDs are distinguished.
- Favorites and Watchlist render poster cards linking to detail, with remove controls and helpful empty states. They use localStorage on this browser/device, without account sync. Legacy title-only entries are hydrated from TMDB without resurrecting items the user has removed.
- Movie and TV detail recommendations now render linked poster grids rather than plain title boxes.
- Added the CineVault SVG favicon in `public/favicon.svg`, linked from `index.html`; live request returned HTTP 200 with SVG content type.

Verified active Drakor/Anime/country navigation, both automatic sliders, favorite toast and persistence through reload, Watchlist feedback/removal, and recommendation navigation from `/movie/969681` to `/movie/634649`. Temporary collection entries created for testing were removed; pre-existing saved state was preserved. Saved-store metadata/type/toggle/error handling checks passed. Mobile document client and scroll widths matched at 375px.

### Server 3: VidFast
- Movie/TV embeds use https://vidfast.vc/ and require no application API key.
- The iframe is mounted only after the existing ad warning; playback then requests autoPlay=true. Third-party ads/pop-ups remain possible.
- Subtitle preference uses the documented sub=id/en parameter; tracks depend on the title. Quality/source selection stays inside the provider player.
- No HD/BD badge is inferred from resolution. Live check: Inception (TMDB 27205) played at 1920x1080 with advancing playback time. This is not a guarantee for other titles.

