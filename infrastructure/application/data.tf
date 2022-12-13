data "terraform_remote_state" "networking" {
  backend = "s3"
  config = {
    bucket                  = "terraform-state-ljustint"
    key                     = "assignments-bot-networking"
    region = "us-west-2"
  }
}

data "terraform_remote_state" "jenkins" {
  backend = "s3"
  config = {
    bucket = "terraform-state-ljustint"
    key    = "assignments-bot-jenkins"
    region = "us-west-2"
  }  
}

data "aws_ami" "server_ami" {
  most_recent = true

  owners = ["099720109477"]

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"]
  }
}

# Retrieve the AWS identity of the process that started the script
# Useful for grabbing information such as account id, etc.
data "aws_caller_identity" "current" {}