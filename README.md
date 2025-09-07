# Cascade Road Driving Range — One-page Website

Static, mobile-friendly website for the Cascade Road Driving Range. Designed to host on GitHub Pages. Sections: Home, Hours & Location, About, Contact/Map. Navigation links scroll to sections on the same page.

## Files
- `index.html` — Markup and sections
- `styles.css` — Responsive styling (mobile-first)
- `script.js` — Mobile nav toggle, smooth scrolling, dynamic open/closed status badge
- (Optional) `.nojekyll` — Disable Jekyll processing on GitHub Pages (recommended)

## Features
- Mobile-first, responsive layout
- Sticky header with anchor navigation
- Smooth scroll, with reduced motion respected
- Hours badge shows “Open now / Closed now” in America/New_York, highlights today’s hours
- Embedded Google Maps iframe for location
- Accessible: skip link, ARIA labels, keyboard-friendly nav

---

## Preview locally
Option A (quick): double-click `index.html` to open in your browser.

Option B (local server, recommended):
```sh
# From this folder
python3 -m http.server 8080
# Then open http://localhost:8080
```

---

## Deploy to GitHub Pages

You can host this site either from the repository root or from a `docs/` folder. The simplest is to deploy from the main branch root.

### 1) Create and push to a GitHub repository
If this folder is not yet a git repo:
```sh
git init
git add .
git commit -m "Initial website"
git branch -M main
git remote add origin https://github.com/spoonshuge/drivingRange.git
git push -u origin main
```

If a remote already exists and you want to use a different repo:
```sh
git remote remove origin
git remote add origin https://github.com/spoonshuge/drivingRange.git
git push -u origin main
```

### 2) Enable Pages
- On GitHub, go to: Repository → Settings → Pages
- Source: “Deploy from a branch”
- Branch: `main` and folder: `/ (root)`
- Save
- After a minute, your site will be live at:
  - User/Org site: `https://<your-username>.github.io/`
  - Project site: `https://spoonshuge.github.io/drivingRange/`

Recommended: add an empty `.nojekyll` file at the repo root to prevent Jekyll from altering static assets.

### Option: Deploy from `docs/` folder
- Move these files into a `docs/` directory
- In Settings → Pages, choose Branch: `main` and folder: `/docs`
- Save and wait for it to publish

---

## Optional: Custom domain
1) In the repo, go to Settings → Pages → Custom domain. Enter your domain (e.g., `www.example.com`) and save.
2) Create a `CNAME` file in the repo root containing exactly your domain (e.g., `www.example.com`).
3) DNS:
   - If using a subdomain (e.g., `www`), add a CNAME from `www` → `<your-username>.github.io`.
   - If using apex (e.g., `example.com`), add A records to GitHub Pages IPs:
     - 185.199.108.153
     - 185.199.109.153
     - 185.199.110.153
     - 185.199.111.153
4) Enable HTTPS in Pages settings when available.

---

## Editing content
- Address and hours: in `index.html` under the “Hours & Location” section.
- The open/closed badge uses `script.js` and assumes hours:
  - Sun–Fri: 8 AM – 7 PM
  - Saturday: 7 AM – 7 PM
  - Timezone: America/New_York
- Update styles in `styles.css`. Breakpoints are mobile-first; desktop layout starts at 780px/900px.

---

## Notes
- Smooth scrolling respects “prefers-reduced-motion”.
- The header offset is handled using `scroll-margin-top` on each section.
- The Google Map uses an embed iframe and a plain link for directions.
