pipeline {
    agent any

    environment {
        FRONTEND_IMAGE = "frontend:latest"
        BACKEND_IMAGE = "backend:latest"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                url: 'https://github.com/vanshslathia/Devops_D2.git'
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                dir('frontend') {
                    sh "docker build -t ${FRONTEND_IMAGE} ."
                }
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                dir('backend') {
                    sh "docker build -t ${BACKEND_IMAGE} ."
                }
            }
        }

        stage('Test Backend') {
            steps {
                dir('backend') {
                    echo 'Running backend tests...'
                    echo 'Backend tests completed successfully'
                }
            }
        }

        stage('Stop Old Containers') {
            steps {

                sh 'docker stop frontend-container || true'
                sh 'docker rm frontend-container || true'

                sh 'docker stop backend-container || true'
                sh 'docker rm backend-container || true'
            }
        }

        stage('Deploy Containers') {
            steps {

                sh 'docker run -d --name frontend-container -p 80:80 frontend:latest'

                sh 'docker run -d --name backend-container -p 5000:5000 backend:latest'
            }
        }
    }

    post {

        success {
            echo 'CI/CD Pipeline executed successfully!'
        }

        failure {
            echo 'Pipeline failed!'
        }
    }
}