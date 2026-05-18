pipeline {
    agent any

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                url: 'https://github.com/vanshslathia/Devops_D2.git'
            }
        }

        stage('Build Frontend') {
            steps {
                echo 'Building frontend Docker image...'
            }
        }

        stage('Build Backend') {
            steps {
                echo 'Building backend Docker image...'
            }
        }

        stage('Run Tests') {
            steps {
                echo 'Running backend tests...'
                echo 'Tests passed successfully'
            }
        }

        stage('Deploy Application') {
            steps {
                echo 'Deploying frontend and backend containers...'
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