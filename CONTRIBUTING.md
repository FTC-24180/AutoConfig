# ?? Quick Start Guide for Contributors

## New to the Project?

Welcome! This guide will get you up and running quickly.

## Setup (5 minutes)

### 1. Clone and Install
```bash
git clone https://github.com/FTC-24180/Autofig.git
cd Autofig
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

Open http://localhost:5173 in your browser. Changes auto-reload!

## Making Changes

### 1. Create Your Changes
Edit files in `src/` directory. The app will hot-reload automatically.

### 2. Commit with Semantic Messages

**Important**: Use conventional commit messages for automatic versioning!

```bash
# Bug fix ? Version 2.6.0 ? 2.6.1
git commit -m "fix: resolve QR scanning crash"

# New feature ? Version 2.6.0 ? 2.7.0
git commit -m "feat: add match export feature"

# Breaking change ? Version 2.6.0 ? 3.0.0
git commit -m "feat!: redesign storage system"
```

See [VERSIONING.md](VERSIONING.md) for more examples.

### 3. Push Your Changes
```bash
git push origin main
```

### 4. Review the Release PR

Release Please will automatically:
- ? Create or update a release PR
- ? Calculate the new version
- ? Update CHANGELOG.md
- ? Wait for your review

**Check GitHub PRs** for: "chore(main): release X.X.X"

### 5. Merge When Ready

- **Don't merge immediately!** Let changes accumulate
- Review the PR to see all changes since last release
- Edit CHANGELOG.md if needed
- **Merge the PR** when you're ready to deploy

Deployment happens automatically after merging!

## Release Control

### Accumulating Changes

Release Please is smart about multiple commits:

```bash
# Monday
git commit -m "feat: add feature A"
git push  # Creates release PR

# Tuesday
git commit -m "feat: add feature B"
git push  # Updates same PR

# Wednesday
git commit -m "fix: bug fix"
git push  # PR still open

# Thursday - Ready!
# Merge the PR ? All changes release together
```

### Emergency Release

```bash
# Push urgent fix
git commit -m "fix: critical security patch"
git push

# Release PR created/updated
# Merge immediately for fast deployment
```

## Common Tasks

### Check if Your Code Builds
```bash
npm run build
```

### Test the Production Build Locally
```bash
npm run preview
```

### Set Up Commit Template
```bash
git config commit.template .gitmessage
```

This gives you helpful hints when writing commits!

## Project Structure

```
src/
??? components/     # React UI components
??? hooks/          # Custom React hooks
??? utils/          # Helper functions

public/
??? version.js      # Auto-replaced by CI/CD

.github/workflows/
??? release-please.yml  # Creates release PRs
??? deploy.yml          # Deploys on release
```

## Need Help?

- **Versioning**: See [VERSIONING.md](VERSIONING.md)
- **First release**: See [FIRST_RELEASE_CHECKLIST.md](FIRST_RELEASE_CHECKLIST.md)
- **Full docs**: See [README.md](README.md)
- **Issues**: Open an issue on GitHub

## Tips

? **DO**: Use semantic commit messages (`feat:`, `fix:`, etc.)  
? **DO**: Test your changes locally before pushing  
? **DO**: Keep commits focused and atomic  
? **DO**: Review release PRs before merging  
? **DO**: Accumulate related changes into one release  

? **DON'T**: Manually edit version numbers  
? **DON'T**: Use vague commit messages like "update"  
? **DON'T**: Commit broken code to main  
? **DON'T**: Merge release PRs without reviewing  
? **DON'T**: Merge release PRs immediately (let changes accumulate)  

## Release Flow

```
Your commits ? Push to main
    ?
Release Please creates/updates PR
    ?
You review the PR
    ?
You merge when ready
    ?
GitHub Release created
    ?
Deployment triggered
    ?
Live on GitHub Pages! ??
```

**Time from merge to live**: ~2-3 minutes

## Key Difference from Auto-Release Tools

Unlike tools that release immediately:
- ? **You control timing**: Merge PR when ready
- ? **Review first**: See exactly what's releasing
- ? **Combine changes**: Multiple commits in one release
- ? **Edit notes**: Improve changelog before release
- ? **No surprises**: WIP commits won't trigger releases

Happy coding! ??
