pipeline {
  agent any
  environment {
    TF_IN_AUTOMATION = 'true'
  }
  stages {
    stage('Init') {
      when {
        branch "main"
      }

      steps {
        dir('infrastructure/application') {
          sh 'ls'
          sh 'terraform init -no-color'
        }
      }
    }
    stage('Plan') {
      when {
        branch "main"
      }
      steps {
        dir('infrastructure/application') {
          sh 'terraform plan -no-color -var-file="$BRANCH_NAME.tfvars"'
        }
      }
    }
    stage ('Validate Apply') {
      when {
        branch "main"
      }
      // when {
      //   beforeInput true
      //   branch "dev"
      // }
      input {
        message "Do you want to apply this plan?"
        ok "Apply this plan."
      }
      steps {
        echo 'Apply Accepted'
      }
    }
    stage ('Apply') {
      when {
        branch "main"
      }

      steps {
        dir('infrastructure/application') {
          sh 'terraform apply -no-color -auto-approve -var-file="$BRANCH_NAME.tfvars"'
        }
      }
    }
    stage ('Build Application') {
      // build application container and push to ecr
      // dir ('infrastructure/application') {
      //   environment {
      //     AWS_ACCOUNT_ID = sh(script: 'terraform output -json account_id', returnStdout: true).trim()
      //     REPO_NAME = sh(script: 'terraform output -json application_image_repo_name', returnStdout: true).trim()
      //   }
      // }

      steps {
        dir ('infrastructure/application') {
          script {
            env.AWS_ACCOUNT_ID = sh(script: 'terraform output -json account_id | jq -r .', returnStdout: true).trim()
            env.REPO_NAME = sh(script: 'terraform output -json application_image_repo_name | jr -r .', returnStdout: true).trim()
          }
        }

        dir('src') {
          sh '''
            aws ecr get-login-password --region us-west-2 | \\
            docker login \\
            --username AWS \\
            --password-stdin "${AWS_ACCOUNT_ID}.dkr.ecr.us-west-2.amazonaws.com"
            docker build -t "$REPO_NAME" .
            docker tag "${REPO_NAME}:latest" "${AWS_ACCOUNT_ID}.dkr.ecr.us-west-2.amazonaws.com/${REPO_NAME}:latest"
            docker push "${AWS_ACCOUNT_ID}.dkr.ecr.us-west-2.amazonaws.com/${REPO_NAME}:latest"'''
        }
      }
    }
    // stage('Ansible') {
    //   steps {
    //     ansiblePlaybook(credentialsId: 'ec2-ssh-key', inventory: 'aws_hosts', playbook: 'playbooks/main-playbook.yml')
    //   }
    // }
    // stage('Apply') {
    //   steps {
    //     dir('infrastructure/application') {
    //       sh 'terraform apply -no-color -auto-approve -var-file="./terraform.prod.tfvars"'
    //     }
    //   }
    // }
    // stage('Ec2 Wait') {
    //   sh 'aws ec2 wait instance-status-ok --region us-west-2'
    // }
  }
  // post {
  //   success {
  //     echo 'Success'
  //   }
  //   failure {
  //     dir('infrastructure/application') {
  //       sh 'terraform destroy -auto-approve'
  //     }
  //   }
  //   aborted {
  //     dir('infrastructure/application') {
  //       sh 'terraform destroy -auto-approve'
  //     }
  //   }
  // }
}
