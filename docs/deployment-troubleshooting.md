# Deployment Troubleshooting Guide

## Overview

This document provides solutions to common deployment issues with the GitHub Actions CDN deployment workflow.

---

## Issue: "Your local changes would be overwritten by checkout"

### Error Message

```
error: Your local changes to the following files would be overwritten by checkout:
	dist/index.css
	dist/index.js
Please commit your changes or stash them before you switch branches.
Aborting
Error: Process completed with exit code 1.
```

### Root Cause

The deployment workflow follows these steps:
1. Checkout the repository (e.g., `master` branch)
2. Build the project → Creates/modifies files in `dist/` directory
3. Save `dist/` files to a temporary directory
4. Try to checkout the `dist` branch

**The Problem:** When trying to checkout the `dist` branch in step 4, Git detects that the `dist/` directory has uncommitted changes from the build step. Git refuses to switch branches to prevent data loss.

### Solution

The workflow has been updated to clean up local changes before switching branches:

```yaml
# Clean up any local changes before switching branches
echo "Cleaning up local changes..."
git reset --hard HEAD
git clean -fd
```

**What this does:**
- `git reset --hard HEAD` - Discards all uncommitted changes in tracked files
- `git clean -fd` - Removes all untracked files and directories

This is safe because:
1. The build files are already saved to a temporary directory
2. We're in a CI environment, not a developer's local machine
3. The original source code is preserved in the repository

---

## Issue: Deployment Fails on First Run

### Error Message

```
Dist branch doesn't exist, creating orphan branch...
fatal: A branch named 'dist' already exists.
```

### Root Cause

The `dist` branch exists remotely but not locally, causing confusion in the branch creation logic.

### Solution

The workflow checks if the branch exists remotely before attempting to create it:

```yaml
if git ls-remote --exit-code --heads origin dist; then
  echo "Dist branch exists, fetching..."
  git fetch origin dist:dist
  git checkout dist
else
  echo "Dist branch doesn't exist, creating orphan branch..."
  git checkout --orphan dist
fi
```

---

## Issue: jsDelivr Not Updating

### Symptoms

- Deployment succeeds
- Files are pushed to `dist` branch
- jsDelivr still serves old version

### Root Cause

jsDelivr caches files aggressively. It can take up to 24 hours for the cache to update.

### Solutions

#### Option 1: Purge jsDelivr Cache (Recommended)

Visit the jsDelivr purge tool:
```
https://www.jsdelivr.com/tools/purge
```

Enter your URLs:
```
https://cdn.jsdelivr.net/gh/joaolucaswork/lp-reino-2025@dist/index.js
https://cdn.jsdelivr.net/gh/joaolucaswork/lp-reino-2025@dist/index.css
```

#### Option 2: Use Version Tags

Instead of using `@dist`, use specific version tags:

```html
<!-- Instead of this (cached): -->
<script defer src="https://cdn.jsdelivr.net/gh/joaolucaswork/lp-reino-2025@dist/index.js"></script>

<!-- Use this (version-specific): -->
<script defer src="https://cdn.jsdelivr.net/gh/joaolucaswork/lp-reino-2025@v1.0.5/index.js"></script>
```

Version-specific URLs are cached permanently but are guaranteed to be correct.

#### Option 3: Add Cache Busting Query Parameter

```html
<script defer src="https://cdn.jsdelivr.net/gh/joaolucaswork/lp-reino-2025@dist/index.js?v=1.0.5"></script>
```

---

## Issue: Permission Denied When Pushing

### Error Message

```
remote: Permission to joaolucaswork/lp-reino-2025.git denied to github-actions[bot].
fatal: unable to access 'https://github.com/joaolucaswork/lp-reino-2025/': The requested URL returned error: 403
```

### Root Cause

The GitHub Actions workflow doesn't have permission to push to the repository.

### Solution

Ensure the workflow has the correct permissions:

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: write # Required to push to branches
```

This is already configured in the workflow file.

---

## Issue: Build Fails in CI But Works Locally

### Symptoms

- `pnpm build` works on local machine
- Fails in GitHub Actions with errors

### Common Causes & Solutions

#### 1. Node Version Mismatch

**Check local version:**
```bash
node --version
```

**Update workflow if needed:**
```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20' # Match your local version
```

#### 2. Missing Dependencies

**Solution:** Ensure `pnpm install --frozen-lockfile` is used:
```yaml
- name: Install dependencies
  run: pnpm install --frozen-lockfile
```

#### 3. Environment Variables

**Solution:** Add required environment variables to workflow:
```yaml
- name: Build production bundle
  run: pnpm build
  env:
    NODE_ENV: production
```

---

## Issue: Workflow Doesn't Trigger

### Symptoms

- Push tag but workflow doesn't run
- Manual trigger button not visible

### Solutions

#### For Tag-Based Triggers

Ensure you're pushing tags correctly:

```bash
# Create and push tag
git tag v1.0.5
git push origin v1.0.5

# Or create and push in one command
git tag v1.0.5 && git push origin v1.0.5
```

Tag format must match the pattern in workflow:
```yaml
on:
  push:
    tags:
      - 'v*.*.*' # Must be v1.0.0, v2.1.3, etc.
```

#### For Manual Triggers

Ensure `workflow_dispatch` is configured:
```yaml
on:
  workflow_dispatch:
    inputs:
      version:
        description: 'Version tag (e.g., v1.0.1)'
        required: false
        default: 'latest'
```

---

## Deployment Checklist

Before deploying, verify:

- [ ] All changes are committed and pushed to `master`
- [ ] Build works locally: `pnpm build`
- [ ] Tests pass: `pnpm test` (if applicable)
- [ ] Version number is updated in relevant files
- [ ] Tag follows semantic versioning: `v1.0.5`
- [ ] GitHub Actions has `contents: write` permission
- [ ] No merge conflicts in `master` branch

---

## Manual Deployment Steps

If automated deployment fails, you can deploy manually:

### 1. Build Locally

```bash
pnpm install
pnpm build
```

### 2. Create Dist Branch

```bash
# Save current branch
CURRENT_BRANCH=$(git branch --show-current)

# Create/checkout dist branch
git checkout -b dist 2>/dev/null || git checkout dist

# Remove all files except .git and dist/
find . -mindepth 1 -maxdepth 1 ! -name '.git' ! -name 'dist' -exec rm -rf {} +

# Move dist contents to root
mv dist/* .
rmdir dist

# Commit and push
git add .
git commit -m "Manual deployment v1.0.5"
git push origin dist --force

# Return to original branch
git checkout $CURRENT_BRANCH
```

### 3. Verify Deployment

Check that files are in the dist branch:
```
https://github.com/joaolucaswork/lp-reino-2025/tree/dist
```

Test jsDelivr URL:
```
https://cdn.jsdelivr.net/gh/joaolucaswork/lp-reino-2025@dist/index.js
```

---

## Monitoring Deployments

### Check Workflow Status

1. Go to: https://github.com/joaolucaswork/lp-reino-2025/actions
2. Click on "Deploy to CDN" workflow
3. View recent runs and their status

### Check Deployed Files

View the dist branch:
```
https://github.com/joaolucaswork/lp-reino-2025/tree/dist
```

### Test CDN URLs

Open in browser:
```
https://cdn.jsdelivr.net/gh/joaolucaswork/lp-reino-2025@dist/index.js
https://cdn.jsdelivr.net/gh/joaolucaswork/lp-reino-2025@dist/index.css
```

---

## Best Practices

### 1. Use Semantic Versioning

Follow the format: `vMAJOR.MINOR.PATCH`

- **MAJOR:** Breaking changes
- **MINOR:** New features (backward compatible)
- **PATCH:** Bug fixes

Examples:
- `v1.0.0` - Initial release
- `v1.0.1` - Bug fix
- `v1.1.0` - New feature
- `v2.0.0` - Breaking change

### 2. Test Before Tagging

```bash
# Build and test locally
pnpm build
pnpm test

# Only then create tag
git tag v1.0.5
git push origin v1.0.5
```

### 3. Use Version-Specific URLs in Production

```html
<!-- ✅ Good: Version-specific (stable) -->
<script defer src="https://cdn.jsdelivr.net/gh/joaolucaswork/lp-reino-2025@v1.0.5/index.js"></script>

<!-- ⚠️ Caution: Auto-updating (may break) -->
<script defer src="https://cdn.jsdelivr.net/gh/joaolucaswork/lp-reino-2025@dist/index.js"></script>
```

### 4. Document Changes

Create a changelog or release notes for each version:
```markdown
## v1.0.5 - 2025-01-09

### Added
- Name-based personalization feature
- Unique SVG illustrations per user

### Fixed
- Back face info-data element color updates
- SVG color persistence during card rotation
```

---

## Getting Help

If you encounter issues not covered here:

1. **Check GitHub Actions logs:** Detailed error messages are in the workflow run logs
2. **Check git status:** `git status` and `git log` can reveal issues
3. **Check jsDelivr status:** https://status.jsdelivr.com/
4. **Review recent changes:** `git diff` to see what changed

---

**Last Updated:** January 2025  
**Version:** 1.0  
**Related:** [Deploy CDN Workflow](../.github/workflows/deploy-cdn.yml)

