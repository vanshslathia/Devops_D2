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

                sh '''
                echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin
                '''
            }
        }

        stage('Build Frontend Image') {
            steps {

                dir('frontend') {

                    sh '''
                    docker build -t $FRONTEND_IMAGE:latest .
                    '''
                }
            }
        }

        stage('Build Backend Image') {
            steps {

                dir('backend') {

                    sh '''
                    docker build -t $BACKEND_IMAGE:latest .
                    '''
                }
            }
        }

        stage('Push Frontend Image') {
            steps {

                sh '''
                docker push $FRONTEND_IMAGE:latest
                '''
            }
        }

        stage('Push Backend Image') {
            steps {

                sh '''
                docker push $BACKEND_IMAGE:latest
                '''
            }
        }
    }
}