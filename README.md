# At the Table — Weekly meal planner (PWA)

A phone-installable web app: plan the dishes you'll cook, get a shopping list
grouped by dish, place plates into the week's schedule (Luis / Mónica), print a
PDF menu, and back up your data.

## Files
- `index.html` — the whole app
- `manifest.json` — makes it installable ("the json")
- `sw.js` — service worker, lets it open offline after the first load
- `icon-192.png`, `icon-512.png` — app icon
- `README.md` — this file

Data is saved on the phone with `localStorage`. Use the **Backup** button
(top bar) to export/import a `.json` file when switching phones.

## Publish it (free) with GitHub Pages
1. Create a new GitHub repo (e.g. `at-the-table`) and upload ALL the files in
   this folder to the repo root (index.html must be at the top level).
2. In the repo: **Settings → Pages → Build and deployment**.
   Set **Source: Deploy from a branch**, **Branch: main / (root)**, Save.
3. Wait ~1 minute. Your app is live at:
   `https://<your-username>.github.io/at-the-table/`
   (HTTPS — required for install & offline.)

Netlify or Vercel also work: "Add new project" → import the repo → deploy.
No build settings needed (it's a static site).

## Install on your phone (add the icon)
- **iPhone (Safari):** open the URL → Share → **Add to Home Screen**.
- **Android (Chrome):** open the URL → menu (⋮) → **Install app** /
  **Add to Home screen**.

It then opens full-screen like a normal app, with the chef-hat icon.

## Notes
- First open needs internet (it loads React from a CDN and caches it). After
  that it works offline.
- If you change files later, bump the cache name in `sw.js`
  (`attable-v1` → `attable-v2`) so phones pick up the new version.
