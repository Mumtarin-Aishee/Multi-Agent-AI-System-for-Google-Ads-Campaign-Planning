# Multi-Agent Google Ads Pre-Launch System Design & Prototype Video

A multi-agent system design for turning campaign inputs into a structured, launch-ready Google Search campaign package, with a human review checkpoint at each key decision.

> [Disclaimer]
> **Prototype only. Not production ready.**
> This repository contains a system design and a clickable front-end prototype. The agents are simulated in the browser and all data is illustrative. Nothing connects to Google Ads, an LLM, or any live data source.

## Problem

In the Google Ads pre-launch phase, most search campaigns are built in silos, without fully integrating audience, competitor, and performance data before launch.


### 3 Integrated Agents

| Agent | Responsibility | Output |
| --- | --- | --- |
| **Keyword Intelligence** | Expands seed keywords, classifies search intent, and organizes keywords by intent and audience segment | Scored keywords, ad groups, negatives |
| **Competitor Monitoring** | Tracks competitor messaging, promotions, and trends to find what is saturated and where there is opportunity | Whitespace analysis, urgency alerts, recommended angles |
| **Ad Copy** | Turns the approved keyword strategy and competitor insights into RSAs aligned with audience, seasonality, landing pages, and brand guidelines | RSA assets with scorecards |

### Agent output dashboard at one glance

What the three agents produce, in one view. Click the image to see it at full size.

[![Agent output dashboard showing keywords, competitor insights, ad groups and RSA copy, and highlights](docs/output/agent-dashboard.png)](docs/output/agent-dashboard.png)

### Shared context

All three agents draw on the same inputs from **Strategy Setup** and **Data Sources**, where users enter campaign goals, audience, and seasonality, and connect data sources, URLs, and APIs. This keeps keyword strategy and ad copy aligned with campaign objectives.

### Human in the loop

Reviewers can approve, edit, or override decisions before deployment. The prototype models five approval gates, each recorded in an audit trail:

1. Keyword shortlist
2. Negative keywords
3. Ad group structure
4. Competitor messaging
5. Final RSA copy

## Deliverables

An agentic system that produces a complete campaign package, ready for export and upload:

- Export package
- Prioritized keywords
- Ad groups
- Negative keywords
- Responsive Search Ad (RSA) copy
- Competitor insights
- Quality scorecards and rationale

The package contents a user selects for export. The screen is a mock: export is not yet properly built.

![Export Campaign Package dialog listing package contents](docs/output/export-package.jpg)

### Quality scorecards

Scores for keyword opportunity, audience fit, seasonal demand, competitor whitespace, and ad copy readiness.

![Overview page with workflow status and quality scorecards](docs/output/scorecards.jpg)

### Approvals and audit trail

Five approval gates, with every agent and reviewer action recorded.

![Review and Approval Queue with audit trail](docs/output/approvals.jpg)

## How the Agentic System Works (Demo videos)

The previews below play at 4× speed without sound. Open a full video to hear the walkthrough.

### Part 1: Shared context

How the agents coordinate, and how Strategy Setup and Data Sources build the shared context.

[![Part 1 preview](docs/demo/part-1-preview.gif)](docs/demo/part-1-overview-and-setup.mp4)

**[Watch the full Part 1 youtube video with narration (1:26)] (https://youtu.be/7dmze3eRXM4?si=WbbygqZ-R339Ne3r)**

### Part 2: Keyword and Competitor agents

Keyword Intelligence, Competitor Monitoring, and the market-shift signal.

[![Part 2 preview](docs/demo/part-2-preview.gif)](docs/demo/part-2-keywords-and-competitors.mp4)

**[Watch the full Part 2 youtube video with narration (2:00)] (https://youtu.be/rCGLRmrLVuw?si=wyASdeiO6fwylRyg)**

### Part 3: Ad copy, approvals, and export

Ad Copy Agent, scoring, human-in-the-loop approvals, the audit trail, and the campaign package.

[![Part 3 preview](docs/demo/part-3-preview.gif)](docs/demo/part-3-ad-copy-and-approvals.mp4)

**[Watch the full Part 3 youtube video with narration (1:36)](https://youtu.be/N9eusQl2ybM?si=2TkEh71maULpGr1r)**

To try the prototype, download [`prototype/index.html`](prototype/index.html) and open it in a browser. It has no dependencies or build step.

## What the output looks like

The final output is a campaign package. Keywords, competitor insights, and ad copy are shown in the [agent output dashboard](#agent-output-dashboard). The screens below show the rest, using sample data from the prototype.

## Animated workflow

[`architecture/`](architecture) is a React app, built with Node.js and Vite, that animates the workflow narrated in the demo across 11 steps. Play it through, step manually, or click any part of the diagram to see what happens there. Requires Node.js 18 or later.

```bash
cd architecture
npm install
npm run dev
```


## Multi-Agent Workflow Architecture

An orchestration layer coordinates three agents through shared context. Each agent has a scoring layer, and its output passes through human review before final export.

[![Animated workflow of the multi-agent system](docs/workflow-animation.gif)](https://architecture-tau-nine.vercel.app)

**[Open the live interactive workflow](https://architecture-tau-nine.vercel.app)** to play it, step through it, or click any part of the diagram. The source is in [`architecture/`](architecture).

### Scoring

Keyword priority in the prototype uses a weighted formula, with weights adjustable by reviewers:

```text
score = 0.25 × Search Intent Fit
      + 0.20 × Audience Relevance
      + 0.15 × Seasonality
      + 0.15 × Search Volume
      + 0.10 × CPC Efficiency
      + 0.10 × Historical Performance
      + 0.05 × Competitor Whitespace
```

Ad copy is scored on brand voice fit, landing page relevance, audience match, policy safety, keyword coverage, and seasonal fit.


## What the prototype does and does not do

| Implemented in the prototype | Not implemented |
| --- | --- |
| Dashboard and navigation for each stage | Real agents or LLM calls |
| Keyword filtering, approve and reject actions | Orchestration runtime and shared context store |
| Ad copy review and headline pinning | Google Ads, GA4, CRM, or other API integrations |
| Approval gates and an in-session audit trail | Competitor scraping or monitoring |
| Scoring weight controls | Live scoring against real data |
| Placeholder export dialog | Real package export, authentication, persistence, and access control |
| | Google Ads policy validation, testing, and monitoring |

## Path to production

1. Implement the orchestrator and a versioned shared context store.
2. Build each agent with structured outputs and evaluation sets.
3. Connect the Google Ads API, keyword data, analytics, and compliant competitor data sources.
4. Persist approvals and audit events, with role-based access.
5. Validate exports against Google Ads Editor formats and ad policies.
6. Close the feedback loop by feeding post-launch performance into scoring.

## Disclaimer

The demo uses Uniqlo and its competitors as an illustrative scenario only. This project is not affiliated with or endorsed by any brand mentioned. All keywords, metrics, promotions, reviewer names, and scores are sample data and should not be read as real market or company information.
