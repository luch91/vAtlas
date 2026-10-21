# Cloudflare Pages deployment

Create a Git-connected **Pages** project (not Workers or Direct Upload), production branch `main`, build command `npm run build`, output directory `dist`. Configure public values `VITE_GENLAYER_RPC_URL`, `VITE_GENLAYER_CHAIN_ID`, `VITE_CONTRACT_ADDRESS`, and `VITE_EXPLORER_URL`. The tracked `_redirects` file enables SPA deep links. Production source maps are disabled.

The replacement Git-connected vAtlas Pages project is `vatlas`, assigned `vatlas-eaa.pages.dev` because the un-suffixed hostname was unavailable. Project ID: `75b4c843-d110-43c9-8c97-713de3476a96`. The authenticated Cloudflare record on 21 October 2026 showed production deployment `c4aaeafb-1b68-4ee4-a914-37500b693bcf` serving merge commit `df4bb16beb435af6b45fc9b43d60acaddf04e2da`; canonical and nested SPA routes returned `200 text/html`. Production and preview variables select StudioNet chain 61999 and contract `0x4ADfCb61534fc237E1C95988eA6B47eaD92aaa29`. The superseded `vanishing-atlas` Pages project was deleted after verification without affecting `vatlas`.

This is an immutable QA snapshot. A later documentation-only merge can create a newer Git-connected deployment; the final delivery report records that resulting deployment ID and commit.
