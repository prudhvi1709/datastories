# Claude Code Web Deployment Analysis

## Executive Summary

**Tool**: Claude Code CLI by Anthropic
**Current State**: Terminal-based CLI tool with official web version available
**Deployment Goal**: Self-hosted web interface for ~500 users (50% technical, 50% non-technical)
**Overall Difficulty Score**: **7.5/10**

## 1. Tool Overview

### What is Claude Code?

Claude Code is Anthropic's official CLI tool for AI-assisted software engineering. It provides:
- Full terminal-based interactive coding environment
- File read/write/edit capabilities
- Command execution with user permissions
- Integration with MCP (Model Context Protocol) servers
- Session management and conversation history

### Architecture & Tech Stack

**Primary Stack**:
- **Language**: TypeScript/Node.js
- **Runtime**: Node.js
- **Package Manager**: npm
- **Protocol**: MCP (Model Context Protocol)
- **Authentication**: Anthropic API keys or OAuth
- **Terminal Interface**: Full TUI (Terminal User Interface)

**Key Components**:
- Core session management engine
- Tool execution system (file operations, bash commands)
- Conversation state management
- MCP server integration layer
- Permission system for file/command operations

## 2. Official Web Version

### Claude Code on the Web (claude.ai/code)

**Availability**: November 12, 2025
**Access**: https://claude.ai/code

**Features**:
- Browser-based coding environment
- GitHub repository integration
- Runs in secure Ubuntu containers (Gvisor isolation)
- No local installation required
- Concurrent task execution across multiple repositories
- "Teleport" feature to sync with local CLI

**Limitations**:
- **NOT self-hostable** - runs only on Anthropic's infrastructure
- **GitHub only** - requires code to be in GitHub repositories
- Limited to approved package repositories
- Cannot access local network
- No persistence between tasks
- Requires Anthropic account/subscription

**Security Architecture**:
- Gvisor isolation
- seccomp-bpf system call filtering
- AppArmor mandatory access controls
- Cannot bind to network ports
- No inbound connections allowed
- Regular security audits

## 3. Self-Hosted Web Deployment Options

### Option 1: Community Web UI Projects

#### A. sugyan/claude-code-webui

**Repository**: https://github.com/sugyan/claude-code-webui

**Architecture**:
- Dual runtime support (Node.js and Deno)
- Hono web framework
- Uses @anthropic-ai/claude-code SDK
- WebSocket for streaming responses
- Executes Claude CLI locally and provides web access

**Pros**:
- Relatively lightweight
- Streaming chat responses
- Active development

**Cons**:
- **NO built-in authentication**
- Designed for single-user, local use
- Explicitly warns against public internet exposure
- Requires Claude CLI installed on server
- No multi-user session isolation
- Limited production-ready features

#### B. vultuk/claude-code-web

**Repository**: https://github.com/vultuk/claude-code-web

**Features**:
- Multi-session support
- Terminal-like environment in browser
- Real-time streaming
- Full interactivity

**Cons**:
- Still requires local Claude CLI
- Authentication not clearly documented
- Similar limitations to sugyan's project

### Option 2: Custom Web Terminal Architecture

Build a production-grade solution from scratch using:

**Frontend Stack**:
- **xterm.js**: Terminal emulator for browser
- **React/Vue**: UI framework
- **WebSocket**: Real-time bidirectional communication
- **TypeScript**: Type safety

**Backend Stack**:
- **Node.js/Express or Python/FastAPI**: Web server
- **WebSocket server**: Handle terminal connections
- **Container orchestration**: Docker + Kubernetes or AWS ECS Fargate
- **Authentication layer**: OAuth 2.0 + JWT
- **Session management**: Redis or similar

**Architecture Diagram**:
```
[User Browser]
    ↓ (HTTPS + WebSocket)
[Load Balancer / API Gateway]
    ↓
[Authentication Service] (OAuth/SSO/JWT)
    ↓
[Session Manager] (Redis)
    ↓
[WebSocket Server Pool]
    ↓
[Container Orchestrator] (ECS Fargate / K8s)
    ↓
[Per-User Containers]
    ↓ (each container runs)
[Claude CLI + tmux/screen]
```

## 4. Technical Challenges & Solutions

### Challenge 1: Multi-User Isolation ⚠️⚠️⚠️

**Problem**:
- Claude Code CLI is single-user by design
- No built-in session isolation
- One CLI instance per user needed
- File system access requires isolation

**Solutions**:
1. **Container-per-user approach**:
   - Spin up Docker container per active session
   - Mount user-specific workspace volumes
   - Use AWS ECS Fargate for auto-scaling
   - Terminate containers after inactivity timeout

2. **User workspace isolation**:
   - Separate `/workspace/{user_id}` directories
   - Linux user namespaces for additional isolation
   - SELinux or AppArmor profiles per container

**Complexity**: HIGH

### Challenge 2: Authentication & Authorization ⚠️⚠️

**Problem**:
- No built-in auth in community projects
- Need enterprise SSO integration
- API key management per user
- Session token security

**Solutions**:
1. **Authentication Layer**:
   - Implement OAuth 2.0 / OIDC
   - JWT tokens with HTTP-only cookies
   - Support for corporate SSO (SAML, LDAP)
   - API key encryption and secure storage

2. **Authorization**:
   - Role-based access control (RBAC)
   - Per-user API key or shared proxy
   - Usage quotas and rate limiting
   - Audit logging for compliance

**Complexity**: MEDIUM-HIGH

### Challenge 3: WebSocket State Management ⚠️⚠️

**Problem**:
- Terminal requires persistent WebSocket connection
- Connection drops need graceful handling
- Session recovery after disconnection
- Load balancing WebSocket connections

**Solutions**:
1. **Session Persistence**:
   - tmux/screen multiplexer in containers
   - Redis for session metadata storage
   - Reconnection logic with session ID
   - Heartbeat/ping-pong for connection health

2. **Load Balancing**:
   - Sticky sessions at load balancer
   - WebSocket-aware ALB (AWS)
   - Connection pooling and lifecycle management

**Complexity**: MEDIUM-HIGH

### Challenge 4: Resource Management & Scaling ⚠️⚠️

**Problem**:
- 500 concurrent users = 500 containers
- Resource consumption (CPU, memory, storage)
- Cost management
- Auto-scaling strategy

**Solutions**:
1. **Container Orchestration**:
   - AWS ECS Fargate (serverless containers)
   - Kubernetes with HPA (Horizontal Pod Autoscaler)
   - Container reaping for idle sessions (15-30 min timeout)
   - Resource limits per container (1 vCPU, 2GB RAM suggested)

2. **Cost Optimization**:
   - Spot instances for ECS tasks (70% savings)
   - Aggressive idle timeout policies
   - Shared workspace volumes where possible
   - Monitoring and alerting on resource usage

**Estimated Resources per User**:
- CPU: 0.5-1 vCPU
- Memory: 1-2 GB RAM
- Storage: 5-10 GB per workspace
- Network: WebSocket bandwidth minimal

**Complexity**: HIGH

### Challenge 5: API Key Management ⚠️

**Problem**:
- Each user needs Anthropic API access
- Managing 500 user keys vs shared proxy
- Cost attribution and quotas
- Key rotation and security

**Solutions**:

**Option A: Shared Proxy (Recommended for your use case)**:
- Single organizational API key
- Proxy layer for all Claude API requests
- User-level usage tracking and quotas
- Simpler key management
- Centralized billing

**Option B: Per-User Keys**:
- Users provide their own API keys
- Encrypted storage (AWS Secrets Manager, Vault)
- More complex but better cost attribution
- Users responsible for their spending

**Complexity**: MEDIUM (shared) to HIGH (per-user)

### Challenge 6: Non-Technical User Experience ⚠️⚠️⚠️

**Problem**:
- 50% of users are non-technical
- Terminal interface intimidating
- No GUI for common operations
- Steeper learning curve

**Solutions**:
1. **Simplified UI Layer**:
   - Add GUI wrapper around terminal
   - Pre-built templates and commands
   - Visual file explorer
   - Point-and-click common operations

2. **Onboarding & Documentation**:
   - Interactive tutorials
   - Video guides
   - Template projects to start from
   - In-app help and tooltips

3. **Hybrid Interface**:
   - Chat-first interface for non-tech users
   - Terminal available but not required
   - Progressive disclosure of advanced features

**Complexity**: HIGH (requires significant custom development)

### Challenge 7: File Upload/Download ⚠️

**Problem**:
- Users need to get files into/out of containers
- Terminal-only makes this awkward
- Large files over WebSocket challenging

**Solutions**:
1. **Web-based File Manager**:
   - Drag-and-drop file upload
   - Browser-based file download
   - Integration with S3 or object storage
   - Direct upload to container volumes

2. **Git Integration**:
   - Clone repositories into workspace
   - Push/pull for code sync
   - GitHub/GitLab integration

**Complexity**: MEDIUM

### Challenge 8: Monitoring & Observability ⚠️

**Problem**:
- 500 containers to monitor
- User experience tracking
- Error detection and alerting
- Cost monitoring

**Solutions**:
1. **Infrastructure Monitoring**:
   - CloudWatch (AWS) or Prometheus/Grafana
   - Container health checks
   - Resource utilization dashboards
   - Auto-scaling metrics

2. **Application Monitoring**:
   - User session analytics
   - Error tracking (Sentry, Datadog)
   - API usage and latency metrics
   - Cost tracking per user/team

3. **Logging**:
   - Centralized logging (CloudWatch Logs, ELK stack)
   - Audit trails for security
   - Session recording (with consent)

**Complexity**: MEDIUM

## 5. Recommended Architecture

### Production-Grade Architecture for 500 Users

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  React UI + xterm.js + WebSocket Client + JWT Auth  │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTPS + WSS
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                     AWS Application Load Balancer             │
│              (SSL Termination, Sticky Sessions)               │
└───────────────────────────┬─────────────────────────────────┘
                            │
            ┌───────────────┴────────────────┐
            ↓                                ↓
┌───────────────────────┐        ┌───────────────────────────┐
│  Auth Service (ECS)   │        │  WebSocket Server Pool     │
│  - OAuth 2.0/JWT      │        │  - Node.js/FastAPI        │
│  - SSO Integration    │◄───────┤  - Session Management     │
│  - User Management    │        │  - Container Orchestration │
└───────────────────────┘        └───────────┬───────────────┘
            │                                ↓
            │                    ┌───────────────────────────┐
            │                    │  Redis (Session Store)     │
            │                    │  - Active sessions         │
            │                    │  - WebSocket mappings      │
            │                    │  - User metadata           │
            │                    └───────────────────────────┘
            │                                ↓
            │                ┌───────────────────────────────┐
            └───────────────►│   ECS Fargate Cluster         │
                             │  ┌─────────────────────────┐  │
                             │  │ Container (User A)      │  │
                             │  │ - Claude CLI            │  │
                             │  │ - tmux                  │  │
                             │  │ - User workspace        │  │
                             │  └─────────────────────────┘  │
                             │  ┌─────────────────────────┐  │
                             │  │ Container (User B)      │  │
                             │  │ - Claude CLI            │  │
                             │  │ - tmux                  │  │
                             │  │ - User workspace        │  │
                             │  └─────────────────────────┘  │
                             │  ... (up to 500 containers)   │
                             └───────────────────────────────┘
                                            ↓
                             ┌───────────────────────────────┐
                             │   Anthropic Claude API         │
                             │   (Shared Proxy or Per-User)   │
                             └───────────────────────────────┘
                                            ↓
                             ┌───────────────────────────────┐
                             │   AWS S3 (File Storage)        │
                             │   - User workspaces backup     │
                             │   - Session recordings         │
                             └───────────────────────────────┘
```

### Component Breakdown

1. **Frontend (React + xterm.js)**:
   - Terminal emulator
   - File upload/download UI
   - Authentication flow
   - Chat interface option

2. **Load Balancer**:
   - AWS ALB with WebSocket support
   - SSL/TLS termination
   - Sticky sessions for WebSocket

3. **Authentication Service**:
   - OAuth 2.0 / OIDC provider
   - JWT token issuance
   - SSO integration (SAML, Azure AD, Okta)
   - User management and RBAC

4. **WebSocket Server Pool**:
   - Node.js or Python backend
   - WebSocket connection handling
   - Session routing to containers
   - Health checks and reconnection logic

5. **Redis Session Store**:
   - Active session metadata
   - WebSocket connection mappings
   - User preferences and state
   - Rate limiting data

6. **ECS Fargate Containers**:
   - One container per active user
   - Pre-built Docker image with:
     - Claude CLI (authenticated)
     - tmux for session persistence
     - Development tools
     - User workspace volume
   - Auto-scaling based on demand
   - 15-30 minute idle timeout

7. **S3 Storage**:
   - Workspace backups
   - User file uploads
   - Session logs (if enabled)

## 6. Cost Analysis

### Infrastructure Costs (AWS)

**ECS Fargate Containers**:
- Configuration: 1 vCPU, 2 GB RAM
- Cost per hour: ~$0.04
- Average session duration: 2 hours
- Active users at once: ~100-150 (not all 500 simultaneous)
- Monthly cost: 150 containers × $0.04/hr × 730 hrs × 30% utilization = **~$1,314/month**

**With Spot Pricing** (70% discount):
- Monthly cost: **~$394/month**

**Load Balancer**:
- ALB: ~$20/month base + $0.008/LCU-hour
- Estimated: **~$100/month**

**Redis**:
- ElastiCache t4g.medium: **~$45/month**

**S3 Storage**:
- 500 users × 10 GB = 5 TB
- Cost: **~$115/month**

**Data Transfer**:
- Estimated: **~$50-100/month**

**Monitoring & Logging**:
- CloudWatch, alerts: **~$50/month**

**Total Infrastructure**: **~$700-900/month** (with spot instances)
**Without spot instances**: **~$1,600-1,800/month**

### Claude API Costs

**Pricing** (Claude Sonnet 4.5):
- Input: $3 per million tokens
- Output: $15 per million tokens

**Estimated Usage per User**:
- Light user: 10M tokens/month = **~$90/month**
- Medium user: 20M tokens/month = **~$180/month**
- Heavy user: 50M tokens/month = **~$450/month**

**For 500 Users** (assuming mixed usage):
- 200 light users: $18,000
- 200 medium users: $36,000
- 100 heavy users: $45,000
- **Total API Cost: ~$99,000/month**

**With Prompt Caching** (90% cache hit rate):
- Can reduce by 40-50%
- **Optimized API Cost: ~$50,000-60,000/month**

### Development Costs

**Initial Development** (one-time):
- Frontend development: 3-4 weeks
- Backend development: 4-5 weeks
- Authentication & security: 2-3 weeks
- DevOps & infrastructure: 2-3 weeks
- Testing & QA: 2 weeks
- Documentation: 1 week

**Total Development Time**: **~14-18 weeks** (3.5-4.5 months)

**Team Required**:
- 2 Full-stack developers
- 1 DevOps engineer
- 1 Security specialist (part-time)

**Estimated Cost**: **$150,000-250,000** (depending on team location/rates)

### Ongoing Maintenance

- DevOps/SRE: 0.5 FTE = **~$60,000/year**
- Developer support: 0.25 FTE = **~$30,000/year**
- Security updates: **~$10,000/year**

**Total Ongoing**: **~$100,000/year** (~$8,300/month)

### Total Cost Summary

| Category | Monthly Cost | Annual Cost |
|----------|--------------|-------------|
| Infrastructure | $700-900 | $8,400-10,800 |
| Claude API | $50,000-60,000 | $600,000-720,000 |
| Maintenance | $8,300 | $100,000 |
| **Total Recurring** | **$59,000-69,200** | **$708,400-830,800** |
| Initial Development | - | $150,000-250,000 (one-time) |

## 7. Alternative Approaches

### Alternative 1: Use Official Claude Code Web

**Approach**: Use Anthropic's official web version (claude.ai/code)

**Pros**:
- Zero development effort
- Fully managed by Anthropic
- Security handled professionally
- Latest features automatically
- No infrastructure to manage

**Cons**:
- No custom proxy/API keys (must use Anthropic subscription)
- GitHub-only (no local files)
- Less control over environment
- Per-user subscription required
- Cost: $20-100/user/month = **$10,000-50,000/month**

**When to choose**: If GitHub-centric workflow is acceptable and you want zero infrastructure management.

### Alternative 2: Desktop App with VDI

**Approach**: Run Claude CLI in virtual desktop infrastructure

**Architecture**:
- AWS WorkSpaces or similar VDI solution
- Claude CLI installed on each virtual desktop
- Users connect via remote desktop protocol

**Pros**:
- Full desktop experience
- No custom web development
- Easier for non-technical users (familiar desktop UI)
- Can use any local tools

**Cons**:
- VDI costs higher (~$25-50/user/month)
- More resource intensive
- Network bandwidth requirements higher
- Less "modern" web experience

**Cost**: **~$12,500-25,000/month** for VDI + API costs

### Alternative 3: Jupyter-Style Notebook Interface

**Approach**: Build notebook-style interface instead of terminal

**Features**:
- Code cells with Claude AI assistance
- Markdown documentation cells
- Output visualization
- More guided experience for non-technical users

**Pros**:
- Better for non-technical users
- Structured workflow
- Easier to onboard
- Better for data analysis tasks

**Cons**:
- Not a true terminal experience
- May not fit all use cases
- More custom development
- Different mental model than CLI

## 8. Implementation Roadmap

### Phase 1: MVP (Weeks 1-6)

**Goal**: Basic web terminal with authentication

- [ ] Set up AWS infrastructure (ECS, ALB, RDS)
- [ ] Develop basic WebSocket server
- [ ] Integrate xterm.js frontend
- [ ] Implement JWT authentication
- [ ] Container orchestration (single-user proof of concept)
- [ ] Deploy Claude CLI in containers
- [ ] Basic file upload/download

**Deliverable**: Working prototype for 10-20 users

### Phase 2: Multi-User & Security (Weeks 7-10)

**Goal**: Production-ready multi-user system

- [ ] Implement per-user container isolation
- [ ] Add SSO integration (OAuth/SAML)
- [ ] Set up Redis session management
- [ ] Implement API key proxy layer
- [ ] Add usage quotas and rate limiting
- [ ] Security hardening (AppArmor, seccomp)
- [ ] Audit logging

**Deliverable**: Secure multi-user system

### Phase 3: UX & Scale (Weeks 11-14)

**Goal**: Scale to 500 users, improve UX

- [ ] Auto-scaling configuration
- [ ] Enhanced UI for non-technical users
- [ ] File manager and Git integration
- [ ] Monitoring and alerting dashboards
- [ ] Cost optimization (spot instances)
- [ ] Performance testing under load
- [ ] Documentation and training materials

**Deliverable**: Production system for 500 users

### Phase 4: Polish & Optimization (Weeks 15-18)

**Goal**: Production launch and optimization

- [ ] User onboarding flow
- [ ] Advanced features (templates, sharing)
- [ ] Mobile responsive design
- [ ] Comprehensive testing and QA
- [ ] Beta user testing
- [ ] Performance optimization
- [ ] Launch preparation

**Deliverable**: Production launch

## 9. Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Cost overruns (API usage) | HIGH | MEDIUM | Implement strict quotas, monitoring, alerts |
| Security breach (container escape) | CRITICAL | LOW | Use proven isolation (Gvisor), regular audits, bug bounty |
| Poor non-technical user adoption | HIGH | HIGH | Invest heavily in UX, templates, training |
| Infrastructure scalability issues | MEDIUM | MEDIUM | Load testing, gradual rollout, auto-scaling |
| Development timeline slippage | MEDIUM | HIGH | Agile methodology, MVP approach, realistic estimates |
| Vendor lock-in (Anthropic API changes) | MEDIUM | LOW | Abstract API layer, monitor Anthropic announcements |
| WebSocket connection stability | MEDIUM | MEDIUM | Reconnection logic, session persistence (tmux) |
| Regulatory/compliance issues | VARIABLE | LOW-MEDIUM | Legal review, data residency options, audit logging |

## 10. Success Metrics

### Technical Metrics

- Container spin-up time: <10 seconds
- WebSocket connection reliability: >99.5%
- API response latency: <2 seconds (p95)
- System uptime: >99.9%
- Concurrent user capacity: 500+

### Business Metrics

- User adoption rate: >70% within 3 months
- Daily active users: >200
- Average session duration: >30 minutes
- User satisfaction score: >4/5
- Support ticket volume: <5% of users/month

### Cost Metrics

- Cost per user per month: <$150 (including API)
- Infrastructure cost: <$1,000/month
- API cost optimization: >40% reduction via caching

## 11. Decision Matrix

### Should You Build This?

**Build if**:
- ✅ You need custom proxy/API key management
- ✅ You need deep integration with your infrastructure
- ✅ You want full control over user experience
- ✅ You have budget for $150K-250K initial + $60K/month ongoing
- ✅ You have engineering resources for 3-4 month project
- ✅ You need features not in official web version
- ✅ You want to customize for non-technical users

**Don't build if**:
- ❌ Official Claude Code web version meets your needs
- ❌ You're GitHub-centric and okay with that limitation
- ❌ You prefer zero infrastructure management
- ❌ Budget constraints (<$100K for project)
- ❌ Need to launch in <2 months
- ❌ Limited engineering team
- ❌ Uncertain about user adoption

## 12. Conclusion

### Overall Assessment

**Difficulty Score: 7.5/10**

**Why 7.5?**:
- ✅ Technology is proven (xterm.js, WebSocket, containers)
- ✅ Community projects provide starting point
- ⚠️ Significant custom development required
- ⚠️ Complex multi-user isolation and security
- ⚠️ Non-trivial operational complexity
- ⚠️ High ongoing costs (mostly API, not infra)

### Difficulty Breakdown

| Component | Difficulty | Rationale |
|-----------|------------|-----------|
| Basic web terminal | 5/10 | Well-established tech (xterm.js) |
| Authentication | 6/10 | Standard OAuth/JWT but needs proper implementation |
| Container orchestration | 7/10 | ECS Fargate helps, but per-user isolation complex |
| WebSocket management | 7/10 | Reconnection logic, session persistence challenging |
| Multi-user isolation | 8/10 | Security-critical, requires careful design |
| Non-technical UX | 9/10 | Significant custom development, hard to get right |
| Security hardening | 8/10 | Critical for 500 users, requires expertise |
| Scaling & cost optimization | 7/10 | Monitoring, auto-scaling, cost management complex |

### Recommendation

**Recommended Path**:

1. **Short-term (0-3 months)**:
   - Start with official Claude Code web (claude.ai/code) for GitHub-based workflows
   - Run pilot with 20-50 users using terminal CLI + VPN access
   - Gather requirements and pain points

2. **Medium-term (3-6 months)**:
   - If official version doesn't meet needs, begin custom development
   - Start with MVP for technical users only
   - Use sugyan/claude-code-webui as reference
   - Add authentication and basic multi-user support

3. **Long-term (6-12 months)**:
   - Expand to non-technical users with enhanced UI
   - Full production deployment with all features
   - Ongoing optimization and feature development

**Key Success Factors**:
- Start small, iterate based on real usage
- Invest heavily in UX for non-technical users
- Monitor costs closely (API usage can spiral)
- Security review before production launch
- Have dedicated DevOps/SRE for ongoing support

---

## References & Resources

### Official Documentation
- [Claude Code Documentation](https://code.claude.com/docs/en/claude-code-on-the-web)
- [Claude Code on the Web | Anthropic](https://www.anthropic.com/news/claude-code-on-the-web)
- [Claude API Pricing](https://docs.claude.com/en/docs/about-claude/pricing)

### Community Projects
- [sugyan/claude-code-webui](https://github.com/sugyan/claude-code-webui)
- [vultuk/claude-code-web](https://github.com/vultuk/claude-code-web)
- [steipete/claude-code-mcp](https://github.com/steipete/claude-code-mcp)

### Technical Resources
- [xterm.js - Terminal for the Web](https://xtermjs.org/)
- [Building Browser-based Terminal using Docker and XtermJS](https://www.presidio.com/technical-blog/building-a-browser-based-terminal-using-docker-and-xtermjs/)
- [AWS ECS Exec Documentation](https://aws.amazon.com/blogs/containers/new-using-amazon-ecs-exec-access-your-containers-fargate-ec2/)
- [OAuth and JWT Best Practices](https://workos.com/blog/oauth-and-jwt-how-to-use-and-best-practices)

### Cost & Pricing
- [Claude API Pricing 2025](https://www.metacto.com/blogs/anthropic-api-pricing-a-full-breakdown-of-costs-and-integration)
- [AWS Fargate Pricing](https://aws.amazon.com/fargate/pricing/)

---

**Document Version**: 1.0
**Last Updated**: January 2026
**Author**: Research & Analysis based on 2025-2026 public information
