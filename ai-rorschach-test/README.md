# The Rorschach Test: What Three AIs Saw in the Same Question

> An experiment in artificial intelligence interpretation, personality, and the nature of understanding

## 📖 Overview

On a Tuesday afternoon, a developer posed what seemed like a straightforward technical question to three different AI systems. What happened next reveals something profound about artificial intelligence—not in what these systems can do, but in **how they think**.

This data story explores:
- How three leading AI systems (ChatGPT, Gemini, Claude Code) interpreted the exact same prompt
- The radically different responses they generated
- What this reveals about AI "personalities" and cognitive architectures
- The implications for how we use and understand AI systems

## 🔬 The Experiment

**The Question:** How difficult would it be to serve Claude Code and OpenAI Codex on the web using custom proxies?

**The Results:**
- **ChatGPT**: 111 lines, 2/10 difficulty, "Fairly easy"
- **Gemini**: 3,500+ lines, 8.5/10 difficulty, "High complexity" (finished FIRST)
- **Claude Code**: 2,870 lines, 7.5/10 difficulty, "Complex but achievable" (took longest)

## 🎯 Key Findings

### The Difficulty Chasm
- **325% difference** in difficulty ratings between the most and least optimistic assessments
- Same technical question, fundamentally different risk evaluations
- Each AI saw a completely different problem in the exact same words

### The Speed Paradox
- Gemini produced **31x more content** than ChatGPT yet **finished first**
- Claude Code took the longest despite mid-length response
- Speed and comprehensiveness aren't opposites—they reveal different cognitive architectures

### Three Distinct Personalities

#### ChatGPT: The Optimist 🚀
- **Philosophy**: "Yes, and here's how"
- **Approach**: Solution-oriented, minimizes complexity
- **Focus**: Technical feasibility and quick implementation
- **Audience**: Solo developer prototyping

#### Gemini: The Scholar-Sprinter ⚡
- **Philosophy**: "Let me explain everything—fast"
- **Approach**: Comprehensive documentation, academic structure
- **Focus**: Security, scale, enterprise architecture
- **Audience**: Fortune 500 enterprise architect

#### Claude Code: The Deliberator ⚖️
- **Philosophy**: "Here's what you need to decide"
- **Approach**: Decision-focused, balanced risk assessment
- **Focus**: Practical implementation with cost-benefit analysis
- **Audience**: Technical lead making business decisions

## 📊 Data Analysis

### Response Metrics
- **Total lines analyzed**: 6,481 across three responses
- **Security mentions**: 8 (ChatGPT) vs 89 (Gemini) vs 47 (Claude)
- **Cost mentions**: 0 (ChatGPT) vs 47 (Gemini) vs 62 (Claude)
- **"Should" usage**: 6 (ChatGPT) vs 23 (Gemini) vs 41 (Claude)

### Structural Differences
- ChatGPT: Direct answers, minimal warnings, present-tense possibilities
- Gemini: Academic framing, extensive risk sections, future-tense planning
- Claude: Executive summaries, balanced mitigation, phased approaches

## 🎨 Visualizations

The story includes several interactive visualizations:

1. **Difficulty Bars**: Animated comparison of difficulty ratings
2. **Radar Chart**: Multi-dimensional analysis of focus areas (API, Infrastructure, Security, Cost, etc.)
3. **Scope Spectrum**: Response length comparison
4. **Speed-Comprehensiveness Paradox**: Bubble chart showing the counterintuitive relationship

## 📁 Data Sources

All raw AI responses are available in the `data/` directory:

- `chatgpt_Response.md` - ChatGPT's full response
- `gemini_report.md` - Gemini's comprehensive analysis
- `claudecode.md` - Claude Code's detailed assessment
- `codex.md` - Additional Codex-specific analysis

## 🔍 Methodology

1. **Prompt Design**: Single, identical technical question posed to all three systems
2. **Collection**: Raw responses captured in full
3. **Analysis**: Quantitative metrics (line counts, word frequency, timing) combined with qualitative interpretation
4. **Visualization**: Custom Canvas/SVG visualizations built from scratch
5. **Narrative**: Story structure developed to highlight key insights

## 💡 Key Insights

### On AI Interpretation
> "These systems don't just answer questions—they interpret what kind of question you're asking, who you are, and what you really want."

Each AI projects its own worldview, training biases, and assumptions onto the prompt.

### On Scope Creep
> "Scope creep isn't a bug in AI responses. It's a feature revealing each system's implicit assumptions about what constitutes a 'complete' answer."

The same mention of "people of org (both tech and non-tech)" triggered radically different scope interpretations.

### On Speed vs. Thoroughness
> "Speed and thoroughness aren't opposites. They're indicators of different cognitive architectures."

Gemini thinks in parallel. Claude thinks in sequence. ChatGPT thinks in solutions.

## 🎓 Implications

### For Developers
The same prompt to different AIs can yield wildly different implementation paths. Scope ambiguity amplifies AI personality differences.

### For Organizations
Choosing an AI isn't about capability—it's about which interpretation framework matches your actual needs.

### For AI Development
These aren't bugs. They're emergent personalities from training data. ChatGPT learned optimism from Stack Overflow; Gemini learned caution from academic papers.

## 🛠 Technical Stack

- **HTML/CSS**: Custom design inspired by The Verge's visual language
- **JavaScript**: Vanilla JS with Canvas API for visualizations
- **Animation**: Custom scroll-triggered reveals and particle effects
- **Data**: Markdown files with full AI responses
- **No framework dependencies**: Pure web technologies

## 📖 Reading the Story

View the full interactive story: [index.html](./index.html)

Or jump to specific sections:
- The Experiment
- The Detective's Notebook
- Three Personalities
- The Scope Creep Mystery
- The Speed Paradox
- The Timeline of Discovery
- Implications

## 🤔 Discussion Questions

1. Do AI "personalities" reflect their creators' intentions or emergent properties of training data?
2. How should we adjust our prompting strategies based on these differences?
3. Is the "best" AI the one that matches our expectations or challenges them?
4. What does this reveal about human interpretation and the Rorschach effect in ourselves?

## 📚 Further Reading

- [Original Prompt](./prompt.md)
- [Full AI Responses](./data/)
- [Methodology Notes](./methodology.md) (coming soon)

## 🙏 Acknowledgments

- ChatGPT (OpenAI) for the optimistic perspective
- Gemini (Google) for the comprehensive analysis (and the speed!)
- Claude Code (Anthropic) for the deliberative approach
- The original questioner for the fascinating prompt

## 📝 Citation

If you reference this analysis, please cite as:

```
The Rorschach Test: What Three AIs Saw in the Same Question
Data Stories Collection, January 2026
[URL]
```

---

<p align="center">
  <strong>"Every answer reveals as much about the interpreter as the interpreted."</strong>
</p>
