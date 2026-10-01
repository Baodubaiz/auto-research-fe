# Frontend CI/CD With Jenkins And Vercel

The frontend is a Next.js app deployed to Vercel from Jenkins.

## Current Model

```text
Jenkins Controller
  - Jenkins UI
  - job configuration
  - credentials

Jenkins Agent
  - label: docker-node
  - runs npm ci, lint, and build checks
  - runs Vercel CLI deploy commands

Vercel
  - hosts preview deployments for non-production branches
  - hosts production deployments for main/setup_cicd
```

The frontend pipeline is defined in `Jenkinsfile`.

## Required Jenkins Credentials

Create these Jenkins credentials as `Secret text`:

```text
vercel-token
vercel-org-id
vercel-project-id
```

How to get the values:

```bash
# 1. Install/login locally if needed
npm i -g vercel
vercel login

# 2. Link this project once from auto-research-fe
vercel link

# 3. Read the generated IDs
cat .vercel/project.json
```

Use:

```json
{
  "orgId": "vercel-org-id value",
  "projectId": "vercel-project-id value"
}
```

Create the deploy token in Vercel:

```text
Vercel Dashboard -> Account Settings -> Tokens -> Create
```

Store the token as `vercel-token`.

Do not commit the `.vercel` directory. Jenkins uses the credential values instead.

## Jenkins Job

Create a Jenkins Pipeline job:

```text
Name: auto-research-fe
Definition: Pipeline script from SCM
SCM: Git
Repository URL: <auto-research-fe repo URL>
Branch Specifier: */setup_cicd
Script Path: Jenkinsfile
```

For production, point the job to:

```text
*/main
```

## Pipeline Stages

The pipeline runs:

```text
Checkout
Install
Lint
Build Check
Deploy Preview
Deploy Production
```

Production deploy runs only for:

```text
main
setup_cicd
origin/main
origin/setup_cicd
```

Other branches are deployed as Vercel preview deployments.

## Vercel Environment Variables

Configure frontend environment variables in Vercel Project Settings:

```text
Project -> Settings -> Environment Variables
```

Use `NEXT_PUBLIC_*` only for values that are safe to expose in the browser, for example:

```text
NEXT_PUBLIC_API_URL=https://api.example.com
```

Server-only secrets should not use the `NEXT_PUBLIC_` prefix.

After changing Vercel environment variables, run the Jenkins job again to create a new deployment with the updated values.

## Notes

- Docker is no longer used for the Vercel deployment path.
- `npm ci` is used instead of `npm install` so Jenkins installs from `package-lock.json` reproducibly.
- Vercel CLI uses `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` in CI to avoid interactive project linking.
- The production command uses `vercel build --prod` and `vercel deploy --prebuilt --prod`.
