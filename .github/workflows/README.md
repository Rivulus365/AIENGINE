# GitHub Actions Workflows

This directory contains CI/CD workflows for the Infinite Adventure Engine.

## Workflows

### 🔨 CI - Build and Test (`ci.yml`)
**Trigger**: Push or PR to `main` or `develop` branches

**What it does**:
- Checks out code
- Installs dependencies
- Runs TypeScript type checking
- Builds the production bundle
- Uploads build artifacts

**Status Badge**:
```markdown
![CI](https://github.com/YOUR_USERNAME/AIENGINE/workflows/CI%20-%20Build%20and%20Test/badge.svg)
```

---

### 🚀 CD - Deploy to Firebase Hosting (`deploy.yml`)
**Trigger**: Push to `main` branch or manual dispatch

**What it does**:
- Builds production bundle
- Deploys to Firebase Hosting
- Updates live site automatically

**Required Secrets**:
- `FIREBASE_SERVICE_ACCOUNT` - Firebase service account JSON

**Status Badge**:
```markdown
![Deploy](https://github.com/YOUR_USERNAME/AIENGINE/workflows/CD%20-%20Deploy%20to%20Firebase%20Hosting/badge.svg)
```

---

### 💾 Data Migration (`migrate-data.yml`)
**Trigger**: Manual dispatch only

**What it does**:
- Runs Firestore data migration script
- Uploads all game data to Firestore
- Supports production/staging environments

**Required Secrets**:
- `GCP_SERVICE_ACCOUNT_KEY` - Google Cloud service account JSON

**How to run**:
1. Go to Actions tab in GitHub
2. Select "Data Migration" workflow
3. Click "Run workflow"
4. Choose environment (production/staging)

---

### 📦 Dependency Update Check (`dependency-check.yml`)
**Trigger**: Weekly (Mondays at 9 AM UTC) or manual dispatch

**What it does**:
- Checks for outdated npm packages
- Runs security audit
- Reports findings in workflow summary

**No secrets required**

---

## Setup Instructions

### 1. Firebase Service Account

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project (`aiengi`)
3. Go to Project Settings → Service Accounts
4. Click "Generate New Private Key"
5. Save the JSON file
6. In GitHub: Settings → Secrets → Actions → New repository secret
   - Name: `FIREBASE_SERVICE_ACCOUNT`
   - Value: Paste the entire JSON content

### 2. Google Cloud Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project (`aiengi`)
3. Go to IAM & Admin → Service Accounts
4. Create a service account with Firestore Admin role
5. Create a JSON key
6. In GitHub: Settings → Secrets → Actions → New repository secret
   - Name: `GCP_SERVICE_ACCOUNT_KEY`
   - Value: Paste the entire JSON content

### 3. Enable GitHub Actions

1. Go to your repository Settings
2. Navigate to Actions → General
3. Under "Actions permissions", select "Allow all actions and reusable workflows"
4. Save

### 4. Configure Firebase Hosting (Optional)

If you want to use Firebase Hosting for deployment:

1. Run `firebase init hosting` in your project
2. Select your Firebase project
3. Set public directory to `dist`
4. Configure as single-page app: Yes
5. Don't overwrite index.html
6. Commit the `firebase.json` and `.firebaserc` files

## Workflow Status

Once set up, you can monitor workflow runs:
- **Actions tab**: See all workflow runs
- **Commit status**: Green checkmark or red X on commits
- **PR checks**: Automatic checks on pull requests

## Manual Triggers

Some workflows can be triggered manually:

1. Go to **Actions** tab
2. Select the workflow
3. Click **Run workflow**
4. Choose branch and options
5. Click **Run workflow** button

## Best Practices

### Branch Protection
Recommended rules for `main` branch:
- Require status checks to pass (CI workflow)
- Require pull request reviews
- Require branches to be up to date

### Deployment Strategy
- `develop` branch → Auto-deploy to staging (if configured)
- `main` branch → Auto-deploy to production
- Use PRs for code review before merging to `main`

### Data Migration
- Run manually when game data changes
- Test in staging environment first
- Monitor Firestore console after migration

## Troubleshooting

### CI Fails on Type Check
- Run `npx tsc --noEmit` locally
- Fix TypeScript errors
- Commit and push

### Deploy Fails
- Check Firebase service account secret is set correctly
- Verify Firebase project ID in workflow
- Check Firebase Hosting is enabled

### Migration Fails
- Verify GCP service account has Firestore Admin role
- Check project ID matches
- Ensure service account JSON is valid

## Adding New Workflows

To add a new workflow:

1. Create a new `.yml` file in `.github/workflows/`
2. Define the workflow name and triggers
3. Add jobs and steps
4. Commit and push
5. Check Actions tab to verify

Example:
```yaml
name: My Custom Workflow

on:
  push:
    branches: [ main ]

jobs:
  my-job:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: echo "Hello World"
```
