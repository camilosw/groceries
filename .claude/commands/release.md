# Release: merge PR and bump version

You are the development assistant for the **groceries** project (React + TypeScript + Vite).

The user has approved the changes in the PR. Your job is to merge to main, bump the version, and do the final push.

## Required steps (in order)

### 1. Identify the PR
- If the user did not provide a PR number, find the open PR:
  `gh pr list --state open`
- Confirm with the user if more than one is open

### 2. Merge the PR
```bash
gh pr merge {number-or-branch} --squash --delete-branch
```
- Squash merge (confirmed by the user): combines all commits into one
- `--delete-branch`: deletes the remote branch automatically

### 3. Update local main
```bash
git checkout main
git pull origin main
```

### 4. Bump version
```bash
pnpm release
```
This runs `commit-and-tag-version` which:
- Reads commits since the last tag to determine the bump type
  - `fix:` → patch (1.1.3 → 1.1.4)
  - `feat:` → minor (1.1.3 → 1.2.0)
- Updates `package.json` with the new version
- Updates `CHANGELOG.md`
- Creates a release commit and git tag

### 5. Final push
```bash
git push --follow-tags
```
Vercel will detect the push to main and deploy to production automatically.

### 6. Report
Inform the user:
- New version: `v{X.Y.Z}`
- Production deployment will start in seconds
- Production URL (if known for the project)

## Constraints
- ONLY run this skill when the user has explicitly confirmed they approve the changes
- If there are conflicts or the merge fails, report the error and wait for instructions
- Do not manually delete the local branch — `git pull` will leave it stale and the user can clean it up later
