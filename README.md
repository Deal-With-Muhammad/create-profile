# Member Profiles

A small Next.js app for making one-page member profiles and downloading them as a PDF.

- Add as many members as you need. Each member becomes one A4 page.
- Upload a photo. It is cropped to a square and resized in the browser.
- Fill in Name, Branch / Area, Member No. and Position / Role. Use **Edit fields** to rename, reorder, add or remove fields (up to 10), and to change the page title and footer.
- Pick from four templates (Classic, Sidebar, Banner, Minimal) and five colours.
- **Download PDF** exports every member. The download icon on a member exports only that member.
- Your work is saved in the browser's local storage. Nothing is uploaded to a server.

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- HeroUI v3 + Tailwind CSS v4, light theme only
- `@react-pdf/renderer` for the PDF, generated client-side and lazy-loaded on first export

## How templates work

Each template in `src/templates/` is written once against a small set of primitives (`Page`, `View`, `Text`, `Image`, see `kit.ts`):

- `html-kit.tsx` renders them as DOM for the live preview.
- `src/lib/pdf.tsx` renders them with react-pdf for the export.

Both sides use the same layout code and the same units (1pt = 1px on a 595×842 canvas), so the preview matches the PDF. If you add a template, only use styles both renderers support: flexbox, longhand padding, margin and border properties, absolute positioning and numeric sizes. Then register it in `src/templates/index.ts`.

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
npm run lint
```
