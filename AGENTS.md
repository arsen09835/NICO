# Working on NICO

## Source and scope

- This repository is the source for the Nicola website. `dist/` contains the authored source, not disposable build output.
- Use the latest repository state before making edits. Make only the changes requested by the user.
- Preserve all Italian copy, typography, colors, spacing, motion, imagery and behavior outside the requested scope. Do not redesign or rewrite copy without instructions.
- Preserve the shared sticky two-part header, existing navigation, Nicola footer and green floating WhatsApp widget unless the user requests a change.
- Existing pages are `/`, `/cosa-acquistiamo/` and `/sgomberi/`. Sgomberi has a light background and no body CTA section; it retains the WhatsApp widget.
- Gmail links target `nicholaslisoni7@gmail.com`; phone and WhatsApp links target `+393494262546`.

## Implementation and verification

- This is a buildless HTML/CSS/JavaScript site. Do not add a framework or new dependencies without a task-based reason.
- Keep shared changes in `dist/styles.css` and page-specific changes in the relevant page stylesheet.
- Preserve the vendored libraries and bundled assets unless a requested change requires an update.
- Preview with `python3 -m http.server 8000 --directory dist`, or use the environment's supported managed Site preview.
- Check relevant routes, local asset paths and desktop/mobile layouts. Check modified JavaScript with `node --check` when applicable.
- Do not commit credentials, temporary previews, screenshots, local caches, deployment archives or dependency directories.

## Repository and publication

- Preserve existing repository files and history. Do not force-push.
- Commit and push requested changes to this repository. Report the resulting commit or pull request.
- A GitHub push does not automatically update the existing hosted Site. If publication is requested, preserve the project identity in `.openai/hosting.json` and the Site's existing audience, and use the supported deployment workflow. Do not create a duplicate Site or enable public hosting without a request.
