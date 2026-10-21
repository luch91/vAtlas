# Security review

- Production dependency audit after patching: `npm audit --omit=dev` reports 0 vulnerabilities.
- Updated React Router, Vite, PostCSS and ESLint to patched compatible releases; CI/build verification is required on the PR.
- No private keys, tokens or seed phrases are tracked. Browser configuration contains public RPC, chain ID, explorer and contract address only.
- React renders text normally; there is no unsafe HTML injection. External evidence links use `rel="noreferrer"`.
- Frontend and contract reject/limit malformed URLs and payload sizes. Retrieved pages are explicitly treated as untrusted evidence in the assessment prompt.
- Contract storage, contributor history and pagination are bounded. Duplicate writes are rejected and assessments have no arbitrary mutation endpoint.

Known limitation: injected-wallet confirmation, rejection and disconnect paths cannot be fully automated without a compatible test wallet extension. No private-key input exists.
