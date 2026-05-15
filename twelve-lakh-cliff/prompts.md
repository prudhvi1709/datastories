# The Iteration Log

The story claims a six step workflow. Here is each step's actual prompt, what surfaced, and what the next step had to correct.

---

## Step 1. Initial planning

**Tool:** Claude (no web search)

**Prompt:**
> I am a salaried employee in India under the New Tax Regime for FY 2026 to 27. My company offers a Flexible Benefits Plan with the following components: Meal Card, Gift Voucher, Children Education Allowance, Children Hostel Allowance, NPS, Fuel and Car Maintenance, Mobile and Internet, and LTA. Can I save tax through this? My gross is roughly ₹13.5 lakh.

**What surfaced:**
- Meal Card cap of ₹26,400 per year derived from ₹50 per meal under Rule 3(7)(iii) of the Income Tax Rules 1962
- Gift Voucher cap of ₹5,000 per year under Rule 3(7)(iv)
- HRA, LTA, Children Education explicitly disallowed under new regime per Section 115BAC
- Recommended allocation: ₹26,400 Meal + ₹5,000 Gift

**What was wrong:**
The 1962 rule book had been replaced six weeks earlier. The framework was correct; the rule numbers and limits were not.

---

## Step 2. Web search validation

**Tool:** Claude with web search

**Prompt:**
> Validate every claim above with web search. Confirm the slabs, the rebate threshold, the standard deduction, marginal relief, meal voucher limits, gift voucher limits, and what is and is not exempt under the new regime for FY 2026 to 27.

**What surfaced:**
- Income Tax Rules 2026 (effective 1 April 2026) raised the meal voucher exemption from ₹50 per meal to ₹200 per meal
- Annual cap rose from ₹26,400 to ₹1,05,600
- The restriction limiting the benefit to the old regime was removed
- 87A rebate threshold confirmed at ₹12 lakh, rebate amount ₹60,000
- Standard deduction ₹75,000 confirmed under new regime

**What was wrong:**
The web search caught the meal voucher update but missed the gift voucher update. It also missed that Section 115BAC had been renumbered to Section 202 under the new Income Tax Act 2025.

---

## Step 3. Cross validation with ChatGPT

**Tool:** ChatGPT

**Prompt:**
> Here is my full FBP optimization analysis [pasted]. Please review for errors, missed opportunities, or risks I have not considered.

**What surfaced:**
- All math verified as correct
- **Key new finding**: even if the law allows meal cards to be tax exempt under the new regime, the company's payroll system has to be configured to actually treat them that way. If the system still classifies the card as taxable, the entire optimization collapses
- Recommendation: send HR a specific written question asking for confirmation before submitting

**What it added:**
A risk in a different category. Not a math error. An implementation gap between what the law allows and what payroll processes. This was not something the previous step could have caught.

---

## Step 4. Cross validation with Gemini

**Tool:** Gemini

**Prompt:**
> Here is my FBP analysis [pasted]. Validate the rule limits and check if I have missed anything in the recent Income Tax Rules 2026.

**What surfaced:**
- **Key new finding**: Rule 3(7)(iv) of the 1962 Rules was replaced by Rule 15(5)(a) under Income Tax Rules 2026
- Gift voucher aggregate limit raised from ₹5,000 to ₹15,000 per year
- Effective 1 April 2026
- Applies under both old and new regimes
- Multiple sources cited (TaxGuru, KPMG, Zaggle)

**What it caught that the others missed:**
This was a rule rename plus a tripled limit. The earlier steps had cited the old rule number and the old limit. Gemini surfaced both corrections together.

---

## Step 5. Real world cross validation

**Tool:** The company's actual FBP form on Darwinbox

**Observation:**
- Meal Card field capped at ₹1,05,600 (matches new ₹200 per meal rule)
- Gift Voucher field capped at ₹15,000 (matches new Rule 15(5)(a))
- Email from Payroll Team explicitly listed Meal Card as "Old & New" tax regime
- Payslip used Section 156 (new Act) instead of 87A (old Act) for the rebate

**What this told us:**
The company had already implemented the new rules. The form itself was the authoritative answer. The four AI iterations were a long way around to confirm what the form already encoded.

---

## Step 6. Final synthesis

The submitted allocation, on the last day before the deadline, was synthetic for this story: ₹65,000 to Meal Card and ₹15,000 to Gift Voucher for a ₹13.5L gross salary persona. Taxable income lands at ₹11.95 lakh, just inside the 87A rebate zone. Tax becomes zero.

---

## Lessons from the iteration

1. **Single AI is structurally incomplete for time sensitive decisions.** Training data freezes. Web indexes have coverage holes. Different models have different shaped gaps.

2. **Cross AI catches different categories of error.** ChatGPT flagged an implementation risk that was not in any math. Gemini caught a rule rename plus limit change in one pass. Neither could have been substituted for the other.

3. **Real world artifacts beat AI debates.** When the AIs disagreed or were uncertain, the company's own FBP form caps resolved the ambiguity. Forms, emails, and payslips reflect the actually operative interpretation of the rules.

4. **Multi model verification is the cost of taking AI seriously.** Not paranoia. The new minimum for decisions that matter.
