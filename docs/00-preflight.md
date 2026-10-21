# Checkpoint A — Preflight

Date: 2026-10-20 (Africa/Lagos)

Status labels in this document mean exactly: **verified**, **partially verified**, or **blocked**. A build or generated file is not treated as live evidence.

## Selected compatibility line

- Frontend SDK: `genlayer-js@1.1.8` (stable, to be exact-pinned in `package-lock.json`).
- GenVM runner: `py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6`.
- Minimal proof network: stable Studionet, chain ID `61999`, RPC `https://studio.genlayer.com/api`.
- Intended durable verification network: Bradbury Phase 2, subject to confirmation of a current official Intelligent Contract node RPC and programme eligibility.
- The `2.0.0-rc.1` SDK and Studio-dev chain `61997` are not selected. They belong to the Consensus v0.6 preview and are not required for the stable MVP.

## Live proof

- Contract: `VAtlasRegistry` (the Checkpoint-A proof predates the vAtlas rebrand and remains historical only).
- Studionet contract: `0x5fa6870E6AdD002140Cd60D6d9fb9EBf4E849d00`.
- Deployment transaction: `0x4282515328e48cc87be77f05354f8b149c69a2be220fab8044748a27d43607a8`.
- Deployment result: `FINALIZED`, `MAJORITY_AGREE`, leader execution `SUCCESS`; three validators agreed and two were cancelled after quorum.
- Initial final read: `{ value: "preflight", writes: 0 }`.
- Recorded write transaction: `0x9b68c9d639d5da2efe544d4ad16a3746948a2e62119f87210f924067aa2d2e3c`.
- Write result: `FINALIZED`, `MAJORITY_AGREE`, execution `SUCCESS`, all five validators agreed.
- Final read: `{ value: "atlas-proof-final", writes: 3 }`. The count includes two earlier connectivity-retry submissions whose CLI output was interrupted; they are genuine proof writes, not fabricated activity.

This proof contract is not the production registry and does not contain the final nondeterministic admission workflow. The required deployment/write/read/finality gate has been satisfied for both projects, so contract and UI implementation may proceed.

## GenLayer findings

1. Python contracts use `gl.Contract`, typed class-level storage, `@gl.public.view` and `@gl.public.write`.
2. Persistent built-in `list`/`dict`/unbounded `int` are unsuitable; use `DynArray`, `TreeMap`, and sized integers. Custom stored dataclasses require `@allow_storage`.
3. Current official network material lists Studionet, Studio-dev and Bradbury Phase 2. Asimov appears in older SDK/CLI material but was absent from the current live Networks page, so it is not selected.
4. Studionet is stable hosted development but temporary. Bradbury is production-like and persistent, but the current live page does not publish a universal IC RPC; an official Phase-2 endpoint must be qualified before use.
5. Deploy with the network-aware CLI or `deployContract`; do not use a raw RPC flag for a built-in network.
6. Reads use an account-free client and `readContract`; durable UI reads will request `LATEST_FINAL`. Writes use an EIP-1193 provider-backed client and `writeContract`.
7. Track `waitForDecision`/`waitForFinalization` and inspect execution success. EVM inclusion, protocol acceptance, protocol finality, and application assessment are different states.
8. Browser wallets must expose EIP-1193. Connection and network switching occur only after user interaction. No private-key input is permitted.
9. Fee-charging networks require a measured fee profile/estimation. Studionet provides a built-in faucet; Bradbury uses the testnet faucet.
10. Subjective evidence assessment will use independent leader/validator evaluation and compare stable decision fields. `strict_eq` is only for canonical deterministic results; schema-only and always-true validators are prohibited.
11. Web access must occur inside nondeterministic execution. Public docs do not promise portable numeric limits for bytes, redirects, calls, time, or output, so the registry will impose stricter application bounds and profile them live.
12. Public docs do not state universal numeric storage/calldata caps. Field lengths, evidence counts, total entries per deployment, and page sizes will be explicitly bounded and live-tested.
13. `DynArray` and ordered `TreeMap` support indexed records, but do not self-bound; the contract must enforce caps and cursor pagination.
14. Browser reads and signed writes are supported by GenLayerJS; CORS and wallet behavior still require testing from the final Pages origin.
15. Technical documentation does not mandate a submission network. Current programme rules must decide this.

## Cloudflare and GitHub

- Active GitHub CLI identity: `luch91`; `luch91/vAtlas` did not exist at preflight time (the repository was originally created under its pre-rebrand name).
- Cloudflare Pages Git integration officially supports GitHub repositories, production branches, automatic push deployments and same-repository pull-request previews.
- The deployment path must be Dashboard → Workers & Pages → Create application → Pages → Connect to Git. A Direct Upload project must not be created first because it cannot later be converted to Git integration.
- Cloudflare account authentication and its GitHub App repository authorization are **blocked/unverified**: there is no usable Wrangler credential and browser automation could not open an authenticated dashboard session.

## Programme eligibility

- Public portal pages confirm steward review and GitHub OAuth repository verification.
- Sunday 23:59 UTC is documented for points conversion, not as a submission-cap reset.
- Weekly cap, reset semantics, exact form fields, required contract evidence, accepted networks and treatment of existing deployments are not publicly documented. These remain **blocked** pending the authenticated portal form or steward confirmation.

## Architecture decisions

- Static React/Vite/TypeScript frontend on Cloudflare Pages; no Pages Functions for MVP.
- GenLayer owns canonical submissions and assessments. Browser state is a cache/view only.
- Public browsing uses final-state reads; signed submissions persist the transaction ID immediately and resume finality polling after reload.
- No database, external LLM API, image storage, custom domain, or standalone Worker.
- Source URLs and bounded evidence text are stored; pages and images are not copied onchain.

## Official sources

- [GenLayerJS](https://docs.genlayer.com/api-references/genlayer-js)
- [Networks](https://docs.genlayer.com/developers/networks)
- [Storage](https://docs.genlayer.com/developers/intelligent-contracts/storage)
- [Equivalence Principle](https://docs.genlayer.com/developers/intelligent-contracts/equivalence-principle)
- [Reading data](https://docs.genlayer.com/developers/decentralized-applications/reading-data)
- [Writing data](https://docs.genlayer.com/developers/decentralized-applications/writing-data)
- [Transactions and finality](https://docs.genlayer.com/understand-genlayer-protocol/core-concepts/transactions)
- [Cloudflare Pages Git integration](https://developers.cloudflare.com/pages/get-started/git-integration/)
- [GenLayer Portal: how it works](https://portal.genlayer.foundation/how-it-works/)

## Gate decision

Checkpoint A is **complete for technical implementation / conditional GO**. Both projects have live deployment/write/read/finality proofs. Cloudflare account access and programme-only eligibility fields remain externally blocked and must be resolved before production deployment or submission readiness.
