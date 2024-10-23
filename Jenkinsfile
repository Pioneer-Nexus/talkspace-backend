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
    }
}