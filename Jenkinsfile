pipeline {
  agent any
  environment {
    TF_IN_AUTOMATION = 'true'
  }
  stages {
    stage('Init') {
      steps {
        dir('infrastructure/application') {
          sh 'ls'
          sh 'terraform init -no-color'
        }
      }
    }
    stage('Plan') {
      steps {
        dir('infrastructure/application') {
          sh 'terraform plan -no-color -var-file="$BRANCH_NAME.tfvars"'
        }
      }
    }
    stage ('Validate Apply') {
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
      dir('infrastructure/application') {
        sh 'terraform apply -no-color -auto-approve -var-file="$BRANCH_NAME.tfvars"'
      }
    }
    stage ('Build Application') {
      // build application container and push to ecr
      steps {
        dir ('infrastructure/application') {
          script {
            env.AWS_ACCOUNT_ID = terraform output -json account_id
            env.REPO_NAME = terraform output -json application_image_repo_name
          }
        }
        dir('src') {
          sh '''aws ecr get-login-password --region us-west-2 | \\
            docker login \\
            --username AWS \\
            --password-stdin "${AWS_ACCOUNT_ID}.dkr.ecr.us-west-2.amazonaws.com'''
          sh 'docker build -t "$REPO_NAME" .'
          sh 'docker tag "${REPO_NAME}:latest" "${AWS_ACCOUNT_ID}.dkr.ecr.us-west-2.amazonaws.com/${REPO_NAME}:latest"'
          sh 'docker push "${AWS_ACCOUNT_ID}.dkr.ecr.us-west-2.amazonaws.com/${REPO_NAME}:latest"'
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
