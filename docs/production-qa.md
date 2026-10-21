# Production QA — 21 October 2026

Production `https://vatlas-eaa.pages.dev` was tested in headless Google Chrome at 1440×1000, 768×900, 375×812 and 320×720 with reduced motion enabled. All four runs rendered the real Dancing Baby contract record, had no horizontal overflow or JavaScript exceptions, supported keyboard activation of the artefact, loaded its detail and ledger views, and survived direct-route refresh. `/`, `/ledger`, and the artefact deep link returned `200 text/html`.

Read-only browsing works without a wallet. The production UI uses injected EIP-1193 accounts only after the Connect action and checks chain ID 61999. Form length/URL validation and disabled submission states were exercised by CI. A complete fresh signed production write was not repeated during this QA because the already-finalized vAtlas assessment and direct read are reproducible network evidence; wallet-extension confirmation UI therefore remains an owner-device verification item.

Cloudflare project `vatlas` is Git-connected Pages (GitHub `luch91/vAtlas`), not a standalone Worker. Production and preview variables both select contract `0x4ADf...aa29` on StudioNet.

Authenticated Cloudflare reconciliation found deployment `c4aaeafb-1b68-4ee4-a914-37500b693bcf` serving merge commit `df4bb16beb435af6b45fc9b43d60acaddf04e2da`. The GitHub `main` branch and production deployment were synchronized at the time of the QA snapshot. A documentation-only merge after this snapshot is expected to produce a newer deployment.

Decision: **GO for owner review; NO-GO for automatic submission until owner approval and account-specific portal capacity are confirmed.**
