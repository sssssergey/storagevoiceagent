# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `npm run dev` — start the dev server (default http://localhost:3000)
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — ESLint (flat config, no `next lint` wrapper)

There is no test runner configured yet; do not invent `npm test`.

## Stack and version pins

- **Next.js 16.2.4** with the App Router and `src/` layout (`src/app/`). APIs in this major may differ from older Next.js — see the `@AGENTS.md` warning and consult `node_modules/next/dist/docs/` before writing new framework code.
- **React 19.2.4**.
- **Tailwind CSS v4** via the PostCSS plugin (`@tailwindcss/postcss` in `postcss.config.mjs`). There is no `tailwind.config.*` — global styles live in `src/app/globals.css`, which uses the v4 syntax (`@import "tailwindcss"` and `@theme inline { ... }` for design tokens). Do not add a v3-style config or `@tailwind base/components/utilities` directives.
- **ESLint 9 flat config** (`eslint.config.mjs`) composed from sub-path imports `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`. The legacy single-package import is not used here.
- **TypeScript**: `strict` mode, `moduleResolution: "bundler"`, path alias `@/* → src/*`.

## Architecture notes

- App Router only; everything renders through `src/app/layout.tsx` which sets `<html>`/`<body>` classes (full-height flex column) and wires Geist + Geist Mono via `next/font/google` as CSS variables (`--font-geist-sans`, `--font-geist-mono`) consumed by the Tailwind theme in `globals.css`. Page content goes in `src/app/page.tsx` and other route segments under `src/app/`.
- The repo is currently the `create-next-app` starter — no domain code, API routes, data layer, or tests exist yet. Treat the existing `page.tsx` as scaffolding to replace, not a pattern to mimic.

---

# N8N Workflow Builder - Claude Code Rules

This project is for building full working N8N workflows interactively using Claude Code with the n8n-mcp MCP server and n8n skills.

## N8N Instance

- **URL**: https://n8n.srv983772.hstgr.cloud/
- **API**: Configured via `.mcp.json` (n8n-mcp MCP server)

## Skills to Use

The following n8n-specific skills are installed and MUST be invoked when relevant:

| Skill | When to Use |
|-------|------------|
| `n8n-mcp-tools-expert` | ANY time you use MCP tools (search, validate, create, update workflows) |
| `n8n-workflow-patterns` | When designing workflow architecture or starting a new workflow |
| `n8n-expression-syntax` | When writing `{{}}` expressions or accessing `$json`/`$node` variables |
| `n8n-node-configuration` | When configuring a specific node's properties/operations |
| `n8n-validation-expert` | When interpreting validation errors or warnings |
| `n8n-code-javascript` | When writing JavaScript in Code nodes |
| `n8n-code-python` | When writing Python in Code nodes |

## Workflow Building Process

Always follow this sequence when building workflows:

### 1. Planning
- Invoke `n8n-workflow-patterns` skill to choose the right architectural pattern
- Identify the trigger type (Webhook, Schedule, Manual, Service)
- Plan data flow: trigger → transform → output
- Plan error handling strategy

### 2. Node Discovery
- Use `search_nodes({query: "keyword"})` to find nodes
- Use `get_node({nodeType: "nodes-base.name"})` for node details (default `detail: "standard"`)
- Search templates: `search_templates({query: "..."})` for inspiration

### 3. Workflow Creation
- Create with `n8n_create_workflow({name, nodes, connections})`
- Build **iteratively** — add nodes one at a time with `n8n_update_partial_workflow`
- Include `intent` parameter in every update call
- Use smart parameters: `branch: "true"/"false"` for IF nodes, `case: 0` for Switch nodes

### 4. Validation
- Validate nodes: `validate_node({nodeType, config, profile: "runtime"})`
- Validate full workflow: `n8n_validate_workflow({id})`
- Fix errors, then validate again (validation loop)

### 5. Activation
- Activate via: `n8n_update_partial_workflow({id, operations: [{type: "activateWorkflow"}]})`

## Critical Rules

### nodeType Formats (VERY IMPORTANT)
Two different formats for different tools:

```
Search/Validate tools → short prefix:   "nodes-base.slack"
Workflow tools        → full prefix:    "n8n-nodes-base.slack"

LangChain search/validate: "nodes-langchain.agent"
LangChain workflow:        "@n8n/n8n-nodes-langchain.agent"
```

`search_nodes` returns BOTH formats — use `nodeType` for search/validate, `workflowNodeType` for workflow tools.

### Expressions
- Always wrap in `{{ }}`: `{{$json.field}}`
- Webhook body data is under `$json.body`: `{{$json.body.email}}` NOT `{{$json.email}}`
- Reference other nodes: `{{$node["Node Name"].json.field}}`

### Node Configuration
- Use `detail: "standard"` (default) for `get_node` — covers 95% of cases
- Only use `detail: "full"` for debugging complex issues
- Specify validation profile explicitly: `profile: "runtime"` (recommended)

### Building Workflows
- **Never build in one shot** — iterate step by step
- After each update, auto-sanitization runs on ALL nodes (this is normal)
- Validate after every significant set of changes
- Use descriptive node names
- Never hardcode credentials in node parameters — use n8n credential store

### Error Handling
- Every production workflow needs error handling
- Use Error Trigger node for workflow-level error catching
- Add `continueOnFail: true` for nodes where errors should not stop execution
- Test with sample data before activating

## MCP Tool Quick Reference

| Task | Tool |
|------|------|
| Find a node | `search_nodes({query: "..."})` |
| Understand a node | `get_node({nodeType: "nodes-base.name"})` |
| Check configuration | `validate_node({nodeType, config, profile: "runtime"})` |
| Create new workflow | `n8n_create_workflow({name, nodes, connections})` |
| Edit existing workflow | `n8n_update_partial_workflow({id, intent, operations: [...]})` |
| Validate workflow | `n8n_validate_workflow({id})` |
| List workflows | `n8n_list_workflows()` |
| Get a workflow | `n8n_get_workflow({id})` |
| Deploy a template | `n8n_deploy_template({templateId, autoFix: true})` |
| Search templates | `search_templates({query: "..."})` |
| Activate workflow | `n8n_update_partial_workflow({id, operations: [{type: "activateWorkflow"}]})` |
| Health check | `n8n_health_check()` |

## 5 Core Workflow Patterns

1. **Webhook Processing** — Receive HTTP → Process → Respond/Notify
2. **HTTP API Integration** — Trigger → Fetch API → Transform → Action
3. **Database Operations** — Schedule → Query → Transform → Write
4. **AI Agent Workflow** — Trigger → AI Agent (Model + Tools + Memory) → Output
5. **Scheduled Tasks** — Cron → Fetch → Process → Deliver → Log

## Common Gotchas

- Webhook data is under `$json.body`, not `$json` directly
- IF node connections use `branch: "true"` or `branch: "false"`
- Switch node connections use `case: 0`, `case: 1`, etc.
- Use `n8n-nodes-base.*` prefix (full) for workflow creation, `nodes-base.*` (short) for search/validate
- Auto-sanitization runs after every update — operators get fixed automatically
- Always include the `intent` parameter in `n8n_update_partial_workflow` calls

## Workflow to Open n8n

To view workflows in the browser: https://n8n.srv983772.hstgr.cloud/
