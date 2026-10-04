# Website statistics

The homepage displays like and visitor totals from a statistics endpoint.

Local development uses `http://127.0.0.1:3002/statistics`. Start the service from the repository root with `node scripts/preview-statistics.cjs`. Records persist in `.preview-statistics.json`, which is ignored by Git. Do not publish local preview records.

For GitHub Pages, host a separate HTTPS statistics service and set `NEXT_PUBLIC_STATISTICS_URL` in the build environment before building. Static exports do not fall back to the localhost endpoint. Until a service is configured, totals display an em dash.

The endpoint receives POST JSON containing `id` (a browser-generated UUID) and `action` (`visit`, `like`, or `unlike`). It must return `{ "visitors": 1, "likes": 0, "liked": false }` with nonnegative integer totals and the requesting browser's like state. Support CORS for the published website origin, persistent storage, atomic updates, request validation, and rate limiting. The supplied preview server is for local use and must not be exposed publicly.

Visitors are unique browser identifiers, not verified individual people. Refreshes and language switches reuse the identifier. Different browsers or clearing local storage create new identifiers. Each browser can contribute one like and can cancel it. Counts refresh on each visit, on like changes, and every 30 seconds while the homepage remains open.
