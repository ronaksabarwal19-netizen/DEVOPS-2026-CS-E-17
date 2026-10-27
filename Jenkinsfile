pipeline {
    agent any

    options {
        disableConcurrentBuilds()
        skipDefaultCheckout(true)
    }

    triggers {
        githubPush()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                dir('front-end') {
                    sh 'npm ci'
                }
            }
        }

        stage('Lint') {
            steps {
                dir('front-end') {
                    sh 'npm run lint'
                }
            }
        }

        stage('Build') {
            steps {
                dir('front-end') {
                    sh 'npm run build'
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'front-end/dist/**', allowEmptyArchive: true
        }
        cleanup {
            deleteDir()
        }
    }
}
// shreya