# OpenAI Codex CLI Web Deployment Analysis

## Executive Summary

**Tool**: Codex CLI by OpenAI
**Current State**: Terminal-based CLI tool + official cloud/web version
**Deployment Goal**: Self-hosted web interface for ~500 users (50% technical, 50% non-technical)
**Overall Difficulty Score**: **6.5/10**

## 1. Tool Overview

### What is Codex CLI?

Codex CLI is OpenAI's lightweight coding agent that runs in your terminal. Released as open-source, it provides:
- Full terminal-based interactive coding environment (TUI)
- Read, modify, and run code on local machine
- Agentic coding workflows with GPT-5-Codex models
- Multi-file editing capabilities
- Session management with resume functionality
- Multimodal inputs (text, screenshots, diagrams)

### Access & Availability

**CLI Access**: Available via:
- npm: `npm i -g @openai/codex`
- Homebrew: `brew install --cask codex`

**Web/Cloud Access**: Available at:
- **chatgpt.com/codex** - official web interface
- **Codex Cloud** - cloud-based agent for parallel task execution

**Subscription Requirements**:
- Free tier: Limited GPT-5 model access, basic Codex functionality
- Plus ($20/month): 30-150 local tasks every 5 hours
- Pro ($200/month): Unlimited during workweeks, 300-1,500 local tasks every 5 hours
- Enterprise/Business plans: Enhanced limits

### Architecture & Tech Stack

**Current Stack (Post-Rewrite)**:
- **Language**: Rust (rewritten from TypeScript/Node.js in 2025)
- **Previous Stack**: React + TypeScript + Node.js (legacy)
- **Distribution**: NPM package with Rust binaries
- **Repository Structure**: Cargo workspace with 49 member crates

**Key Components**:
1. **Core crate**: Session management, model communication, tool execution, conversation state
2. **Protocol crate**: Data structures, events, operation types for UI-core communication
3. **TUI**: Terminal UI using ratatui (full-screen interactive experience)
4. **Exec mode**: Headless execution for non-interactive automation
5. **App server**: JSON-RPC server for IDE integration (VS Code, Cursor, etc.)

**Why Rust Rewrite?**:
- Performance gains (faster startup, lower memory)
- Better security (memory safety)
- Improved developer experience
- Native binaries (no Node.js runtime needed)

## 2. Official Web/Cloud Version

### Codex on the Web (chatgpt.com/codex)

**Launch**: 2025
**Access**: https://chatgpt.com/codex

**Features**:
- Cloud-based agent powered by codex-1 model
- Can work on many tasks in parallel
- Each task in separate, isolated environment
- Pre-loaded with your codebase
- Accessible from terminal, IDE, web, GitHub, mobile
- Background task processing
- Integration with "Atlas" AI browser for web actions

**Architecture**:
- Multi-surface deployment (terminal, IDE, web, GitHub, mobile)
- Unified ChatGPT account authentication
- Cloud-based task execution infrastructure
- Separate isolated environments per task
- Parallel task processing

**Limitations**:
- **NOT self-hostable** - runs only on OpenAI's cloud infrastructure
- Requires ChatGPT subscription (Plus, Pro, Business, Enterprise)
- Subject to usage limits based on plan tier
- Code must be accessible to OpenAI's infrastructure

**Models Available**:
- GPT-5-Codex (optimized for agentic coding)
- GPT-5.2-Codex (latest, released December 2025)
- GPT-5 (standard reasoning model)
- Adjustable reasoning levels

## 3. Self-Hosted Web Deployment Options

### Option 1: Web Wrapper for Rust CLI

**Approach**: Build web interface around the Rust CLI binary

**Architecture**:
```
[Web UI] → [WebSocket Server] → [Rust CLI via pty] → [OpenAI API]
```

**Challenges**:
- Rust binary expects terminal environment
- Need pseudo-terminal (pty) wrapper
- TUI (ratatui) output needs translation to web format
- Less community tooling compared to Node.js version

**Pros**:
- Better performance (Rust is fast)
- Lower memory footprint
- More secure (Rust memory safety)
- Official current version

**Cons**:
- Rust harder to integrate with web backends
- TUI not designed for web rendering
- Limited web-specific documentation
- Fewer community web integration examples

### Option 2: Fork Legacy TypeScript/Node.js Version

**Approach**: Use the pre-Rust TypeScript implementation

**Architecture**:
```
[Web UI] → [WebSocket Server] → [Node.js Codex] → [OpenAI API]
```

**Pros**:
- Node.js easier for web integration
- More familiar to web developers
- JavaScript ecosystem tools available
- Can modify source more easily

**Cons**:
- Legacy/deprecated version
- Missing latest features
- Performance inferior to Rust
- Won't receive updates
- Security improvements in Rust missing

### Option 3: Custom Web Terminal Architecture (Recommended)

Build production-grade solution similar to Claude Code approach:

**Frontend Stack**:
- **xterm.js**: Terminal emulator
- **React/Vue/Svelte**: UI framework
- **WebSocket**: Real-time communication
- **TypeScript**: Type safety

**Backend Stack**:
- **Python FastAPI or Node.js Express**: Web server
- **WebSocket server**: Terminal connection handling
- **Container orchestration**: Docker + AWS ECS Fargate / Kubernetes
- **Authentication**: OAuth 2.0 + JWT + SSO
- **Session management**: Redis

**Architecture Diagram**:
```
┌─────────────────────────────────────────────────────────────┐
│                      User Browser                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  React UI + xterm.js + WebSocket + Auth             │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTPS + WSS
                            ↓
┌─────────────────────────────────────────────────────────────┐
│               AWS Application Load Balancer                   │
│          (SSL Termination, WebSocket Support,                 │
│               Sticky Sessions)                                │
└───────────────────────────┬─────────────────────────────────┘
                            │
            ┌───────────────┴────────────────┐
            ↓                                ↓
┌───────────────────────┐        ┌───────────────────────────┐
│  Auth Service         │        │  WebSocket Server Pool     │
│  - OAuth 2.0 / OIDC   │        │  - Python/Node.js         │
│  - JWT tokens         │◄───────┤  - Session routing        │
│  - SSO (SAML, etc)    │        │  - Container mgmt         │
│  - User management    │        │  - Reconnection logic     │
└───────────────────────┘        └───────────┬───────────────┘
                                             ↓
                                 ┌───────────────────────────┐
                                 │  Redis (Session Store)     │
                                 │  - Active sessions         │
                                 │  - WebSocket mappings      │
                                 │  - User state              │
                                 └───────────┬───────────────┘
                                             ↓
                                 ┌───────────────────────────┐
                                 │   ECS Fargate Cluster      │
                                 │                            │
                                 │  ┌──────────────────────┐ │
                                 │  │ Container (User A)   │ │
                                 │  │ - Codex CLI (Rust)   │ │
                                 │  │ - tmux               │ │
                                 │  │ - User workspace     │ │
                                 │  └──────────────────────┘ │
                                 │  ┌──────────────────────┐ │
                                 │  │ Container (User B)   │ │
                                 │  │ - Codex CLI (Rust)   │ │
                                 │  │ - tmux               │ │
                                 │  │ - User workspace     │ │
                                 │  └──────────────────────┘ │
                                 │  ... (up to 500)         │
                                 └───────────┬───────────────┘
                                             ↓
                                 ┌───────────────────────────┐
                                 │   OpenAI API Gateway       │
                                 │   (Shared or Per-User)     │
                                 └───────────┬───────────────┘
                                             ↓
                                 ┌───────────────────────────┐
                                 │   S3 (Workspace Storage)   │
                                 │   - Code repositories      │
                                 │   - Session backups        │
                                 └───────────────────────────┘
```

### Option 4: App Server Mode (IDE Integration Approach)

**Approach**: Use Codex's built-in JSON-RPC app server

**Features**:
- Codex has app server mode for IDE integration
- JSON-RPC API for programmatic access
- Could build web UI calling this API

**Architecture**:
```
[Web UI] → [REST API] → [Codex App Server (JSON-RPC)] → [OpenAI API]
```

**Pros**:
- Official integration method
- Clean API surface
- Designed for external integration

**Cons**:
- Still need container-per-user isolation
- Documentation may be limited
- Designed for IDEs, not web terminals
- May not expose full terminal experience

## 4. Technical Challenges & Solutions

### Challenge 1: Rust Binary Web Integration ⚠️⚠️

**Problem**:
- Codex CLI is Rust binary expecting terminal
- TUI (ratatui) output not web-friendly
- pty (pseudo-terminal) needed for web
- Less ecosystem support than Node.js

**Solutions**:
1. **PTY Wrapper**:
   - Use node-pty or python-pty to spawn Rust binary
   - Capture stdin/stdout/stderr
   - Forward to WebSocket
   - Similar to standard web terminal approach

2. **App Server Mode**:
   - Use Codex's JSON-RPC app server
   - Build REST/WebSocket API wrapper
   - Custom UI not bound to terminal

3. **Consider Legacy Node.js Version**:
   - Fork pre-Rust version if needed
   - Trade performance for easier integration
   - Maintain as internal fork

**Complexity**: MEDIUM-HIGH (Higher than Claude Code due to Rust)

### Challenge 2: Authentication & Session Management ⚠️⚠️

**Problem**:
- Codex supports ChatGPT OAuth or API keys
- OAuth requires browser (difficult for headless servers)
- Device code auth available but requires user setup
- Per-user or shared API key decision
- Enterprise constraints and workspace management

**OpenAI Authentication Options**:
1. **ChatGPT OAuth** (default):
   - Standard browser-based flow
   - `codex login` launches browser
   - Stores token locally

2. **Device Code Auth** (for remote/headless):
   - `codex login --device-auth`
   - User enables in ChatGPT security settings
   - Copy-paste code flow
   - Better for server environments

3. **API Key Auth**:
   - Direct OpenAI API key
   - Set via environment variable or config
   - Simpler for automation
   - Better for organizational proxy

**Solutions**:

**Option A: Shared Organizational API Key (Recommended)**:
- Single OpenAI API key for all users
- Proxy layer for requests
- User-level tracking and quotas in your system
- Simpler authentication flow
- Centralized billing and cost control

**Option B: Per-User ChatGPT Accounts**:
- Each user authenticates with their ChatGPT account
- Proxy device code auth flow through web
- OAuth token storage in secure backend
- More complex but better cost attribution

**Option C: Hybrid Approach**:
- Technical users: Own API keys
- Non-technical users: Shared organizational key
- Toggle in user settings

**Implementation**:
- OAuth 2.0 / OIDC for web UI auth
- JWT tokens for session management
- SSO integration (SAML, Azure AD, Okta)
- Secure credential storage (AWS Secrets Manager, Vault)

**Complexity**: MEDIUM (Similar to Claude Code)

### Challenge 3: Multi-User Container Isolation ⚠️⚠️

**Problem**:
- Each user needs isolated Codex instance
- File system separation required
- One container per active user
- Resource limits and quotas

**Solutions**:
1. **Container-per-User**:
   - Docker images with Codex CLI pre-installed
   - User-specific workspace volumes
   - Environment variables for API keys
   - tmux for session persistence

2. **Container Lifecycle**:
   - Spin up on user login
   - 15-30 min idle timeout
   - Graceful shutdown with state save
   - Fast container start (<10 seconds)

3. **Workspace Persistence**:
   - EFS or S3 for workspace storage
   - Periodic backups
   - Git integration for code sync

**Docker Image**:
```dockerfile
FROM ubuntu:22.04

# Install Codex CLI
RUN npm i -g @openai/codex
# OR download Rust binary
# RUN wget https://github.com/openai/codex/releases/...

# Install development tools
RUN apt-get update && apt-get install -y \
    git curl vim tmux \
    python3 nodejs npm

# Set up user workspace
WORKDIR /workspace
VOLUME /workspace

# Entry point
CMD ["tmux", "new-session", "-s", "codex"]
```

**Complexity**: MEDIUM-HIGH (Same as Claude Code)

### Challenge 4: WebSocket & Session Management ⚠️⚠️

**Problem**:
- Persistent WebSocket connections required
- Connection drops need handling
- Session recovery after disconnect
- Load balancing with sticky sessions

**Solutions**:
1. **tmux/screen Multiplexer**:
   - Run Codex inside tmux session
   - Detach/reattach on connection loss
   - Session survives WebSocket drops

2. **Reconnection Logic**:
   - Frontend: Automatic reconnect with exponential backoff
   - Backend: Session ID mapping to containers
   - Redis: Track active sessions

3. **Load Balancing**:
   - ALB with sticky sessions
   - WebSocket-aware routing
   - Health checks and failover

**Complexity**: MEDIUM (Standard web terminal problem)

### Challenge 5: Codex-Specific Features ⚠️

**Problem**:
- Resume functionality (restart old sessions)
- Model switching (/model command)
- Approval modes (auto, on-edit, on-run)
- Screenshot/diagram input (multimodal)

**Solutions**:
1. **Resume Support**:
   - Store session transcripts in S3/database
   - Implement session picker UI
   - `codex resume` or `codex resume --last` via web

2. **Model Selection**:
   - UI dropdown for model choice
   - GPT-5-Codex, GPT-5.2-Codex, GPT-5
   - Reasoning level slider

3. **Approval Modes**:
   - UI toggle for approval strictness
   - Confirmation dialogs for edits/runs
   - User preference storage

4. **Multimodal Input**:
   - File upload for screenshots/diagrams
   - Drag-and-drop interface
   - Image preview before sending

**Complexity**: MEDIUM

### Challenge 6: Non-Technical User Experience ⚠️⚠️⚠️

**Problem**:
- 50% users are non-technical
- Terminal can be intimidating
- Need guided workflows
- Error handling must be clear

**Solutions**:
1. **Dual Interface**:
   - **Simple Mode**: Chat-first interface, hide terminal
   - **Advanced Mode**: Full terminal for technical users
   - Toggle between modes

2. **Guided Workflows**:
   - Templates: "Create a Python script", "Fix a bug", etc.
   - Wizard-style flows for common tasks
   - Pre-filled prompts with examples

3. **Enhanced UI**:
   - File browser (tree view)
   - Visual diff viewer for changes
   - One-click approve/reject edits
   - Progress indicators

4. **Help & Onboarding**:
   - Interactive tutorial on first launch
   - Contextual tooltips
   - Video guides library
   - FAQ and troubleshooting

5. **Error Handling**:
   - Plain English error messages
   - Suggested fixes
   - "Ask for help" button (support ticket)

**Complexity**: HIGH (Significant custom development)

### Challenge 7: Enterprise Management Features ⚠️

**Problem**:
- 500 users need management
- Usage tracking and quotas
- Cost attribution per team
- Admin controls

**Solutions**:
1. **Admin Dashboard**:
   - User management (add, remove, roles)
   - Usage analytics (per user, per team)
   - Cost tracking and alerts
   - System health monitoring

2. **Usage Quotas**:
   - API call limits per user/team
   - Daily/monthly caps
   - Soft warnings before hard limits
   - Request increase workflow

3. **Team Management**:
   - Hierarchical organization structure
   - Team-level API keys/budgets
   - Shared workspaces
   - Role-based access control (RBAC)

4. **Audit Logging**:
   - All user actions logged
   - API calls tracked
   - Security events monitored
   - Compliance reporting

**Complexity**: MEDIUM-HIGH

### Challenge 8: IDE Integration Parity ⚠️

**Problem**:
- Codex has VS Code, Cursor integration
- Web version should match feature parity
- Users may expect IDE-like features

**Solutions**:
1. **Code Editor Component**:
   - Monaco editor (VS Code's editor)
   - Syntax highlighting
   - IntelliSense / autocomplete
   - Side-by-side diff view

2. **File System UI**:
   - Tree view for navigation
   - Search in files
   - Multi-file editing
   - Git status indicators

3. **Optional**: Build full web IDE
   - Like VS Code in browser (code-server)
   - Embed Codex as assistant panel
   - Much larger scope

**Complexity**: MEDIUM (basic) to VERY HIGH (full IDE)

## 5. Cost Analysis

### Infrastructure Costs (AWS)

**ECS Fargate Containers**:
- Configuration: 0.5-1 vCPU, 1-2 GB RAM (Rust is lighter)
- Cost per hour: ~$0.025-0.04 (lighter than Claude Code containers)
- Average session: 2 hours
- Concurrent users: ~100-150 (not all 500 at once)
- Monthly cost: 150 containers × $0.03/hr × 730 hrs × 30% utilization = **~$985/month**

**With Spot Pricing** (70% discount):
- Monthly cost: **~$295/month**

**Load Balancer (ALB)**:
- Base + LCU hours: **~$100/month**

**Redis (ElastiCache)**:
- t4g.medium: **~$45/month**

**S3 Storage**:
- 500 users × 10 GB = 5 TB
- Cost: **~$115/month**

**Data Transfer**:
- **~$50-100/month**

**Monitoring & Logging**:
- CloudWatch: **~$50/month**

**Total Infrastructure**: **~$550-700/month** (with spot)
**Without spot instances**: **~$1,300-1,500/month**

**Lower than Claude Code due to**:
- Rust binary more efficient (less memory/CPU)
- Faster startup (better resource utilization)

### OpenAI API Costs

**Pricing** (GPT-5-Codex):
- Input: $1.25 per million tokens
- Output: $10.00 per million tokens

**GPT-5.2-Codex** (latest, 40% more expensive):
- Input: $1.75 per million tokens
- Output: $14.00 per million tokens

**Estimated Usage per User** (using GPT-5-Codex):
- Light user: 10M input + 5M output = **~$62.50/month**
- Medium user: 20M input + 10M output = **~$125/month**
- Heavy user: 50M input + 25M output = **~$312.50/month**

**For 500 Users** (mixed usage):
- 200 light users: $12,500
- 200 medium users: $25,000
- 100 heavy users: $31,250
- **Total API Cost: ~$68,750/month**

**Using GPT-5.2-Codex** (if users prefer latest):
- **Total API Cost: ~$96,250/month** (40% more)

**Comparison to Claude**:
- OpenAI API is **30-40% cheaper** than Claude Sonnet 4.5
- Less aggressive caching options than Claude
- Still significant cost at scale

### Development Costs

**Initial Development** (one-time):
- Frontend development: 3-4 weeks
- Backend development: 4-5 weeks
- Rust integration complexity: +1 week (vs Node.js)
- Authentication & security: 2-3 weeks
- DevOps & infrastructure: 2-3 weeks
- Testing & QA: 2 weeks
- Documentation: 1 week

**Total Development Time**: **~15-19 weeks** (3.75-4.75 months)

Slightly longer than Claude Code due to Rust integration complexity.

**Team Required**:
- 2 Full-stack developers
- 1 DevOps engineer
- 1 Backend developer (Rust/system integration experience)
- 1 Security specialist (part-time)

**Estimated Cost**: **$175,000-275,000**

### Ongoing Maintenance

- DevOps/SRE: 0.5 FTE = **~$60,000/year**
- Developer support: 0.25 FTE = **~$30,000/year**
- Security updates: **~$10,000/year**
- Rust binary updates/testing: **+$5,000/year**

**Total Ongoing**: **~$105,000/year** (~$8,750/month)

### Total Cost Summary

| Category | Monthly Cost | Annual Cost |
|----------|--------------|-------------|
| Infrastructure | $550-700 | $6,600-8,400 |
| OpenAI API (GPT-5-Codex) | $68,750 | $825,000 |
| OpenAI API (GPT-5.2-Codex) | $96,250 | $1,155,000 |
| Maintenance | $8,750 | $105,000 |
| **Total Recurring (GPT-5-Codex)** | **$78,050-78,200** | **$936,600-938,400** |
| **Total Recurring (GPT-5.2-Codex)** | **$105,550-105,700** | **$1,266,600-1,268,400** |
| Initial Development | - | $175,000-275,000 (one-time) |

**Cost Comparison to Claude Code**:
- Infrastructure: **25% cheaper** (Rust efficiency)
- API costs: **30-40% cheaper** (GPT-5-Codex vs Claude Sonnet)
- **Total: ~15-30% cheaper** overall

## 6. Alternative Approaches

### Alternative 1: Use Official Codex Web/Cloud

**Approach**: Use OpenAI's official web version (chatgpt.com/codex)

**Subscription Costs**:
- Free: Very limited
- Plus ($20/month): 30-150 tasks/5hr, limited for 500 users
- Pro ($200/month): Better limits, 300-1,500 tasks/5hr
- Enterprise: Custom pricing

**Cost Estimates**:
- 500 × $20 = **$10,000/month** (Plus, inadequate limits)
- 500 × $200 = **$100,000/month** (Pro, reasonable limits)
- Enterprise: Negotiate, likely **$50,000-80,000/month**

**Pros**:
- Zero development
- Fully managed
- Latest features
- Mobile, GitHub, IDE integration included
- Parallel cloud task execution

**Cons**:
- No custom proxy/API keys (must use ChatGPT subscription)
- Per-user costs potentially higher
- Less control over environment
- Vendor lock-in

**When to choose**:
- Quick deployment critical
- No engineering resources for custom build
- Willing to pay premium for managed service

### Alternative 2: VS Code Server + Codex Extension

**Approach**: Deploy VS Code Server (code-server) with Codex integration

**Architecture**:
- code-server (VS Code in browser)
- Codex extension installed
- Per-user instances in containers

**Pros**:
- Full IDE experience
- Codex integrated as assistant
- Better for coding workflows
- Non-technical users may prefer GUI

**Cons**:
- Higher resource usage
- More expensive (2-4 GB RAM per instance)
- Limited to VS Code experience
- Extension may not support all Codex features

**Cost**:
- Infrastructure: **~$1,500-2,500/month** (heavier containers)
- API: Same as custom approach
- Development: Less (VS Code already built)

### Alternative 3: Codex CLI via VDI

**Approach**: Virtual Desktop Infrastructure

**Solution**:
- AWS WorkSpaces or similar
- Full desktop per user
- Codex CLI installed locally
- Remote desktop protocol access

**Pros**:
- Zero custom development
- Familiar desktop experience
- Can use any local tools
- Easier for non-technical users

**Cons**:
- VDI expensive (~$30-60/user/month)
- Higher bandwidth requirements
- Less "modern" than web app

**Cost**:
- VDI: **$15,000-30,000/month**
- API: Same as custom
- **Total: ~$83,750-98,750/month**

## 7. Deployment Comparison: Codex vs Claude Code

| Factor | Codex CLI | Claude Code |
|--------|-----------|-------------|
| **Language** | Rust (recently rewritten) | TypeScript/Node.js |
| **Web Integration Difficulty** | Medium-High (Rust + pty) | Medium (Node.js native) |
| **Container Efficiency** | Better (Rust lightweight) | Good |
| **Infrastructure Cost** | 25% cheaper | Baseline |
| **API Cost** | 30-40% cheaper | More expensive |
| **Community Web Projects** | None found | 2-3 active projects |
| **Official Web Version** | Yes (chatgpt.com/codex) | Yes (claude.ai/code) |
| **Self-Host Official** | No | No |
| **Development Time** | 15-19 weeks | 14-18 weeks |
| **Authentication Options** | ChatGPT OAuth, API key, device code | Anthropic API key, OAuth |
| **IDE Integration** | VS Code, Cursor (JSON-RPC) | VS Code (MCP) |
| **Multimodal** | Yes (screenshots, diagrams) | Limited |
| **Session Resume** | Built-in | Via teleport feature |
| **Model Selection** | GPT-5-Codex, GPT-5.2-Codex, GPT-5 | Claude Sonnet, Opus |
| **Total Cost (500 users)** | ~$78K/month | ~$59K/month |

**Winner on Cost**: Claude Code (lower API costs dominate)
**Winner on Efficiency**: Codex CLI (Rust performance)
**Winner on Maturity**: Tie (both have official web versions)
**Winner on Web Integration**: Claude Code (Node.js easier)

## 8. Implementation Roadmap

### Phase 1: MVP (Weeks 1-6)

**Goal**: Basic web terminal with Codex CLI integration

- [ ] Set up AWS infrastructure (ECS, ALB, Redis)
- [ ] Build Docker image with Codex CLI (Rust binary)
- [ ] Develop WebSocket server with pty integration
- [ ] Integrate xterm.js frontend
- [ ] Implement JWT authentication
- [ ] Single-user proof of concept
- [ ] OpenAI API key configuration

**Deliverable**: Working prototype for 10-20 technical users

### Phase 2: Multi-User & Security (Weeks 7-11)

**Goal**: Production-ready multi-user system

- [ ] Per-user container isolation
- [ ] SSO integration (OAuth/SAML)
- [ ] Redis session management
- [ ] API key proxy layer (shared or per-user)
- [ ] Usage quotas and rate limiting
- [ ] Security hardening
- [ ] Audit logging

**Deliverable**: Secure multi-user system for 100 users

### Phase 3: Codex-Specific Features (Weeks 12-15)

**Goal**: Full feature parity with CLI

- [ ] Session resume functionality
- [ ] Model selection UI
- [ ] Approval mode toggles
- [ ] Multimodal input (screenshot upload)
- [ ] File manager integration
- [ ] Git workflow support
- [ ] Admin dashboard (basic)

**Deliverable**: Feature-complete for technical users

### Phase 4: Non-Technical UX (Weeks 16-19)

**Goal**: Scale to 500 users including non-technical

- [ ] Simplified chat-first interface
- [ ] Template library and workflows
- [ ] Guided onboarding flow
- [ ] Enhanced file browser
- [ ] Visual diff viewer
- [ ] Help system and documentation
- [ ] Performance optimization
- [ ] Load testing (500 concurrent)

**Deliverable**: Production launch for all users

## 9. Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Rust integration complexity | HIGH | MEDIUM | Budget extra dev time, hire Rust expert |
| API cost overruns | HIGH | MEDIUM | Strict quotas, monitoring, alerts |
| OpenAI API changes/pricing | HIGH | LOW-MEDIUM | Abstract API layer, budget flexibility |
| Security breach | CRITICAL | LOW | Container isolation, security audits |
| Poor non-technical adoption | HIGH | HIGH | Heavy UX investment, templates, training |
| Scalability issues | MEDIUM | MEDIUM | Load testing, gradual rollout |
| Codex CLI breaking changes | MEDIUM | MEDIUM | Pin versions, test before updating |
| WebSocket connection issues | MEDIUM | MEDIUM | Reconnection logic, tmux persistence |
| User confusion vs IDE | MEDIUM | MEDIUM-HIGH | Clear documentation, dual interface |

## 10. Success Metrics

### Technical Metrics

- Container spin-up time: <8 seconds (Rust faster than Node.js)
- WebSocket reliability: >99.5%
- API response latency: <2 seconds (p95)
- System uptime: >99.9%
- Concurrent user capacity: 500+

### Business Metrics

- User adoption rate: >70% within 3 months
- Daily active users: >200
- Average session duration: >30 minutes
- User satisfaction: >4/5
- Support tickets: <5% of users/month

### Cost Metrics

- Cost per user per month: <$160 (infrastructure + API)
- Infrastructure cost: <$700/month
- API cost optimization: Track and optimize usage patterns

## 11. Decision Matrix

### Should You Build This?

**Build Custom Solution if**:
- ✅ You need custom proxy/API key management
- ✅ Want control over infrastructure and UX
- ✅ Have budget for $175K-275K initial + $78K/month ongoing
- ✅ Have engineering resources for 4-5 month project
- ✅ Need customization for non-technical users
- ✅ Want lower per-user costs long-term
- ✅ Prefer open-source foundation

**Use Official Codex Web if**:
- ✅ Quick deployment critical (<1 month)
- ✅ No engineering resources for custom build
- ✅ Okay with $10K-100K/month subscription costs
- ✅ Want zero infrastructure management
- ✅ Need mobile, GitHub, IDE integration out of box
- ✅ Prefer fully managed service

**Choose Claude Code Instead if**:
- ✅ Lower API costs critical (Claude cheaper at scale)
- ✅ Node.js integration preferred over Rust
- ✅ MCP server ecosystem important
- ✅ More community web projects available

## 12. Conclusion

### Overall Assessment

**Difficulty Score: 6.5/10**

**Why 6.5?**:
- ✅ Rust binary is performant and secure
- ✅ OpenAI API cheaper than Claude
- ✅ Official web version available as fallback
- ⚠️ Rust integration more complex than Node.js
- ⚠️ Less community web projects than Claude Code
- ⚠️ pty wrapper needed for terminal emulation
- ⚠️ Multi-user isolation and security complex
- ⚠️ Non-technical UX requires significant work

### Difficulty Breakdown

| Component | Difficulty | Rationale |
|-----------|------------|-----------|
| Basic web terminal | 5/10 | Standard tech (xterm.js, WebSocket) |
| Rust CLI integration | 7/10 | More complex than Node.js, pty wrapper needed |
| Authentication | 6/10 | OpenAI device code auth adds complexity |
| Container orchestration | 7/10 | Per-user isolation, same as Claude Code |
| WebSocket management | 7/10 | Standard challenges, tmux helps |
| Multi-user isolation | 8/10 | Security-critical, requires careful design |
| Codex-specific features | 6/10 | Resume, model switching, approval modes |
| Non-technical UX | 9/10 | Significant custom development needed |
| Monitoring & scaling | 7/10 | 500 users, cost tracking, auto-scaling |

**Easier than Claude Code**:
- 25% cheaper infrastructure (Rust efficiency)
- 30-40% cheaper API costs
- More mature official web version

**Harder than Claude Code**:
- Rust integration more complex
- Less community web projects
- Need pty wrapper for terminal
- Fewer web-specific docs

### Recommendation

**Recommended Path**:

1. **Immediate (0-1 month)**:
   - **Start with official Codex Web** (chatgpt.com/codex)
   - Run pilot with 20-50 technical users
   - Test with ChatGPT Plus ($20/month) for initial group
   - Evaluate if features meet needs
   - Gather requirements and pain points

2. **Short-term (1-3 months)**:
   - If official version insufficient, evaluate custom build
   - Prototype Rust CLI integration with single-user web terminal
   - Proof of concept for authentication and API proxy
   - Cost analysis: Official subscriptions vs custom build ROI
   - Decision point: Build vs Buy

3. **Medium-term (3-6 months)** - If building custom:
   - MVP for 50-100 technical users
   - Authentication and multi-user support
   - Basic admin dashboard
   - Monitor costs closely

4. **Long-term (6-12 months)**:
   - Expand to 500 users
   - Enhanced UX for non-technical users
   - Full feature parity with CLI
   - Optimization and scaling

**Key Decision Factors**:

**Choose Official Codex Web if**:
- Time to deploy > cost savings
- Engineering resources limited
- Prefer managed service
- Mobile/GitHub/IDE integration important

**Choose Custom Build if**:
- Long-term cost savings critical (>12 month ROI)
- Need custom proxy/API management
- Want deep control and customization
- Have engineering capacity

**Choose Claude Code Custom Build if**:
- Node.js preferred over Rust
- API cost not as critical
- Want more community projects as reference
- MCP ecosystem important

### Final Verdict

**For your specific scenario (500 users, 50% non-technical, own API keys)**:

**Best Option: Start with Official Codex Web, then decide**

**Reasoning**:
1. **Immediate value**: Get users productive in days, not months
2. **Validate demand**: See actual usage before $175K-275K investment
3. **Compare costs**:
   - Official Pro: ~$100K/month (fully managed)
   - Custom build: ~$78K/month recurring + $175K-275K upfront
   - **ROI breakeven: 8-12 months**
4. **Risk mitigation**: If adoption is low, you haven't wasted dev investment
5. **Fallback**: Custom build still available if official version insufficient

**If usage is high and sustained after 3-6 months, revisit custom build decision with real data.**

---

## References & Resources

### Official Documentation
- [OpenAI Codex CLI Documentation](https://developers.openai.com/codex/cli)
- [Codex Features](https://developers.openai.com/codex/cli/features/)
- [Codex Authentication](https://developers.openai.com/codex/auth/)
- [OpenAI API Pricing](https://platform.openai.com/docs/pricing)

### GitHub Repositories
- [openai/codex](https://github.com/openai/codex) - Official Codex CLI (Rust)
- [ymichael/open-codex](https://github.com/ymichael/open-codex) - Fork with multi-provider support

### Technical Resources
- [Codex CLI Rust Rewrite Announcement](https://www.infoq.com/news/2025/06/codex-cli-rust-native-rewrite/)
- [xterm.js - Terminal for the Web](https://xtermjs.org/)
- [Building Browser-based Terminal](https://www.presidio.com/technical-blog/building-a-browser-based-terminal-using-docker-and-xtermjs/)
- [AWS ECS Exec Documentation](https://aws.amazon.com/blogs/containers/new-using-amazon-ecs-exec-access-your-containers-fargate-ec2/)

### Pricing & Cost Analysis
- [OpenAI GPT-5-Codex Pricing](https://pricepertoken.com/pricing-page/model/openai-gpt-5-codex)
- [Codex Pricing Guide](https://apidog.com/blog/codex-pricing/)
- [AWS Fargate Pricing](https://aws.amazon.com/fargate/pricing/)

### Security Best Practices
- [OAuth and JWT Best Practices](https://workos.com/blog/oauth-and-jwt-how-to-use-and-best-practices)
- [JWT Security Best Practices](https://curity.io/resources/learn/jwt-best-practices/)

---

**Document Version**: 1.0
**Last Updated**: January 2026
**Author**: Research & Analysis based on 2025-2026 public information
