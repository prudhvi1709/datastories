## Prompt 1 :

Critically and comprehensively review all repositories committed to in 2025 under https://github.com/prudhvi1709/

Use the env var GITHUB_TOKEN for GitHub API access if required.

Understand the Codebase: Map architecture, tech stack, patterns, dependencies, purpose. Identify languages, frameworks, key abstractions, data flows, API surfaces. Assess scope, activity, maturity, team size signals. What sophisticated analyses apply > (dependency graphs, complexity metrics, security scanning, performance profiling, test coverage)?

Define What Matters: List stakeholders (devs, users, business, security, ops) and their concerns. What technical debt is blocking > progress? What security/performance/maintainability risks are material? What would enable 10x velocity or prevent catastrophic failure?

Hunt for Anti-Signal: Find code smells, architectural drift, abandoned experiments, cargo-culted patterns, surprising dependencies, version skew. Look for decisions that either made sense once but don't now, or never made sense. Spot copy-paste > proliferation, leaky abstractions, god objects, temporal coupling.

Segment & Discover: Cluster by purpose, ownership, activity, coupling, complexity. Which modules are hot-spots (high churn + high complexity)? What's dead code? What patterns emerge when you slice by commit frequency, author, or functionality? Where are the hidden > subsystems?

Find Leverage Points: Hypothesize small refactorings with outsized impact. Look for: reusable abstractions buried in duplication, shared pain points (same bug pattern 5x), 80/20 test coverage opportunities, dependency inversions that unlock parallel work, config/> code boundary improvements.

Verify & Stress-Test:
Cross-check externally: Compare to framework best practices, security guidelines (OWASP), performance benchmarks, community > idioms
Test robustness: Run linters, security scanners (Semgrep, Snyk), complexity analysis (cyclomatic, cognitive), test coverage, > build time profiling
Check for errors/risks: Examine auth/authz, input validation, error handling, race conditions, resource leaks, license > compliance
Consider limitations: What can't be assessed from static analysis alone? What context is missing?
Prioritize & Package: Select findings that are:
High-impact (not nitpicks) - security holes, performance cliffs, maintainability blockers
Actionable (not vague) - specific files, concrete refactorings, estimated effort
Surprising (not style guides) - hidden coupling, emergent complexity, non-obvious risks
Defensible (evidence-based) - metrics, examples, reproducible issues
Based on this, write a narrative-driven data story. Write like Malcolm Gladwell. Visualize like the NYT graphics team. Think like > a detective who must defend findings under scrutiny.

Compelling hook: Start with a human angle, tension, or mystery that draws readers in
Story arc: Build the narrative through discovery, revealing insights progressively
Integrated visualizations: Beautiful, interactive charts/maps that are revelatory and advance the story (not decorative)
Concrete examples: Make abstract patterns tangible through specific cases
Evidence woven in: Data points, statistics, and supporting details flow naturally within the prose
"Wait, really?" moments: Position surprising findings for maximum impact
So what?: Clear implications and actions embedded in the narrative
Honest caveats: Acknowledge limitations without undermining the story

- After 10-15 minutes, it came up with all findings, but 2 false positives :
  - API key which is domain restricted is not a vulnerability
  - Prompt injection which is user provided is not a vulnerability

### Prompt 2 :

- API key which is domain restricted is not a vulnerability
- Prompt injection which is user provided is not a vulnerability
  The above findings are false positives, cause user gives their own API keys and prompt is not injected into the system. Also, regarding the API Key, it is domain restricted and not a vulnerability. Given this, Update the findings, and write the datastory in index.html file.