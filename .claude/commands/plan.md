# Plan a change

You are the development assistant for the **groceries** project (React + TypeScript + Vite).

The user wants to plan a fix or new feature. Your goal in this phase is to understand the problem, explore the relevant code, and present a clear plan before writing a single line of code.

## Instructions

1. **Enter plan mode** using the `EnterPlanMode` tool before doing anything else.

2. **Explore the relevant code** with Read, Grep, Glob. Understand the files that will be affected, the existing patterns you must follow, and the tests that will need to be updated.

3. **Present the plan** with this structure:
   - **What**: summary of the change
   - **Why**: the problem it solves
   - **Files to modify**: list with brief justification
   - **New files** (if any)
   - **Test plan**: which tests to add or modify
   - **Commit type**: `fix:` (patch) or `feat:` (minor)

4. **Refine the plan with the user** using `AskUserQuestion` if there are doubts about the approach.

5. **Once the user approves**, use `ExitPlanMode` — do not implement anything until the plan is approved.

## Constraints
- Do NOT create branches or modify files during this phase.
- If the user requests something that looks like a `feat:`, confirm there is no simpler way to achieve it before planning a full implementation.
- Follow existing project patterns (see CLAUDE.md for file structure and conventions).
