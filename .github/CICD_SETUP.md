# GitHub Actions CI/CD Setup

Complete guide for setting up automated workflows for the Infinite Adventure Engine.

## Quick Start

### Required Secrets

Add these secrets in GitHub repository settings (Settings → Secrets → Actions):

| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `FIREBASE_SERVICE_ACCOUNT` | Firebase service account JSON | Firebase Console → Project Settings → Service Accounts → Generate New Private Key |
| `GCP_SERVICE_ACCOUNT_KEY` | Google Cloud service account JSON | GCP Console → IAM & Admin → Service Accounts → Create Key |

### Workflows Overview

1. **CI (Continuous Integration)** - Runs on every push/PR
   - Type checking
   - Build verification
   - Artifact upload

2. **CD (Continuous Deployment)** - Runs on push to `main`
   - Production build
   - Firebase Hosting deployment
   - Automatic live updates

3. **Data Migration** - Manual trigger only
   - Firestore data upload
   - Environment selection
   - Migration verification

4. **Dependency Check** - Weekly schedule
   - Package updates check
   - Security audit
   - Automated reporting

## Setup Steps

### 1. Firebase Service Account

```bash
# In Firebase Console
1. Go to https://console.firebase.google.com
2. Select project: aiengi
3. Project Settings → Service Accounts
4. Click "Generate New Private Key"
5. Download JSON file
6. Copy entire JSON content
7. Add as GitHub secret: FIREBASE_SERVICE_ACCOUNT
```

### 2. Google Cloud Service Account

```bash
# In Google Cloud Console
1. Go to https://console.cloud.google.com
2. Select project: aiengi
3. IAM & Admin → Service Accounts
4. Create Service Account
   - Name: github-actions
   - Role: Cloud Datastore User (or Firestore Admin)
5. Create JSON key
6. Copy entire JSON content
7. Add as GitHub secret: GCP_SERVICE_ACCOUNT_KEY
```

### 3. Enable Workflows

Workflows are automatically enabled when you push the `.github/workflows/` directory to your repository.

### 4. Test Workflows

```bash
# Push to trigger CI
git add .
git commit -m "Add GitHub Actions workflows"
git push origin develop

# Merge to main to trigger deployment
git checkout main
git merge develop
git push origin main
```

## Workflow Details

### CI Workflow
- **File**: `.github/workflows/ci.yml`
- **Runs on**: Push/PR to `main` or `develop`
- **Duration**: ~2-3 minutes
- **Outputs**: Build artifacts

### Deploy Workflow
- **File**: `.github/workflows/deploy.yml`
- **Runs on**: Push to `main`
- **Duration**: ~3-5 minutes
- **Outputs**: Live site URL

### Migration Workflow
- **File**: `.github/workflows/migrate-data.yml`
- **Runs on**: Manual dispatch
- **Duration**: ~1-2 minutes
- **Outputs**: Migration summary

### Dependency Check
- **File**: `.github/workflows/dependency-check.yml`
- **Runs on**: Weekly (Mondays 9 AM UTC)
- **Duration**: ~1 minute
- **Outputs**: Outdated packages, security issues

## Monitoring

### View Workflow Runs
1. Go to repository on GitHub
2. Click **Actions** tab
3. See all workflow runs and their status

### Check Deployment Status
- Green checkmark ✅ = Success
- Red X ❌ = Failed
- Yellow circle 🟡 = In progress

### View Logs
1. Click on any workflow run
2. Click on the job name
3. Expand steps to see detailed logs

## Branch Strategy

```
develop (staging)
    ↓
    PR + Review
    ↓
main (production)
    ↓
    Auto-deploy to Firebase
```

### Recommended Flow
1. Create feature branch from `develop`
2. Make changes and commit
3. Push and create PR to `develop`
4. CI runs automatically
5. After review, merge to `develop`
6. Test in staging
7. Create PR from `develop` to `main`
8. After review, merge to `main`
9. CD deploys to production automatically

## Troubleshooting

### "Workflow not found"
- Ensure `.github/workflows/` directory exists
- Check YAML syntax is valid
- Push workflows to repository

### "Secret not found"
- Verify secret name matches exactly
- Check secret is set in repository settings
- Secrets are case-sensitive

### "Build failed"
- Check error logs in Actions tab
- Run build locally: `npm run build`
- Fix errors and push again

### "Deploy failed"
- Verify Firebase service account secret
- Check Firebase project ID
- Ensure Firebase Hosting is enabled

### "Migration failed"
- Check GCP service account permissions
- Verify Firestore project ID
- Test migration locally first

## Advanced Configuration

### Add Environment Variables

In workflow file:
```yaml
env:
  NODE_ENV: production
  CUSTOM_VAR: value
```

### Add Secrets to Workflow

In workflow file:
```yaml
env:
  API_KEY: ${{ secrets.MY_API_KEY }}
```

### Conditional Steps

```yaml
- name: Deploy to staging
  if: github.ref == 'refs/heads/develop'
  run: npm run deploy:staging
```

### Matrix Builds

```yaml
strategy:
  matrix:
    node-version: [18.x, 20.x]
```

## Security Best Practices

1. **Never commit secrets** to repository
2. **Use GitHub Secrets** for sensitive data
3. **Limit service account permissions** to minimum required
4. **Review workflow runs** regularly
5. **Enable branch protection** on `main`
6. **Require PR reviews** before merging

## Next Steps

1. ✅ Set up required secrets
2. ✅ Push workflows to repository
3. ✅ Test CI on feature branch
4. ✅ Test deployment to staging
5. ✅ Configure branch protection
6. ✅ Run data migration
7. ✅ Monitor first production deployment

## Support

For issues with:
- **GitHub Actions**: Check [GitHub Actions docs](https://docs.github.com/en/actions)
- **Firebase**: Check [Firebase docs](https://firebase.google.com/docs)
- **Firestore**: Check [Firestore docs](https://firebase.google.com/docs/firestore)
