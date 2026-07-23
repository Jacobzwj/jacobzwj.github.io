# jacobzwj.com

Personal academic website of **Wanjiang Jacob Zhang** (张皖疆), Research Assistant Professor at the Department of Language Science and Technology, The Hong Kong Polytechnic University.

**Live site: [jacobzwj.com](https://jacobzwj.com)**

## About

Hand-coded static site — no framework, no build step. Designed as an editorial page: Fraunces & Inter (self-hosted), warm paper palette, hairline rules.

Notable details:

- **Readership section** — a Natural Earth world map choropleth of visitor locations plus per-paper read counts, refreshed daily by a GitHub Action ([`stats.yml`](.github/workflows/stats.yml)) pulling from a privacy-friendly [GoatCounter](https://www.goatcounter.com/) instance (no cookies, anonymous).
- Fonts are self-hosted so the site loads everywhere, including mainland China.
- HK / MO / SG appear as dot markers on the map (too small for 110m country polygons).

## Structure

```
index.html        all content
styles.css        design system
script.js         reveal animations, nav spy, readership rendering
assets/           photo, fonts, world map, stats.json, CV
scripts/          stats fetcher (runs in CI)
```

© Wanjiang Jacob Zhang. Content may not be reproduced without permission.
