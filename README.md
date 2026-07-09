# Shayaan Site v3

## Image performance pipeline (WebP + Vercel Blob)

This project now resolves local image paths to WebP-first URLs and supports storing image assets in Vercel Blob.

### Environment variables

- `BLOB_READ_WRITE_TOKEN`: required for blob uploads and the migration script.
- `NEXT_PUBLIC_SITE_IMAGES_BLOB_BASE_URL`: optional base URL used to resolve local image paths to blob-hosted `site-images/...` WebP URLs.

Example:

- `NEXT_PUBLIC_SITE_IMAGES_BLOB_BASE_URL=https://<your-blob-subdomain>.public.blob.vercel-storage.com`

### Migrate existing images to Blob

Use the migration script to convert referenced site images to WebP and upload them to `site-images/...` in Blob:

- Dry run (no upload): `pnpm images:migrate-to-blob -- --dry-run`
- Real upload: `pnpm images:migrate-to-blob`

The script writes/update `lib/site-image-manifest.json` with local-path to blob-url mappings.
