# NICO
Antique and design buying collectionsit.

## Website

This repository contains the current Nicola antique and design buying website, imported without changing its text, design or behavior.

The authored website source is in `dist/`. This is a buildless static site: HTML, CSS, JavaScript, local fonts and image assets. No package installation or build is required.

### Pages

- Homepage: `dist/index.html` → `/`
- Cosa acquistiamo: `dist/cosa-acquistiamo/index.html` → `/cosa-acquistiamo/`
- Sgomberi: `dist/sgomberi/index.html` → `/sgomberi/`

### Local preview

From the repository root, run:

```sh
python3 -m http.server 8000 --directory dist
```

Open `http://localhost:8000/`. Serve `dist/` as the website root so absolute asset URLs and page links resolve correctly.

### Making edits

Use this repository as the source for future changes. Modify only the requested elements, preserve the Italian copy unless a copy change is requested, and check the relevant pages at desktop and mobile widths. Commit and push completed changes to this repository.

Shared base styles are in `dist/styles.css`; the current typography, palette and responsive layouts are in `dist/design.css` and `dist/reference-adaptation.css`. Hero geometry is in `dist/hero-photo-background.js`; mobile category and process toggles are in `dist/mobile-disclosures.js`. Page-specific styles are in `dist/cosa-acquistiamo.css` and `dist/sgomberi.css`. Gmail contact routing is in `dist/contact.js`; the recipient is `nicholaslisoni7@gmail.com`. Telephone and WhatsApp links use `+39 349 426 2546`.

### Hosting

The original hosted website is https://arc-lisoni-studio-4-1110.arsenbryt.chatgpt.site/ . Its existing Site identity is retained in `.openai/hosting.json`.

The redesign was copied from https://nicola-redesign-1411.arsenbryt.chatgpt.site/ . That hosted redesign is preserved separately and must not be modified or redeployed when working on this repository. This import does not change either hosted website.

A GitHub push records source changes; it does not, by itself, redeploy the existing hosted website. No GitHub Pages or other deployment automation has been enabled by this import.

### Import provenance

Updated on 18 November 2026 from Editorial Redesign version 17, source commit `54020c1d77ddd6a36fc82fcd4f8ab2204c7527f6`. Every file under `dist/` is copied byte for byte, including all three pages, local fonts, image assets, styles and animations. Existing repository history, license and hosting identity are preserved.
