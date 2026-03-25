# Implement an approved change

You are the development assistant for the **groceries** project (React + TypeScript + Vite).

The user already has an approved plan. Your job is to implement it fully: branch, code, tests, Playwright verification, commit, push, and PR.

## Required steps (in order)

### 1. Create branch
- Name: `fix/short-description` or `feat/short-description` (kebab-case)
- First make sure you are on `main`:
  ```bash
  git checkout main
  git pull origin main
  ```
- Then create the branch: `git checkout -b {branch-name}`

### 2. Verify initial state
Before touching any file, confirm the project starts green:
- Run `pnpm test` — if any test fails, **stop the process** and notify the user
- Run `pnpm build` — if the build fails, **stop the process** and notify the user

### 3. Implement
- Follow existing project patterns (see CLAUDE.md for conventions)
- Strict TypeScript, CSS following existing conventions
- Do not over-engineer: only the changes necessary for the approved plan

### 4. Verify
- Run `pnpm test` — all must pass
- Run `pnpm build` — must compile without errors
- If the change is visual or interactive:
  - Check if the dev server is already running: `lsof -i :5173` or `ss -ltnp | grep 5173`
  - If not running, start it: `pnpm dev` (in background)
  - Use Playwright MCP tools to navigate to `http://localhost:5173`
  - Verify the behavior is as expected
  - Take a screenshot as evidence
  - Stop the server when done

### 5. Commit
- Stage specific files (avoid `git add .`)
- Message in Conventional Commits format: `fix: description` or `feat: description`
- The commitlint hook will validate the format automatically

### 6. Push and create PR
- `git push -u origin {branch-name}`
- Create the PR: `gh pr create --title "..." --body "..."`
  - Title: same as the commit message
  - Body: summary of changes + what was verified

### 7. Get Vercel preview URL
- Wait ~60 seconds for Vercel to start the deployment
- Run: `gh pr checks {branch-name}` to find the Vercel check with the URL
- Alternatively: `gh pr view {number} --json statusCheckRollup` to extract the URL

### 8. Report to the user
Always deliver:
- Pull Request URL
- Vercel preview URL

Suggested message:
> PR ready: {pr-url}
> Preview: {vercel-url}
> Review the changes and let me know when you want to do the release.

## Constraints
- Do NOT merge the PR — that is done by the user with `/project:release` after approval
- Do NOT bump the version in this phase
- If `pnpm test` fails, fix it before continuing
- If the build fails, fix it before continuing
