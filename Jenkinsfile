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
          sh 'terraform plan -no-color -var-file="./prod.tfvars"'
        }
      }
    }
    // stage ('Validate Apply') {
    //   input {
    //     message "Do you want to apply this plan?"
    //     ok "Apply this plan."
    //   }
    //   steps {
    //     echo 'Apply Accepted'
    //   }
    // }
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
  // }
}
