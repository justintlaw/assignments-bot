data "terraform_remote_state" "networking" {
  backend = "s3"
  config = {
    bucket                  = "terraform-state-ljustint"
    key                     = "assignments-bot-networking"
    region                  = "us-west-2"
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

resource "random_id" "main_node_id" {
  byte_length = 2
}

resource "aws_key_pair" "main_auth" {
  key_name   = var.key_name
  public_key = file(var.public_key_path)
}

resource "aws_eip" "jenkins_eip" {
  depends_on = [
    aws_instance.main
  ]

  instance = aws_instance.main.id
  vpc = true

  tags = {
    Name = "Jenkins Public IP"
  }

  # provisioner's are generally discouraged because they aren't part of terraform state
  provisioner "local-exec" {
    command = "printf '\n${self.public_ip}' >> aws_hosts"
  }

  # taint won't work on destroy provisioner
  provisioner "local-exec" {
    when    = destroy
    command = "sed -i '/^[0-9]/d' aws_hosts"
  }
}

resource "aws_instance" "main" {
  instance_type          = var.main_instance_type
  ami                    = data.aws_ami.server_ami.id # key id or name
  key_name               = aws_key_pair.main_auth.id
  iam_instance_profile = data.terraform_remote_state.networking.outputs.ec2_instance_profile_id
  vpc_security_group_ids = [
    data.terraform_remote_state.networking.outputs.public_sg_id,
    data.terraform_remote_state.networking.outputs.jenkins_sg_id
  ]
  subnet_id              = data.terraform_remote_state.networking.outputs.main_public_subnet_ids[0]

  root_block_device {
    volume_size = var.main_vol_size
  }

  tags = {
    Name = "jenkins_main_${random_id.main_node_id.dec}"
  }

  # provisioner's are generally discouraged because they aren't part of terraform state
  provisioner "local-exec" {
    command = "aws ec2 wait instance-status-ok --instance-ids ${self.id} --region us-west-2"
  }
}

resource "null_resource" "jenkins_install" {
  depends_on = [aws_instance.main]

  provisioner "local-exec" {
    command = "ANSIBLE_HOST_KEY_CHECKING=false ansible-playbook -i aws_hosts --key-file /home/justin/.ssh/mtckey ../../playbooks/jenkins.yml"
  }
}

# TODO: Replace ip with elastic ip
output "jenkins_access" {
  value = "${aws_eip.jenkins_eip.public_ip}:8080"
}
