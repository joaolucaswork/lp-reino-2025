# CDN Deployment Guide

This guide explains how to deploy your production build to jsDelivr CDN using the automated deployment system.

## 🎯 Overview

The project uses a **separate `dist` branch** strategy to keep your main development branches clean while making built files accessible to jsDelivr CDN.

### Benefits

- ✅ **Clean git workflow** - `dist/` folder remains ignored in development branches
- ✅ **No git clutter** - Built files don't appear in your daily commits
- ✅ **Automated deployment** - GitHub Actions handles everything automatically
- ✅ **Version control** - Support for both versioned and latest releases
- ✅ **CDN-ready** - Files are immediately available via jsDelivr

---

## 🚀 Deployment Methods

### Method 1: Automatic Deployment (Recommended)

**Triggered automatically when you create a version tag:**

```bash
# Create and push a version tag
git tag v1.0.1
git push origin v1.0.1
```

GitHub Actions will automatically:
1. Build the production bundle
2. Deploy to the `dist` branch
3. Make it available on jsDelivr

**View the workflow:** [GitHub Actions](https://github.com/joaolucaswork/lp-reino-2025/actions)

---

### Method 2: Manual Deployment via Script

**Deploy from your local machine:**

```bash
# Deploy as latest
pnpm deploy:cdn

# Deploy with a specific version
pnpm deploy:cdn:version v1.0.1
# or
./bin/deploy-cdn.sh v1.0.1
```

**What the script does:**
1. ✅ Checks working directory is clean
2. ✅ Builds production bundle
3. ✅ Creates/updates `dist` branch
4. ✅ Copies built files to branch root
5. ✅ Commits and pushes to remote
6. ✅ Creates version tag (if specified)
7. ✅ Returns to your original branch

---

### Method 3: Manual Trigger via GitHub

**Trigger deployment from GitHub UI:**

1. Go to [Actions tab](https://github.com/joaolucaswork/lp-reino-2025/actions)
2. Select "Deploy to CDN" workflow
3. Click "Run workflow"
4. Enter version (optional) or leave as "latest"
5. Click "Run workflow"

---

## 📦 jsDelivr URLs

After deployment, your files are available at:

### Latest Version (Auto-updates)
```html
<script defer src="https://cdn.jsdelivr.net/gh/joaolucaswork/lp-reino-2025@dist/index.js"></script>
```

**Use this when:** You want automatic updates with each deployment

---

### Specific Version (Locked)
```html
<script defer src="https://cdn.jsdelivr.net/gh/joaolucaswork/lp-reino-2025@v1.0.0/index.js"></script>
```

**Use this when:** You want to lock to a specific version for stability

---

### From Main Branch (For Testing)
```html
<script defer src="https://cdn.jsdelivr.net/gh/joaolucaswork/lp-reino-2025@master/dist/index.js"></script>
```

**Use this when:** Testing before creating a release (requires dist/ in master)

---

## 🔧 Webflow Integration

### Where to Add the Script

1. Open your Webflow project
2. Go to **Project Settings** → **Custom Code**
3. Add the script in the **Footer Code** section (before `</body>`)
4. Use the `defer` attribute to ensure DOM is ready

### Example

```html
<!-- Add this to Webflow Footer Code -->
<script defer src="https://cdn.jsdelivr.net/gh/joaolucaswork/lp-reino-2025@dist/index.js"></script>
```

---

## 📋 Deployment Workflow

### For Regular Updates

```bash
# 1. Make your changes in src/
# 2. Test locally
pnpm dev

# 3. Commit your changes
git add .
git commit -m "Add new feature"
git push

# 4. Deploy to CDN
pnpm deploy:cdn
```

---

### For Versioned Releases

```bash
# 1. Make your changes and commit
git add .
git commit -m "Release v1.0.1"
git push

# 2. Create and push version tag
git tag v1.0.1
git push origin v1.0.1

# GitHub Actions will automatically deploy!
```

---

## 🔍 Verifying Deployment

### Check the dist Branch

```bash
# View the dist branch
git fetch origin
git checkout dist

# View files
ls -la

# Return to your branch
git checkout master
```

### Check jsDelivr

Visit: `https://cdn.jsdelivr.net/gh/joaolucaswork/lp-reino-2025@dist/`

You should see:
- `index.js` - Your production bundle
- `index.js.map` - Source map
- `README.md` - Build information

---

## 🧹 Keeping Your Workflow Clean

### What's Ignored

The `dist/` folder is ignored in all development branches:
- ✅ `master`
- ✅ `class-clarify`
- ✅ Any feature branches

### What's Tracked

The `dist` branch contains ONLY built files:
- `index.js`
- `index.js.map`
- `README.md`

### Git Status

Your `git status` will always be clean - no `dist/` files cluttering your commits!

---

## 🐛 Troubleshooting

### Script Permission Denied

```bash
chmod +x bin/deploy-cdn.sh
```

### Working Directory Not Clean

```bash
# Stash your changes
git stash

# Deploy
pnpm deploy:cdn

# Restore changes
git stash pop
```

### GitHub Actions Failing

1. Check the [Actions tab](https://github.com/joaolucaswork/lp-reino-2025/actions)
2. View the failed workflow logs
3. Common issues:
   - Build errors (check `pnpm build` locally)
   - Permission issues (check repository settings)
   - Missing dependencies (check `pnpm install`)

### jsDelivr Not Updating

jsDelivr caches files for 7 days. To force refresh:

```html
<!-- Add cache-busting parameter -->
<script defer src="https://cdn.jsdelivr.net/gh/joaolucaswork/lp-reino-2025@dist/index.js?v=20250108"></script>
```

Or purge the cache: https://www.jsdelivr.com/tools/purge

---

## 📚 Additional Resources

- [jsDelivr Documentation](https://www.jsdelivr.com/documentation)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Webflow Custom Code](https://university.webflow.com/lesson/custom-code-in-the-head-and-body-tags)

---

## 🎉 Summary

**For daily development:**
```bash
# Just work normally - dist/ is ignored!
git add .
git commit -m "Your changes"
git push
```

**When ready to deploy:**
```bash
# One command deployment
pnpm deploy:cdn
```

**Your Webflow script:**
```html
<script defer src="https://cdn.jsdelivr.net/gh/joaolucaswork/lp-reino-2025@dist/index.js"></script>
```

That's it! Clean workflow, automated deployment, CDN-ready. 🚀

