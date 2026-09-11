---
name: testing-shayaan-portfolio
description: Runtime regression testing for the shayaan-v4 Next.js portfolio, including canvas lifecycle and asset audits.
---

# Local setup
- Public portfolio: no login, flags, or server mutations needed.
- With installed dependencies, run `npx next dev -p 3000` from the PR checkout. Run a separate baseline worktree with its dependencies on port 3001.
- Wait for server readiness and verify the browser's URL, readyState, and actual screenshot before capturing matched evidence; first navigation may compile.

## Devin Secrets Needed
None.

# Runtime flow
- Use native page controls for projects' additive category toggles, including all-off then re-enabling.
- For canvas lifecycle, compare frames ~800ms apart, inspect nonuniform pixel values, hidden backing-video paused/currentTime, and backing dimensions vs displayed dimensions. Scroll the gallery fully offscreen and back; resize narrow then restore desktop.
- Use browser responsive mode for 390px layouts. Compare against the same baseline viewport/scroll, allowing live video-frame differences. Check clipped content even when document scrollWidth equals viewport width.
- Timebox favourites hover. Check `matchMedia("(hover: hover)")` and computed preview display; CSS intentionally hides previews for hover:none/coarse pointers. Loaded images do not prove visible hover previews. Do not override app CSS just to mark a test passed.

# Browser-tool isolation
- Passive Network/Runtime/Log CDP monitoring can identify errors without modifying the application.
- If errors request literal truncated URLs ending `...` immediately after computer-tool DOM inspection, repeat using native X11 input and passive CDP screenshots, avoiding DOM extraction. In this environment the truncated next/image requests returned 400 even though original rendered image URLs loaded successfully.
- Capture errors verbatim and distinguish instrumentation/external-site errors, dev warnings, and actual app failures.
- Avoid shared-browser interference: reserve the browser while recording. If navigation changes unexpectedly, recheck the URL and redo only affected steps.
- Native keyboard shortcuts and text entry can lose characters if rushed. Verify address-bar navigation before evidence capture; never infer the route from the filename.
