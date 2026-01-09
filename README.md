# Data Stories

> Interactive narratives exploring data, technology, and human insight

Data Stories is a collection of in-depth data journalism pieces that uncover patterns, reveal insights, and tell compelling stories through analysis and visualization. Each story is a deep dive into data, combining rigorous analysis with engaging narrative and beautiful visualizations.

## 🎯 What Are Data Stories?

Data stories go beyond simple charts and graphs. They are:

- **Narrative-driven**: Each piece tells a story, with a beginning, middle, and end
- **Data-backed**: Every claim is supported by analysis and evidence
- **Visually engaging**: Custom visualizations bring the data to life
- **Thought-provoking**: Stories that make you see the world differently

## 📚 Stories

### [The Rorschach Test: What Three AIs Saw in the Same Question](./ai-rorschach-test/)

An experiment comparing how ChatGPT, Gemini, and Claude Code interpret and respond to the exact same technical question, revealing their distinct personalities and cognitive architectures.

**Key Findings:**
- 325% difference in difficulty ratings between AIs
- 31x difference in response length
- Each AI interpreted the same question through fundamentally different lenses

**Published:** January 2026 | **Type:** AI Analysis | **Length:** 6,481 lines analyzed

---

### [The Developer Who Shipped 86 Repositories](./prudhvi-codereview/)

What happens when an AI critically reviews every line of code across 86 repositories committed to in a single year? A narrative-driven journey through architecture decisions, hidden patterns, and the story of prolific developer velocity.

**Key Findings:**
- Comprehensive review of 86 repositories across multiple languages
- Patterns in high-velocity development and code quality
- Architectural decisions and their long-term implications
- Security considerations and best practices

**Published:** January 2026 | **Type:** Code Review | **Analysis:** GitHub profile deep dive

---

### [The Zero-Bug Miracle: Building Source-to-Settle in One Day](./zero-bug-miracle/)

How one developer and Claude Code built a production-grade AI procurement system with 172 files, 1,500 lines of code, and zero bugs—in a single day. A real-time chronicle of human-AI collaboration at its finest.

**Key Findings:**
- 172 files created in 1 hour 2 minutes
- Zero bugs, zero debugging time
- Complete Source-to-Settle procurement system
- Real-time timestamps documenting the journey

**Published:** January 2026 | **Type:** Case Study | **Duration:** 1 hour 2 minutes

---

## 🚀 Getting Started

### Viewing Stories

Simply open `index.html` in your browser to browse all available data stories. Each story is self-contained with all necessary assets and visualizations.

```bash
# Clone the repository
git clone <repository-url>
cd datastories

# Open in your browser
open index.html  # macOS
xdg-open index.html  # Linux
start index.html  # Windows
```

Or visit the live site: [your-github-pages-url]

### Adding a New Story

1. Create a new directory in the root: `your-story-name/`
2. Add your story files: `index.html`, `script.js`, `data/`, etc.
3. Create a `story.json` file in your story directory with metadata:

```json
{
    "id": "your-story-name",
    "title": "Your Story Title",
    "subtitle": "An engaging subtitle",
    "description": "A compelling description that makes people want to read...",
    "tags": ["Tag1", "Tag2", "Tag3"],
    "icon": "📊",
    "gradient": "linear-gradient(135deg, #8d4bff 0%, #ff006b 100%)",
    "published": "2026-01-09"
}
```

4. Add your folder name to the `storyFolders` array in the main `index.html`:

```javascript
const storyFolders = [
    'ai-rorschach-test',
    'prudhvi-codereview',
    'zero-bug-miracle',
    'your-story-name'  // Add this line
];
```

That's it! The landing page will automatically fetch and display your story.

### How It Works

The landing page uses **automatic story discovery**:
- Each story folder contains a `story.json` with metadata
- The main `index.html` fetches these files dynamically
- Stories are automatically sorted by publish date (newest first)
- No need to duplicate metadata - it's all in one place per story

## 🎨 Design Philosophy

Data Stories follows these design principles:

1. **Clarity First**: Visualizations should illuminate, not obscure
2. **Engagement**: Use animation and interactivity to draw readers in
3. **Accessibility**: Stories should work on all devices and screen sizes
4. **Performance**: Fast load times, smooth animations
5. **Self-Contained**: Each story includes all assets and works offline

## 🛠 Technology Stack

### Landing Page
- **Frontend**: Pure HTML, CSS, JavaScript
- **Templating**: lit-html 3.x for reactive rendering
- **Dynamic Loading**: Automatic story discovery via fetch API
- **Styling**: CSS custom properties, gradients, animations
- **No Build Step**: Direct browser execution

### Individual Stories
- **Visualizations**: Chart.js, D3.js, or custom Canvas/SVG
- **Interactivity**: Vanilla JavaScript or framework of choice
- **Data**: JSON, Markdown, or embedded datasets
- **Flexibility**: Each story chooses its own tools

## 📖 Story Structure

Each story follows a consistent structure:

```
story-name/
├── index.html          # Main story page
├── story.json         # Metadata for landing page (REQUIRED)
├── script.js          # Interactions and visualizations
├── data/              # Source data and analysis
│   ├── raw_data.json
│   ├── analysis.md
│   └── sources.md
├── assets/            # Images, diagrams, etc.
├── README.md          # Story-specific documentation
└── prompt.md          # Original prompt/question (if applicable)
```

**Required Files:**
- `index.html` - The story itself
- `story.json` - Metadata for automatic discovery

## 🤝 Contributing

Have a data story to tell? Contributions are welcome!

1. Fork the repository
2. Create your story directory with `index.html` and `story.json`
3. Follow the story structure guidelines
4. Add your folder name to the `storyFolders` array in main `index.html`
5. Submit a pull request

### Story Guidelines

- **Original Analysis**: Stories should contain original research and analysis
- **Data Sources**: Clearly cite all data sources
- **Code Quality**: Clean, well-commented code
- **Accessibility**: Test on multiple devices and browsers
- **Performance**: Optimize images and code for fast loading
- **Self-Contained**: Each story should work independently with all its assets

### Landing Page Design

The main landing page features:
- Simple header with title and description
- Automatic story discovery via `story.json` files
- Beautiful card-based layout with gradients and animations
- Responsive design for all screen sizes
- Fast loading with no build step required

## 📝 License

[MIT License](LICENSE)

---

<p align="center">
  <strong>Data Stories</strong><br>
  <em>Revealing insights through analysis and narrative</em>
</p>
