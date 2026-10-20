# Testing

`npm test` covers deterministic visual placement and the honest empty-registry state. `npm run test:e2e` checks key routes and mobile overflow. `npm run lint`, `npm run typecheck`, and `npm run build` are required before deployment. Real-network transaction/finality IDs and live-domain results must only be added after they have actually run.

## Results on 20 October 2026

- GenVM AST lint: passed all 3 checks.
- GenVM semantic validation: passed (5 methods, 4 views, 1 write) using cached validator artifact `v0.2.16`. The normal command stalled because the linter requests the latest GitHub release before consulting its valid cache; pinning the already-cached artifact compensated for that network-dependent lookup without bypassing semantic validation.
- TypeScript: passed.
- Production build: passed; application JS was 179.46 kB gzip and CSS was 3.69 kB gzip.
- Vitest/Playwright: not run successfully. Interrupted npm installs left the local dependency tree without Vitest transitive packages and package-registry reinstalls stalled. This remains a release blocker.
- StudioNet accepted and finalised assessment: `0x3c67787b06bf745109cce59ca47fa3e467baec91e55a58227d3cbbc027f19ba5`.
- Authoritative `list_entries` read returned the accepted Dancing Baby record with ID `22adae66e2c3cd84db4c64dfd7f2cf45ddc08199f746b5ea9b51c90ea8af69b3`.
- Inaccessible-source case `0x3f206fed6b4cdb8cfcb3f430147f2de222bb4087d8c9cd870f41cd85464477ff` finalised and persisted as `INCONCLUSIVE`; it is excluded from accepted-only reads.
- Failed compatibility probe `0xd177a9919b8a4229f1b1d74c554a0bcd3d6095b2ccee3e40d3eb1ee43964092c` correctly remains recorded as a contract error from the superseded deployment.
