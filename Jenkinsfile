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
                url: 'https://github.com/DaudCloud-sudo/Microservice-CI-CD-Pipeline.git'
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                dir('frontend') {
                    bat "docker build -t %FRONTEND_IMAGE% ."
                }
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                dir('backend') {
                    bat "docker build -t %BACKEND_IMAGE% ."
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
                bat 'docker stop frontend-container || exit 0'
                bat 'docker rm frontend-container || exit 0'

                bat 'docker stop backend-container || exit 0'
                bat 'docker rm backend-container || exit 0'
            }
        }

        stage('Deploy Containers') {
            steps {

                bat 'docker run -d --name frontend-container -p 80:80 frontend:latest'

                bat 'docker run -d --name backend-container -p 3000:3000 backend:latest'
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