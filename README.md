![Shrek Rizz](shrek-shrek-rizz.gif)

# Local Assistant Code (Local Coding Agents)

A local source snapshot of an assistant-style CLI that supports interactive coding sessions, local tools, custom agents, skills, plugins, and MCP integrations.

## Important Notice

This repository appears to be a source snapshot, not an official release package.

- It currently has no root package.json in this workspace snapshot.
- Some feature flags and internal-only commands are compiled behind build-time gates.
- You can still use this README as a practical local guide, but treat source-run instructions as best effort.

## What This Project Is

At a high level, this codebase provides:

- A CLI (currently invoked as `claude` for compatibility) with interactive mode by default.
- A non-interactive print mode (`-p` or `--print`) for scripting.
- A slash-command system (`/help`, `/review`, `/mcp`, `/plugin`, etc.).
- A local tool runtime (Bash, file read/edit/write, web fetch/search, notebook editing, MCP resources).
- A custom agent system loaded from markdown definitions.
- A skill system loaded from project and user skill directories.

## Quick Start

### Track A: You Already Have `claude` Installed

Use this path if the `claude` command is already available on your machine.

```bash
claude --version
claude --help
claude
```

Inside interactive mode, run:

```text
/help
```

Useful non-interactive examples:

```bash
claude -p "summarize this repository"
claude --print --output-format json "list risky files"
claude --continue
claude --resume
claude --model sonnet
claude --agent <agent-name>
```

### Track B: Run From This Source Snapshot (Best Effort)

Use this if you want to experiment directly from source.

Prerequisites:

- Node.js 18+
- Bun runtime

Example attempt:

```bash
bun entrypoints/cli.tsx --help
bun entrypoints/cli.tsx
```

If this fails, use Track A with an installed binary and keep this repository for study/customization.

## Authentication and Session Basics

Depending on your environment and provider setup, you will typically use one of:

- `/login` inside interactive mode for web OAuth flows.
- `ANTHROPIC_API_KEY` environment variable for API key flows.

Session controls:

- `--continue` continues the latest conversation in the current directory.
- `--resume [id]` resumes by session id or opens a picker.
- `--fork-session` forks a resumed session into a new session id.

## Using Coding Agents Locally

This is the core workflow most users care about.

### 1. Start Interactive Mode

```bash
claude
```

Then use:

```text
/help
```

### 2. Create Custom Agents

Agent markdown files are loaded from `agents` config directories (project/user/policy sources).

Common locations:

- Project: `.claude/agents/`
- User/global: `~/.claude/agents/`

Minimal example (`.claude/agents/reviewer.md`):

```md
---
name: reviewer
description: Reviews code changes for bugs and regressions
tools: Read,Edit,Bash
model: inherit
---

You are a careful code reviewer. Prioritize correctness, edge cases, and regression risk.
```

Use it:

```bash
claude --agent reviewer
```

Or inspect configured agents in session:

```text
/agents
```

### 3. Create Skills

Skills are loaded from skill directories and can be invoked as slash commands.

Common locations:

- Project: `.claude/skills/`
- User/global: `~/.claude/skills/`

Directory format is widely used:

```text
.claude/skills/my-skill/SKILL.md
```

Minimal example (`.claude/skills/my-skill/SKILL.md`):

```md
---
name: my-skill
description: Run a focused refactor checklist
---

When invoked, do the following:

1. Identify code smells
2. Propose smallest safe refactor
3. Apply edits
4. Run quick verification
```

Then in chat:

```text
/my-skill
```

## Common Command Categories

Start with these command groups:

- Setup and diagnostics: `/init`, `/doctor`, `/status`
- Coding workflow: `/review`, `/diff`, `/commit`
- Extensibility: `/agents`, `/skills`, `/plugin`, `/mcp`
- Session/context: `/memory`, `/context`, `/resume`, `/clear`

Tip: use `/help` as the canonical source of what your current build enables.

## Print Mode for Automation

Use print mode for scripts, CI glue, and deterministic output handling.

```bash
claude --print "generate a release summary from git log"
claude --print --output-format stream-json "review the staged changes"
```

Useful related flags:

- `--input-format text|stream-json`
- `--output-format text|json|stream-json`
- `--max-turns <n>`
- `--max-budget-usd <amount>`
- `--allowedTools` and `--disallowedTools`

## Remote Control / Bridge Mode

The codebase includes bridge/remote-control paths (aliases include `remote-control`, `rc`, `remote`, `sync`, `bridge`).

Use this only after auth is configured and policy allows remote control:

```bash
claude remote-control
```

Notes:

- Bridge paths only allow safe command subsets.
- UI-heavy local commands are intentionally restricted in remote contexts.

## Troubleshooting

If something does not work, check in this order:

1. Verify runtime prerequisites (Node 18+, Bun if source-running).
2. Run `claude --help`, then start interactive mode and run `/help`.
3. Run `/doctor` inside interactive mode.
4. If source-run fails, prefer installed binary flow and use this repo as reference.
5. If a skill/agent is not visible, verify path and frontmatter syntax first.

## Developer Orientation

If you want to extend this project, start here:

- CLI entry and global flags: `main.tsx`
- Bootstrap entrypoint: `entrypoints/cli.tsx`
- Command registry and safety filtering: `commands.ts`
- Tool inventory and gating: `tools.ts`
- Query execution core: `QueryEngine.ts`
- Agent loading and precedence: `tools/AgentTool/loadAgentsDir.ts`
- Skill loading and parsing: `skills/loadSkillsDir.ts`
- Remote/bridge subsystem: `bridge/`

## Practical Next Steps

1. Run `claude` and confirm `/help` works.
2. Add one local agent in `.claude/agents/`.
3. Add one skill in `.claude/skills/<name>/SKILL.md`.
4. Test both interactive and `--print` workflows.
5. Add MCP servers and plugins once base flow is stable.
