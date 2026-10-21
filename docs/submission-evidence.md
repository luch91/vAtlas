# Submission evidence

Status: **technically ready for owner review; official submission not authorised**.

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
- Verified production QA snapshot: deployment `c4aaeafb-1b68-4ee4-a914-37500b693bcf`, commit `df4bb16beb435af6b45fc9b43d60acaddf04e2da` (the final documentation merge may produce a newer deployment, reported in the delivery summary).
- Production HTTP verification: `/`, `/ledger`, and the accepted artefact deep link returned `200 text/html`; authoritative contract state was read separately with `list_entries(0, 25, true)`.

Eligibility: the official programme API permits StudioNet for new projects and the Projects category permits at most two submissions per Monday–Sunday UTC week, resetting Monday 00:00 UTC. Bradbury is not mandatory. Existing deployments are accepted subject to evidence and review. Account-specific remaining capacity requires an authenticated portal session, and steward/AI review still applies. Rebranding is not prohibited, but repository, deployment and contract evidence must remain consistent.

No identifiers or results are invented. Owner approval and an authenticated account-capacity check are required before submission.
