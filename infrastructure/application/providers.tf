terraform {
  backend "s3" {
    bucket                  = "terraform-state-ljustint"
    key                     = "assignments-bot-application"
    region                  = "us-west-2"
    shared_credentials_file = "~/.aws/credentials"
  }
  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
  }
}

provider "aws" {
  region = "us-west-2"
  shared_credentials_files = ["~/.aws/credentials"]
}
