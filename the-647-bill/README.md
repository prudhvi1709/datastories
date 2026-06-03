# The $647 Bill I Never Paid

> When enterprise AI quietly lost its discount

A first-person data story. I ran `npx ccusage` on my own machine, found it would have cost $886 at API prices, then tested that against Simon Willison's claim that Anthropic and OpenAI re-priced enterprise plans to "seat fee + API price" in April 2026.

## The Question

If enterprise plans now pay API rates, then the dollar figure `ccusage` reports stops being a fantasy of savings and becomes a forecast of the bill. I'm on an enterprise seat. So did I just see my future invoice?

## Key Findings

- **$886** of API-equivalent usage across Feb–Jun 2026, ~1.32 billion tokens (~97% cache reads).
- **92%** of that spend is Claude; May alone outweighs every prior month combined.
- On my flat **$100/seat** (usage included), May's **$647** of tokens is a **6.5×** value multiple — indistinguishable from an individual $100 Max plan.
- The hypothesis predicted enterprise would land near **0.9×**. I didn't, because existing contracts only flip to usage-based pricing **at renewal**.
- The cliff: at renewal, that same $647 of work would bill at roughly **$750/month** — a 7.5× jump for identical usage.

## Verdict

The hypothesis is true in general — and not yet true for me. I'm the grandfathered exception. The thing to circle isn't a chart, it's my renewal date.

## Method & Caveats

Costs are `ccusage` estimates from token counts at API list prices, not invoices — a close shadow, not a receipt. The 6.5× rests on the $100 seat billing nothing on top. June reflects a single day, so May carries the verdict.

## Source

Simon Willison, ["I think Anthropic and OpenAI have found product-market fit"](https://simonwillison.net/2026/May/27/product-market-fit/) (27 May 2026). Usage measured with [ccusage](https://github.com/ryoppippi/ccusage).
