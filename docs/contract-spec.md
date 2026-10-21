# Contract interface v1

Frontend methods are pinned to `VAtlasRegistry` in `contracts/main.py`:

- `submit_entry(payload_json)` — signed write; atomically assesses and stores a record. Browser and CLI callers prefix the JSON string with `json:` to avoid CLI scalar coercion; unprefixed JSON remains accepted for compatibility.
- `get_entry(entry_id)` — returns one JSON record.
- `list_entries(cursor, limit, accepted_only)` — returns a bounded JSON page.
- `get_entry_count()` — total finalised records.
- `get_entries_by_submitter(submitter, cursor, limit)` — bounded contributor history.

Protocol finality and application assessment are displayed separately. `ACCEPTED`, `REJECTED`, and `INCONCLUSIVE` are application outcomes, not transaction states and not claims that linked content has been archived.
