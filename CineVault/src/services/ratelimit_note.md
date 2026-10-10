# Rate Limit Note (TMDB)
- Free tier: 40 requests / 10 seconds
- Handle 429 with graceful retry / empty-state
- No hardcoded key — .env.example + USE_MOCK fallback
