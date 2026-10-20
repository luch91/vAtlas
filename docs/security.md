# Security notes

The contract enforces authoritative limits and URL validation. The frontend also uses native URL/length validation and never renders remote HTML. External links open with `rel="noreferrer"`. No secret belongs in `VITE_*` variables. The wallet is requested only after a user action, private-key entry is never offered, and submitted text is labelled permanent/public. Contract content is rendered as React text, preventing HTML execution.
