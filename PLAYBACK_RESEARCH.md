# Free playback sources checked on 2026-10-10

| Source | Integration | Live result |
| --- | --- | --- |
| VidSrc.sh | Movie iframe by TMDB/IMDb ID, no API key | `/embed/movie/27205` returned HTTP 200; sandboxed iframe rejected by provider, so use its documented ordinary iframe. Actual stream availability must be checked in the player. |
| VidSrc.to | Alternative movie iframe by TMDB/IMDb ID | `/embed/movie/27205` returned HTTP 200. |
| VidSrc.cc | Alternative embed | Returned HTTP 403 and `X-Frame-Options: SAMEORIGIN`; excluded. |
| Blender PeerTube REST API | Public JSON → 480p MP4 | JSON returned HTTP 200 with CORS; MP4 byte-range request returned HTTP 206, `video/mp4`. |
| Internet Archive Metadata API | Public item metadata → MP4 | `BigBuckBunny_328` returned HTTP 200 with CORS and CC BY metadata. MP4 range request returned HTTP 206; used as fallback. |
| Google sample video bucket | Direct MP4 | Returned HTTP 403; excluded. |

Documentation:
- https://vidsrc.sh/vidsrc/docs/
- https://vidsrc.to/
- https://docs.joinpeertube.org/api/rest-getting-started
- https://docs.joinpeertube.org/api/embed-player
- https://archive.org/developers/md-read.html
- https://archive.org/developers/search.html
- https://peach.blender.org/about/

TMDB provides catalog metadata and provider availability; it does not supply a movie MP4 here. Keep trailers, third-party movie players, and the Blender open movie separately labelled. HTTP 200 alone proves endpoint reachability, not media playback or permission to distribute every title. External providers can change or remove streams.

## Browser verification
- `/watch/27205`: TMDB title resolved to Inception. Started Server 1 with the player's Play control. Playback advanced to 0:24 with total duration 2:28:08; this verifies playback for this title during this check.
- `/watch/big-buck-bunny`: Blender API resolved the 480p source. Pressed native Play and observed the app status `Sedang diputar`.
- `npm run build`: passed after final source changes.
- Screenshot: `state/playback-verified.png`.
- Server 2 endpoint was checked for reachability; its movie playback was not independently verified.

## Catalog, warning and quality update
- Homepage now uses one filter dropdown and one poster grid, with load-more pagination. Weekly pagination appended 17 distinct titles to the initial 20; switching filter cleared that list. Header search for Inception returned 12 matches.
- Desktop layout was checked at 1440px; mobile at 390px. The mobile document had equal client and scroll widths (375px excluding the scrollbar), with three poster columns and exactly one dropdown.
- VidSrc remains enabled per the user's follow-up. Before advertising-warning acceptance: zero player iframes. After Cancel: zero. After Continue: one. Switching to Server 2: warning reopened and zero player iframes until acceptance.
- VidSrc.sh documents a public CORS-enabled `/info/movie/{id}.json` endpoint. Inception (27205), Spider-Man: Brand New Day (969681), and The Odyssey (1368337) each returned `quality: 1080p` during this check. This is provider-reported resolution, not independent proof of BD/Blu-ray origin.
- Quality is shown on the detail and watch pages. Unknown types or unavailable checks remain explicitly unverified. Server 2 does not reuse Server 1's quality label.
- Quality classification checks passed for 1080p, HDCAM, HDTS, BDRip, DVD and unknown. A 1080p label preserves unknown CAM/BD provenance.
- Final build passed. Screenshots: `state/home-desktop.png`, `state/home-mobile.png`, `state/ad-warning.png`.

Quality documentation: https://vidsrc.sh/vidsrc/docs/#content-info

## Server 2, subtitle and country research — 2026-10-10
- Replaced VidSrc.to (HTML reachable, actual user playback failing) with independent VixSrc. The old embed internally loaded vsembed.ru; HTTP 200 did not establish media playback.
- VixSrc public docs describe movie and season/episode embed URLs without API keys, plus `autoplay`, `startAt` and audio `lang`. Its Inception player was started in the browser and the underlying video reached `currentTime=23.898`, `readyState=4`, `paused=false`. Total runtime was 8884s. English CC was listed; Indonesian was not present in the inspected menu. This verifies that title and that session only.
- VidSrc documents `ds_lang` as a comma-separated subtitle priority list. Default changed to Indonesia then English. English-only selection sends `ds_lang=en`. Its built-in tracks come from video-extracted captions and multiple subtitle providers. Language selection cannot repair a release mismatch by itself.
- OpenSubtitles offers a developer API but requires an API key and has download quotas. No account, developer credential or unlimited free access was invented. The existing provider subtitle integration works without a new key.
- TMDB discover filters support `with_origin_country` and `with_genres` for movie/TV catalogs. Korean drama collection uses TV + KR + Drama(18); Indonesia and Thailand use origin-country filters. Season and episode metadata come from TMDB.
- IDLIX page was viewed for layout inspiration. No official public API documentation was found. An unofficial archived downloader wrapper is not treated as a production API or integrated.

Sources:
- https://vixsrc.to/
- https://vidsrc.sh/vidsrc/docs/#subtitles
- https://developer.themoviedb.org/reference/discover-tv
- https://developer.themoviedb.org/reference/discover-movie
- https://opensubtitles.tawk.help/article/getting-started
- https://z2.idlixku.com/

## Verification after integration
- In the local app, Squid Game season 2 showed seven actual episodes. Episode 1 mounted `/embed/tv/93405/2/1?ds_lang=id,en` only after the ad warning was accepted. The stream played with `readyState=4`, `paused=false`, `currentTime=36.794512`; Indonesian text was visible automatically.
- Its native CC → Options menu exposes Subtitle delay. Clicking + changed 0s to +0.25s; Reset timing returned it to 0s. The app now explains the verified controls, including avoiding English-dub and forced tracks when full original-audio dialogue is wanted. This is a real correction control, not a claim that every subtitle has been synchronized.
- Selecting English in CineVault changed the embed to `ds_lang=en`.
- Local Inception Server 2 played inside the app: `currentTime=6.472025` then `21.025069`, `readyState=4`, `paused=false`, duration 8884.083829s, visible film frames. Zero iframes were present before its warning was accepted.
- Catalog URL checks passed for KR TV Drama, ID movies, TH latest films, weekly pagination and TV first-air sorting.
- Screenshots: `state/catalog-country.png`, `state/subtitle-timing.png`, `state/server2-playing.png`.
- Responsive verification at 390px: document client and scroll widths both 375px; poster grid has three 105px columns. Indonesia and Thailand filters each returned 20 corresponding film titles. Final production build passed.
