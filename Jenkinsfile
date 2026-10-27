pipeline {
            agent any

            options {
                            skipDefaultCheckout(true)
                            timestamps()
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

                            stage('Check Node.js') {
                                                steps {
                                                                        sh '''
                                                                                            node --version
                                                                                                                npm --version
                                                                                                                                    node -e "const [major, minor] = process.versions.node.split('.').map(Number); if (!(major > 22 || (major === 22 && minor >= 12) || (major === 20 && minor >= 19))) { console.error('Node.js 20.19+ or 22.12+ is required'); process.exit(1); }"
                                                                                                                                                    '''
                                                }
                            }

                            stage('Frontend') {
                                                steps {
                                                                        dir('front-end') {
                                                                                                    sh 'npm ci'
                                                                                                    sh 'npm run lint'
                                                                                                    sh 'npm run build'
                                                                        }
                                                }
                            }

                            stage('Backend') {
                                                steps {
                                                                        dir('back-end') {
                                                                                                    sh 'npm ci'
                                                                                                    sh "find src -type f -name '*.js' -print0 | xargs -0 -n1 node --check"
                                                                        }
                                                }
                            }
            }
}
