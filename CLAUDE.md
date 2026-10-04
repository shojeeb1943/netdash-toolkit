# LicenBase NetDash fork: rules for Claude Code

This repo is the **source** of `https://licenbase.com/tools/`. The built site lives in `C:\dev\Licenbase.com\tools\` and is regenerated from here by `python import_tools.py` (run from that repo).

- Always **commit your changes here** before the site is rebuilt. The build reads this working tree, and `import_tools.py` refuses to run while it holds uncommitted edits.
- Branch is `licenbase`. Never add a `Co-Authored-By` trailer. Do not push; the user pushes.
- Do not hand-edit `lib/lb-chrome.generated.ts`, `app/icon.svg` or `public/favicon.svg`: they are regenerated from the LicenBase site files on every import. `tests/unit/branding-assets.test.ts` fails if the NetDash icon or logo comes back.
- Every tool needs a registry entry, a loader, one file per slug under `components/tools/`, and (for new tools) 3 FAQs in `lib/faqs/`. Run `pnpm typecheck`, `pnpm lint` and the unit tests before committing.
- Another session may be editing here too. Run `git status` first and stage only your own files.
