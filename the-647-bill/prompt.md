# Prompts behind this story

A reconstruction of the conversation that produced this piece.

1. Ran `ccusage` to check AI coding usage from the CLI:
   ```bash
   npx ccusage@latest daily
   npx ccusage@latest monthly
   npx ccusage@latest session
   ```

2. Asked for the monthly Codex-vs-Claude cost as a color-coded HTML heatmap table.

3. Shared Simon Willison's "product-market fit" post and asked to test the hypothesis — that enterprise plans lost the subscription discount in April 2026 — against my own metrics, noting May and June are on a subscription.

4. Clarified the plan: a flat **$100/seat** enterprise plan, with no usage billed on top.

5. Asked to rewrite the whole thing as a narrative **data story** (Gladwell prose, NYT-style integrated visuals, interactions), then to put it in first person as written by me.

## Source data

`ccusage monthly` (API-equivalent USD):

| Month | Codex | Claude | Total |
|-------|-------|--------|-------|
| 2026-02 | $7.43 | $0.00 | $7.43 |
| 2026-03 | $33.16 | $0.00 | $33.16 |
| 2026-04 | $21.87 | $135.84 | $157.70 |
| 2026-05 | $5.53 | $641.44 | $646.97 |
| 2026-06 (1 day) | $0.00 | $40.79 | $40.79 |
| **Total** | **$67.99** | **$818.07** | **$886.06** |
