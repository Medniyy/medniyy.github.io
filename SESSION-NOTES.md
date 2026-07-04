# ATH site — session memory (last updated 2026-07-04)

## Repo & deploy
- **Live site:** https://ath.camera/
- **GitHub Pages repo:** `Medniyy/medniyy.github.io`
- **Local folder:** `C:\Users\medni\Desktop\Presentation\ath-camera-rebuild`
- **Preview locally:** `python -m http.server 5173` → http://localhost:5173/

## Site version
- **Redesign v4 (2026-07-04)** — one-screen site, production entry `index.html`
  (details: `CHANGELOG-2026-07-04-redesign-v4.md`; v2 rollback: `git show 16aac16:index.html`)
- No hero showreel anymore; intro = typed slogan in screen center → floats up
- **Gallery:** 26 items in `index.html` → `const items = [...]` (~line 435); swipe / mouse drag / wheel / arrow keys, no visible controls

## Carousel order (current — 2026-07-04)
| # | Client | Title | Notes |
|---|--------|-------|-------|
| 1 | Solflare | Solana Summer Song | custom poster (`?v=custom`) |
| 2 | Solana | Friends Edition | |
| 3 | Solana | Moon Camp trailer | custom poster |
| 4 | Seeker | Live motion | poster frame ~17.97s; labels swapped (Seeker top) |
| 5 | Superteam Thailand | Launch Video | NEW 2026-07-04 |
| 6 | MonkeDAO | Return to Monke trailer | custom poster |
| 7 | Solflare | IRL ELI5 tutorials | PHYSICAL vs DIGITAL |
| 8 | Solana | Me and Solana every night… | custom poster |
| 9 | IslandDAO | Solana Summer Vibes | poster frame 21s (replaces Accelerate Miami slot) |
| 10 | Solflare | Feature cinematic promo | |
| 11 | Metaplex · 1st prize | Solana Global Content Comp. | custom poster |
| 12–24 | … | Shield, Wallet Dealers, Pudgy, Beyond Speculation, Birthday, aesthetics 1/2, Shield promo/overview, GTA 6, comedy 1/2, Private sends | |
| 25 | Solana | Summit Berlin 2026 trailer | custom poster; end of carousel |
| 26 | Solflare | Accelerate Miami trailer | moved to end |

## Custom posters
| Carousel # | Poster | Source |
|------------|--------|--------|
| 1 | `status_2067549038333858281_1.jpg` | user PNG `solanasummersongposter.png` |
| 3 | `status_2044066170471624711_1.jpg` | user file |
| 4 | `status_2072637765699977466_1.jpg` | video @ 17.97s |
| 6 | `status_2058151170733191561_1.jpg` | user file |
| 8 | `status_2052767900910731569_1.jpg` | user file |
| 9 | `status_2066887600003277054_1.jpg` | video @ 21s |
| 11 | `status_1898652306478100757_1.jpg` | user file |
| 25 | `status_2061408037789913499_1.jpg` | user file |
| 26 | `status_2051320555933171725_1.jpg` | user file |

Carousel uses `?v=custom` on custom poster paths. Videos use `preload="none"`.

## New video files (2026-07 batch)
- `status_2067549038333858281_1` — Solana Summer Song
- `status_2072637765699977466_1` — Seeker
- `status_2073358201744175422_1` — Superteam Thailand Launch
- `status_2073010933564342558_1` — IRL ELI5
- `status_2066887600003277054_1` — Solana Summer Vibes

## v3 TV wall
- **Not live** — user keeps in repo/archive; do not promote until asked
- Preview: http://localhost:5173/v3/
- Folder: `v3/` (screens.json, tv.js, canvas assets)

## Git / ignore
- `.gitignore`: `videos/raw/`, `stitch-proposals/`
- Do not commit: `ATH Website.zip`, `ATH Website/`

## Auth
- `git push` → `git credential-manager github login` if 403
