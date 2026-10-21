# Submission evidence

Status: **incomplete — not submission ready**.

- Project: vAtlas
- Use case: an evidence-assessed public registry for culturally significant internet artefacts.
- Repository: https://github.com/luch91/vAtlas
- Cloudflare Pages URL: https://vatlas-eaa.pages.dev
- Functional contract address: `0x4ADfCb61534fc237E1C95988eA6B47eaD92aaa29`
- Network: StudioNet development target, chain ID 61999
- Contract deployment transaction: `0xeb070d21f05964b87d3f7d70e851d2010b4e454f302937317db52299acd1244a`
- Finalised accepted assessment transaction: `0x9a5d87704f095e3825decbd0472ca5c44b1047759ce4f973afc257e850779d8e`
- Successful contract read: `list_entries(0, 25, true)` returned the persisted Dancing Baby record under `vatlas-rubric-v1`.
- Historical pre-rebrand contract: `0x231E49C25bE3807654Ceb6f1F7a39019DEd5960A`; retained as genuine earlier evidence, not the active vAtlas address.
- Production deployment: `cf3f6ad4-8418-4c9a-9f0f-6fdbaa229fe8`, commit `1c7334d1f2faf9c89dab66d605ec10f0eebfe3d1`
- Production HTTP verification: `/`, `/ledger`, and the accepted artefact deep link returned `200 text/html`; authoritative contract state was read separately with `list_entries(0, 25, true)`.

No identifiers or results will be invented. Populate this document only from finalised network receipts and verified deployments.
