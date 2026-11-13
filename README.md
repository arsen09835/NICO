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

Shared styles are in `dist/styles.css`. Page-specific styles are in `dist/cosa-acquistiamo.css` and `dist/sgomberi.css`. Gmail contact routing is in `dist/contact.js`; the recipient is `nicholaslisoni7@gmail.com`. Telephone and WhatsApp links use `+39 349 426 2546`.

### Hosting

The existing hosted website is https://arc-lisoni-studio-4-1110.arsenbryt.chatgpt.site/ . Its Site identity is retained in `.openai/hosting.json`. Keep the current audience and hosting identity when publishing updates.

A GitHub push records source changes; it does not, by itself, redeploy the existing hosted website. No GitHub Pages or other deployment automation has been enabled by this import.

### Import provenance

Imported from Site source commit `d72a00ec4b16c68369823a7f73e096774b7618f5` on 13 November 2026, including all three pages and their local assets. Existing repository history and license are preserved.
