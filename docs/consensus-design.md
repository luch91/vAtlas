# Consensus design

The leader retrieves at most three public sources, truncates each to 12 KB, treats source text as untrusted evidence, and evaluates rubric v1. Validators independently repeat evidence retrieval and assessment. Equivalence compares stable substantive fields—status, identifiability, support, contradiction, preservation value, and source counts—rather than narrative wording. Inaccessible evidence produces `INCONCLUSIVE`; material contradiction or an unidentifiable subject produces `REJECTED`. The contract never claims external content is durably archived.
