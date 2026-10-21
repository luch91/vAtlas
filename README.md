# vAtlas

An interactive museum of endangered internet culture, backed by a real GenLayer Intelligent Contract.

## Local development

Copy `.env.example` to `.env`, set the deployed registry address, then run `npm install` and `npm run dev`. Read-only browsing needs no wallet. Nominations require a compatible injected wallet connected to the configured GenLayer network.

## Verification

Run `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, and `npm run test:e2e`.

Cloudflare Pages configuration: production branch `main`, build command `npm run build`, output `dist`. This project intentionally uses no database, Pages Functions, paid LLM API, or fabricated gallery records.

An interactive living museum for documenting endangered internet culture through evidence-based GenLayer consensus.

Status: Checkpoint A preflight. See [`docs/00-preflight.md`](docs/00-preflight.md). Full UI implementation is intentionally gated on the required live contract proof.
