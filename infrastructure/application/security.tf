resource "aws_security_group" "application_sg" {
  name = "application_sg"
  description = "Allow jenkins to connect to application server"
  vpc_id = data.terraform_remote_state.networking.outputs.vpc_id

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_security_group_rule" "ingress_ssh_jenkins" {
  type = "ingress"
  from_port = 22
  to_port = 22
  protocol = "tcp"
  source_security_group_id = data.terraform_remote_state.networking.outputs.public_sg_id
  security_group_id = aws_security_group.application_sg.id
}