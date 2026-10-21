# Cloudflare Pages deployment

Create a Git-connected **Pages** project (not Workers or Direct Upload), production branch `main`, build command `npm run build`, output directory `dist`. Configure public values `VITE_GENLAYER_RPC_URL`, `VITE_GENLAYER_CHAIN_ID`, `VITE_CONTRACT_ADDRESS`, and `VITE_EXPLORER_URL`. The tracked `_redirects` file enables SPA deep links. Production source maps are disabled.

The replacement Git-connected vAtlas Pages project is `vatlas`, assigned `vatlas-eaa.pages.dev` because the un-suffixed hostname was unavailable. Project ID: `75b4c843-d110-43c9-8c97-713de3476a96`. Production deployment `cf3f6ad4-8418-4c9a-9f0f-6fdbaa229fe8` built commit `1c7334d1f2faf9c89dab66d605ec10f0eebfe3d1`; canonical and nested SPA routes returned `200 text/html`. The superseded `vanishing-atlas` Pages project was deleted after verification.
