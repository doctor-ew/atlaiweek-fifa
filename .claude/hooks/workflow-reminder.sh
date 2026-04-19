#!/bin/bash
# workflow-reminder.sh
#
# Injected into Claude's context at session start.
# stdout becomes part of Claude's context window — keep it short.

cat <<'EOF'
## ATL FIFA Navigator — Spec-Driven Workflow

The spec-driven development framework is active for this repo.

**Before writing any code:**
1. Ask what the engineer is working on
2. If there's a task, offer to run /spec to generate a spec
3. Read CLAUDE.md for repo-specific conventions and commands
4. No code ships without an approved spec

**Available commands:** /spec · /implement
**Agents:** Spec Writer · General Engineer (see .claude/agents/)
**Key rule:** PRD → /spec → approve → /implement. In that order, always.

**SPEC GUARDRAIL is active.**
Any Write to a SPEC*.md file will be blocked if:
- ## Sources is missing or contains only the template placeholder
- ## Model Router is missing or Decision field is not filled in

Run code-fact-extractor on all identifiers before drafting. No spec ships without verified sources.
EOF

# Inject recent lessons if they exist
if [ -f ".claude/lessons.md" ]; then
  LESSON_COUNT=$(grep -c "^## " .claude/lessons.md 2>/dev/null || echo 0)
  if [ "$LESSON_COUNT" -gt 0 ]; then
    echo ""
    echo "## Lessons from prior sessions (last 3)"
    grep -A 2 "^## " .claude/lessons.md | grep -v "^--$" | tail -9
  fi
fi
