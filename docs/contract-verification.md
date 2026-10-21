# Contract verification

- Contract: `VAtlasRegistry`, `0x4ADfCb61534fc237E1C95988eA6B47eaD92aaa29`
- StudioNet chain: `61999`
- Deployment transaction: `0xeb070d21f05964b87d3f7d70e851d2010b4e454f302937317db52299acd1244a`
- Finalized assessment: `0x9a5d87704f095e3825decbd0472ca5c44b1047759ce4f973afc257e850779d8e`
- Receipt: `FINALIZED`, `MAJORITY_AGREE`; three validators agreed and two were cancelled after quorum.
- Direct read: `list_entries(0,25,true)` returned Dancing Baby as `ACCEPTED`, rubric `vatlas-rubric-v1`, record `b358267f...aaa8fa0`.

The contract fetches bounded evidence and calls the assessment model within `submit_entry`. Its validator reruns the same evidence assessment and compares status and substantive boolean/source-count fields. URL schemes, ports, local hosts, field sizes, evidence count, page size, registry size, contributor history and final record size are bounded. Duplicate IDs/source-title keys prevent repeated finalization; no public assessment-overwrite method exists.

AST lint passed. Semantic lint currently cannot download the pinned SDK artifact (`E101 HTTP 404`); this tooling failure is not bypassed: CI AST lint, direct tests, successful deployment, GenVM execution, multi-validator finality and persisted reads compensate and are recorded explicitly.
