# At the Table — Weekly meal planner (PWA)

A phone-installable web app: plan the dishes you'll cook, get a shopping list
grouped by dish, place plates into the week's schedule (Luis / Mónica), print a
PDF menu, and back up your data. Everything is **self-contained** — no internet
needed after it loads once, no build step, no external services.

## Files (upload ALL of these to the repo root)
- `index.html` — the page
- `app.js` — the app
- `icons.js` — the icons
- `react.production.min.js`, `react-dom.production.min.js` — React (bundled locally)
- `manifest.json` — makes it installable ("the json")
- `sw.js` — service worker (offline support)
- `icon-192.png`, `icon-512.png` — app icon
- `README.md` — this file

Data is saved on the phone with `localStorage`. Use the **Backup** button in the
top bar to export/import a `.json` file (e.g. when switching phones).

## Publish it (free) with GitHub Pages
1. Create a repo (e.g. `at-the-table`) and upload every file above to the repo
   **root** (index.html must be at the top level, not inside a subfolder).
2. Repo → **Settings → Pages**. Source: **Deploy from a branch**,
   Branch: **main** / **(root)**, Save.
3. Wait ~1 minute. Live at `https://<your-username>.github.io/<repo>/` (HTTPS).

Netlify or Vercel also work: import the repo, no build settings needed.

## Install on your phone (the icon)
- **iPhone (Safari):** open the URL → Share → **Add to Home Screen**.
- **Android (Chrome):** open the URL → ⋮ menu → **Install app** / **Add to Home screen**.

Opens full-screen with the chef-hat icon.

## Notes
- Tip: view it through the published URL (or a local web server), not by
  double-clicking the file — some phone browsers won't run a page opened
  straight from a file.
- If you edit files later, bump the cache name in `sw.js` (`attable-v1` →
  `attable-v2`) so phones pick up the new version.
