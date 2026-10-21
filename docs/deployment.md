# Cloudflare Pages deployment

Create a Git-connected **Pages** project (not Workers or Direct Upload), production branch `main`, build command `npm run build`, output directory `dist`. Configure public values `VITE_GENLAYER_RPC_URL`, `VITE_GENLAYER_CHAIN_ID`, `VITE_CONTRACT_ADDRESS`, and `VITE_EXPLORER_URL`. The tracked `_redirects` file enables SPA deep links. Production source maps are disabled.

Deployment remains pending authenticated Cloudflare account access. Do not claim a hostname before Cloudflare assigns it.
