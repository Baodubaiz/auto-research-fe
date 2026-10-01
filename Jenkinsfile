pipeline {
  agent {
    label 'docker-node'
  }

  options {
    timestamps()
    disableConcurrentBuilds()
  }

  environment {
    CI = 'true'
    NEXT_TELEMETRY_DISABLED = '1'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Lint') {
      steps {
        sh 'npm run lint'
      }
    }

    stage('Build Check') {
      steps {
        sh 'npm run build'
      }
    }

    stage('Deploy Preview') {
      when {
        not {
          expression {
            return env.BRANCH_NAME in ['main', 'setup_cicd'] ||
              env.GIT_BRANCH in ['origin/main', 'origin/setup_cicd', 'main', 'setup_cicd']
          }
        }
      }
      steps {
        withCredentials([
          string(credentialsId: 'vercel-token', variable: 'VERCEL_TOKEN'),
          string(credentialsId: 'vercel-org-id', variable: 'VERCEL_ORG_ID'),
          string(credentialsId: 'vercel-project-id', variable: 'VERCEL_PROJECT_ID')
        ]) {
          sh '''
            npx vercel pull --yes --environment=preview --token "$VERCEL_TOKEN"
            npx vercel build --token "$VERCEL_TOKEN"
            DEPLOYMENT_URL=$(npx vercel deploy --prebuilt --token "$VERCEL_TOKEN")
            echo "Preview deployment: $DEPLOYMENT_URL"
          '''
        }
      }
    }

    stage('Deploy Production') {
      when {
        expression {
          return env.BRANCH_NAME in ['main', 'setup_cicd'] ||
            env.GIT_BRANCH in ['origin/main', 'origin/setup_cicd', 'main', 'setup_cicd']
        }
      }
      steps {
        withCredentials([
          string(credentialsId: 'vercel-token', variable: 'VERCEL_TOKEN'),
          string(credentialsId: 'vercel-org-id', variable: 'VERCEL_ORG_ID'),
          string(credentialsId: 'vercel-project-id', variable: 'VERCEL_PROJECT_ID')
        ]) {
          sh '''
            npx vercel pull --yes --environment=production --token "$VERCEL_TOKEN"
            npx vercel build --prod --token "$VERCEL_TOKEN"
            DEPLOYMENT_URL=$(npx vercel deploy --prebuilt --prod --token "$VERCEL_TOKEN")
            echo "Production deployment: $DEPLOYMENT_URL"
          '''
        }
      }
    }
  }
}
