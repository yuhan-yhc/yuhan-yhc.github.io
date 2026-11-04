# Personal academic website (GitHub Pages)

## Goal
Single-page personal academic site, hosted on GitHub Pages at https://<username>.github.io.
Reference for layout (clean, compact): https://0frett.github.io/#top — match its structure but
make the visual design more polished (typography, spacing, subtle motion, good mobile layout).

## Sections (anchor links in a sticky top nav)
- About: photo, name, title/affiliation, short bio, icon links (Email, Google Scholar, GitHub, LinkedIn, CV PDF)
- Publications: list with title, authors (highlight my name), venue, year, links (PDF/code/project)
- Experience: Education + Work subsections (timeline style)
- Footer with copyright; light/dark mode toggle (respect prefers-color-scheme, remember choice)

## Hard requirements
- Content is separated from presentation. The owner updates the site ONLY by editing files in `data/`
  (`profile.yml`, `publications.yml`, `experience.yml`) and dropping files into `assets/`. No HTML editing needed.
- No build step the owner must run locally. Either plain static files that fetch/render data at load,
  or a GitHub Actions workflow that builds and deploys automatically on push to `main`.
- No heavy frameworks; fast, accessible (semantic HTML, contrast, keyboard nav), responsive.
- Provide a README with a short "How to update my content" guide (Traditional Chinese is fine) and
  example entries for each data file.
- Fill data files with clearly marked placeholder content; do not invent real facts about the owner.

## Workflow
Work on a feature branch and open a PR; keep commits small. Deploy via GitHub Pages (Actions or branch).
