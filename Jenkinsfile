pipeline {
   agent any
    stages {
        stage('Clone step') {
            steps {
                git credentialsId: 'git', url: 'git@github.com:Pioneer-Nexus/talkspace-backend.git'
                echo '---------------- Cloning ----------------'
                git url: 'https://github.com/Pioneer-Nexus/talkspace-backend.git', branch: 'main'
            }
        }
        stage('Run Unit Tests') {
            steps {
                sh 'npm run test'
            }
        }

        stage('Publish Test Results') {
            steps {
                junit 'test-results/junit.xml'
            }
        }

        post {
        always {
            archiveArtifacts artifacts: 'test-results/junit.xml', allowEmptyArchive: true
        }
        success {
            echo 'Tests passed!'
        }
        failure {
            echo 'Tests failed!'
        }
    }
    }
}