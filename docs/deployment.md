# Cloudflare Pages deployment

Create a Git-connected **Pages** project (not Workers or Direct Upload), production branch `main`, build command `npm run build`, output directory `dist`. Configure public values `VITE_GENLAYER_RPC_URL`, `VITE_GENLAYER_CHAIN_ID`, `VITE_CONTRACT_ADDRESS`, and `VITE_EXPLORER_URL`. The tracked `_redirects` file enables SPA deep links. Production source maps are disabled.

The original pre-rebrand Git-connected Pages deployment was `vanishing-atlas.pages.dev`. The replacement Git-connected vAtlas Pages project is `vatlas`, assigned `vatlas-eaa.pages.dev` because the un-suffixed hostname was unavailable. Project ID: `75b4c843-d110-43c9-8c97-713de3476a96`. Production verification remains pending its first main-branch build.
