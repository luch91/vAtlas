# Architecture

Vanishing Atlas is a static React/Vite application for Cloudflare Pages. The browser reads the public GenLayer registry without a wallet and uses an injected EIP-1193 wallet only for signed `submit_entry` writes. GenLayer is the sole canonical data store; session storage retains only the currently connected public address.

The UI requests bounded pages of 25 records. Accepted records populate the public spatial atlas. The ledger shows every finalised application outcome. A wallet-filtered view calls `get_entries_by_submitter`. Deterministic FNV-derived coordinates keep the same artefact in the same location without storing presentation data.

No Pages Functions, database, analytics, private keys, or server secrets are used.
