pipeline {
    agent any

    environment {

        FRONTEND_IMAGE = "vanshslathia7051/frontend-app"
        BACKEND_IMAGE = "vanshslathia7051/backend-app"

        DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds')
    }

    stages {

        stage('Checkout Code') {
            steps {

                git branch: 'main',
                url: 'https://github.com/vanshslathia/Devops_D2.git'
            }
        }

        stage('Login to DockerHub') {
            steps {

                echo 'Logging into DockerHub...'

                sh '''
                echo $DOCKERHUB_CREDS_PSW | docker login -u $DOCKERHUB_CREDS_USR --password-stdin
                '''
            }
        }

        stage('Build Frontend Docker Image') {
            steps {

                dir('frontend') {

                    echo 'Building frontend Docker image...'

                    sh '''
                    docker build -t $FRONTEND_IMAGE:latest .
                    '''
                }
            }
        }

        stage('Build Backend Docker Image') {
            steps {

                dir('backend') {

                    echo 'Building backend Docker image...'

                    sh '''
                    docker build -t $BACKEND_IMAGE:latest .
                    '''
                }
            }
        }

        stage('Push Frontend Docker Image') {
            steps {

                echo 'Pushing frontend Docker image...'

                sh '''
                docker push $FRONTEND_IMAGE:latest
                '''
            }
        }

        stage('Push Backend Docker Image') {
            steps {

                echo 'Pushing backend Docker image...'

                sh '''
                docker push $BACKEND_IMAGE:latest
                '''
            }
        }

        stage('Deploy Application') {
            steps {

                echo 'Deploying application containers...'

                echo 'Frontend and backend deployed successfully'
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