# The ₹12 Lakh Cliff

> A Tuesday in May. Three AIs. One outdated rule book. The story of how multi model cross validation became the new minimum for decisions that matter.

## 📖 Overview

India's New Tax Regime works like a cliff. Earn under ₹12 lakh in taxable income, pay zero. Cross it by one rupee, and the tax bill jumps. The escape hatch is the Flexible Benefits Plan, which lets salaried employees route part of their pay into tax exempt buckets. Standard corporate tax planning, except the rules changed on the first of April 2026, and most AI training data did not catch up.

This story chronicles a real four day iteration cycle where three different AIs gave three different partial answers. Each one caught what the others missed. None alone was complete.

## 🎯 The Premise

For decisions involving rules that change, asking one AI is like asking one friend. Probably useful. Probably incomplete. Occasionally, dangerously confident in the wrong answer.

The story tests this by walking through the actual workflow:

1. **Claude (no search)** built the framework but cited Income Tax Rules from 1962
2. **Claude with web search** caught the meal voucher rule update from April 2026
3. **ChatGPT** flagged a payroll implementation risk that was not in the math
4. **Gemini** caught a separate rule rename (Rule 3(7)(iv) became Rule 15(5)(a))
5. **The company's own FBP form** turned out to be the final source of truth

## 🔍 Key Findings

### The Cliff
At ₹12 lakh taxable income, the 87A rebate wipes tax to zero. At ₹12 lakh and one rupee, it does not. Marginal relief softens the fall through ₹12.71 lakh. Past that, the full slab tax kicks in.

### The Coverage Gaps
No single AI surfaced every relevant rule update. Each model's training cutoff and web index has different shaped holes. The truth is a composite no single one of them holds.

### The Optimization
At a synthetic ₹13.5 lakh CTC, ₹80,000 routed through FBP saves roughly ₹74,000 in tax. An effective return of ninety three percent on restricted spend.

### The Universality
Same workflow, four different optimal answers across personas at ₹10L, ₹13.5L, ₹18L, and ₹28L. The cliff matters most for those just above it. NPS matters more as income rises.

## 🎨 Visualizations

The story uses Chart.js to render:

- **The Cliff**: tax payable plotted against taxable income, with annotations marking the ₹12L threshold, the zero tax zone, and the full slab zone
- **The AI Coverage Table**: which model caught which rule update, side by side
- **The Cliff Navigator**: an interactive panel with sliders for gross salary, meal card, gift voucher, and NPS contribution, updating taxable income and tax in real time
- **The Persona Comparison**: a bar chart of tax saved by income bracket

## 📁 Files

- `index.html` — the main story, self contained, opens in any browser
- `story.json` — metadata for the landing page
- `prompts.md` — the iteration log: prompts used at each step and what surfaced

## 🛠 Methodology

Six iteration rounds:

1. Initial planning with a single AI
2. Web search verification of every claim
3. Cross validation by pasting the analysis into a second AI
4. Cross validation by pasting into a third AI
5. Real world cross check using the company's own FBP form caps
6. Final synthesis combining all inputs

## ⚠️ Caveats

- The personas (Riya, Aarav, Neha, Vikram) are synthetic. None of them exist.
- Calculations are based on rules effective 1 April 2026 under the New Tax Regime.
- This piece showcases a workflow. It is not professional tax advice.
- Tax rules continue to evolve. Verify with your CA, employer, and the Income Tax Department before acting.

## 📖 Reading the Story

View the interactive piece: [index.html](./index.html)

---

<p align="center">
  <em>"Trust, but cross verify."</em>
</p>
