# AGENTS.md

## Cursor Cloud specific instructions

This is a **Next.js 16** personal portfolio/blog site (`shayaan-site-v3`). Single service, no database, no auth.

### Running the app

- **Dev server:** `pnpm dev` (runs on port 3000 by default)
- **Build:** `pnpm build`
- Scripts are defined in `package.json`

### Key caveats

- **Next.js 16 removed `next lint`**: The `pnpm lint` script will fail because `next lint` is no longer a valid subcommand in Next.js 16. There is no standalone ESLint configuration in the repo. Linting is effectively not available.
- **`pnpm.onlyBuiltDependencies` not configured**: pnpm may warn about ignored build scripts for `sharp`. This is non-blocking for development; sharp is only needed for optimized image processing in production.
- **Vercel Blob demo** (`/blob-demo`) requires a `BLOB_READ_WRITE_TOKEN` env var. Without it, the blob upload/file-management features won't work, but the rest of the site runs fine.
- **Content** is file-based MDX/Markdown in `content/`. No database needed.
- **Substack field notes** are fetched at runtime from `shayaanazeem.substack.com`; this degrades gracefully without network access.
