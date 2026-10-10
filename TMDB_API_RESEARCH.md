# CineVault — TMDB API Research (BabuResearcher)
Workspace root: E:\Code\CineVault (current CWD: /c/Users/ahmad)

## Auth
- Base URL: https://api.themoviedb.org/3/
- Auth: API key via `api_key=` query param OR `Authorization: Bearer <token>` header
- Key must NOT be hardcoded; use `.env` / env config
- Rate limits enforced; use SSL (https)

## Key Endpoints (v3)
- Trending: /trending/movie/week, /trending/tv/week
- Popular: /movie/popular, /tv/popular
- Top Rated: /movie/top_rated, /tv/top_rated
- Now Playing / Upcoming: /movie/now_playing, /movie/upcoming
- Details: /movie/{id}, /tv/{id} (supports append_to_response for credits, videos, recommendations, images)
- Search: /search/movie, /search/tv (query, page, include_adult, language)
- Genres: /genre/movie/list, /genre/tv/list
- Credits: /movie/{id}/credits, /tv/{id}/credits
- Videos: /movie/{id}/videos, /tv/{id}/videos (YouTube trailers)
- Images: /movie/{id}/images, /configuration (base image URLs)

## Image URLs
- Base: https://image.tmdb.org/t/p/
- Sizes: w200, w300, w500, original; backdrop_path / poster_path / profile_path

## Response Structure
- Pagination: page, total_pages, total_results, results[]
- Movie fields: id, title, original_title, overview, poster_path, backdrop_path, release_date, vote_average, vote_count, runtime, genres[] (id, name), genres_ids only in search results

## Videos / Trailer
- /videos returns videos[] with site (YouTube), key, name, type (Trailer, Teaser)
- Build YouTube embed: https://www.youtube.com/embed/{key}
- Empty state required when no videos or site != YouTube

## Errors / Rate Limits
- Enforce rate limiting; return user-friendly error/loading/empty states
- Handle missing poster/backdrop gracefully (placeholder)

## Env Config Required
- TMDB_API_KEY in `.env`
- Do NOT commit API key
