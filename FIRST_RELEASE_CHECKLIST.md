# First Release Checklist (Release Please)

Follow this checklist to create your first Release Please release.

## ?? Pre-Release Verification

- [ ] All files are committed
- [ ] Build succeeds: `npm run build`
- [ ] GitHub Actions workflows are updated
- [ ] You've read [VERSIONING.md](VERSIONING.md)

## ?? Optional: Set Up Commit Template

Makes it easier to write semantic commits:

```bash
git config commit.template .gitmessage
```

## ?? Make Your First Semantic Commit

Choose the appropriate commit type based on your changes:

### Recommended for this migration:
```bash
git add .
git commit -m "feat: implement Release Please for version management

- Configure Release Please for PR-based releases
- Update GitHub Actions workflows (release + deploy)
- Add comprehensive documentation (VERSIONING.md, CONTRIBUTING.md)
- Create commit message template for easier compliance
- Version now managed via review PRs with manual control

This improves the release process by giving explicit control over
when releases happen while still automating version calculations
and changelog generation."
```

### Alternative options:

#### For a feature (MINOR bump: 2.6.0 ? 2.7.0):
```bash
git add .
git commit -m "feat: add automated versioning with Release Please"
```

#### For a fix (PATCH bump: 2.6.0 ? 2.6.1):
```bash
git add .
git commit -m "fix: update build configuration"
```

## ?? Push to Main

```bash
git push origin main
```

## ?? Monitor GitHub Actions

1. Go to: https://github.com/FTC-24180/Autofig/actions
2. Watch the "Release Please" workflow run
3. Look for successful completion (? green checkmark)

## ?? Find the Release PR

1. Go to: https://github.com/FTC-24180/Autofig/pulls
2. Look for a PR titled: **"chore(main): release X.X.X"**
3. Open the PR to review it

## ?? Review the Release PR

The PR will contain:

### Files Changed:
- **`package.json`** - Version updated
- **`package-lock.json`** - Version updated  
- **`CHANGELOG.md`** - New release entry added

### Check:
- [ ] Version bump is correct (2.6.0 ? 2.7.0 for feat)
- [ ] CHANGELOG.md includes all your commits
- [ ] Release notes look accurate

### Optional Edits:
You can edit the PR before merging:

1. **Check out the release branch**:
   ```bash
   git fetch origin
   git checkout release-please--branches--main
   ```

2. **Make edits** (e.g., to CHANGELOG.md):
   ```bash
   # Edit CHANGELOG.md with better descriptions
   git add CHANGELOG.md
   git commit -m "docs: improve changelog descriptions"
   git push origin release-please--branches--main
   ```

3. **Return to main**:
   ```bash
   git checkout main
   ```

## ?? Merge the Release PR

When you're ready to release:

1. Click **"Merge pull request"** on the PR
2. Confirm the merge

## ?? Watch the Deployment

### Automatic Actions After Merge:

1. **GitHub Release created**:
   - Go to: https://github.com/FTC-24180/Autofig/releases
   - You should see a new release (e.g., `v2.7.0`)
   - Release notes are auto-generated from commits

2. **Git tag created**:
   - Check: `git fetch --tags && git tag -l`
   - You'll see: `v2.7.0`

3. **Deployment workflow triggered**:
   - Go to: https://github.com/FTC-24180/Autofig/actions
   - Watch the "Deploy to GitHub Pages" workflow
   - Takes ~2-3 minutes

## ?? Verify the Deployment

### Pull Latest Changes

```bash
git pull origin main
```

Check that:
- [ ] `package.json` version updated
- [ ] `CHANGELOG.md` has new entry
- [ ] Git tag exists: `git tag -l`

### Check GitHub Release

1. Go to: https://github.com/FTC-24180/Autofig/releases
2. Verify the release was created
3. Check release notes are correct

### Check Deployed App

1. Visit: https://Autofig.bluebananas.org
2. Open the app
3. Go to: Hamburger Menu (?) ? Help & Info
4. Verify the version shows correctly (e.g., "Version 2.7.0")

## ?? Test the Update Notification

1. Make another semantic commit:
   ```bash
   git commit -m "feat: test update notification system"
   git push origin main
   ```

2. Release Please creates/updates a release PR

3. Review and merge the PR when ready

4. Keep the app open during deployment

5. When deployment finishes, an "Update Available" notification should appear

6. Click "Update Now" to reload with the new version

## ?? Test Accumulating Changes

Try adding multiple commits before releasing:

```bash
# First change
git commit -m "feat: add feature X"
git push
# ? Release Please creates PR for v2.8.0

# Second change (don't merge PR yet!)
git commit -m "feat: add feature Y"
git push
# ? PR updated to include both features

# Third change
git commit -m "fix: resolve bug Z"
git push
# ? PR still at v2.8.0 (features trump fixes)

# Now merge the PR
# ? All three changes release together as v2.8.0
```

## ?? Success!

You've successfully implemented Release Please! Now you have:

- ? **Manual control** over when releases happen
- ? **Automated versioning** based on commits
- ? **PR-based reviews** before releasing
- ? **Auto-generated** changelogs and release notes
- ? **Strategic timing** for your releases

## ?? Understanding Release Please

### Key Concepts

**Release PR**: 
- Created/updated automatically by Release Please
- Contains version bump and changelog
- You control when to merge it

**Accumulation**:
- Multiple commits update the same PR
- Only one version bump (the highest priority)
- All changes release together when you merge

**Version Priority**:
- `feat!` or `BREAKING CHANGE` ? Major (3.0.0)
- `feat` ? Minor (2.7.0)
- `fix` or `perf` ? Patch (2.6.1)

## ?? Next Steps

- Share [CONTRIBUTING.md](CONTRIBUTING.md) with your team
- Review [VERSIONING.md](VERSIONING.md) for detailed usage
- Set up branch protection rules (optional)
- Configure PR templates (optional)

## ? Troubleshooting

### Release PR not created

**Possible causes:**
- No semantic commits (`feat:`, `fix:`) since last release
- Release Please workflow didn't run
- GitHub Actions permissions issue

**Solution:**
- Make a commit with `feat:` or `fix:`
- Check GitHub Actions logs
- Verify workflow file permissions

### Wrong version bump in PR

**Solution:**
- Edit `package.json` directly in the release PR branch
- Or close the PR and make correcting commits

### Want to skip this release

**Solution:**
- Simply close the release PR without merging
- Future commits will create a new PR with a new version

### Deployment didn't trigger after merge

**Possible causes:**
- Deploy workflow not configured for releases
- GitHub Release not created properly

**Solution:**
- Check `.github/workflows/deploy.yml` has `on: release:`
- Manually trigger deployment: Actions ? Deploy ? Run workflow
- Check GitHub Actions logs for errors

---

**Need more help?** See [VERSIONING.md](VERSIONING.md) or create a GitHub issue.
