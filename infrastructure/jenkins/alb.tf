data "aws_acm_certificate" "issued" {
  domain = "jenkins.justincodes.dev"
  statuses = ["ISSUED"]
}

resource "aws_lb" "jenkins_lb" {
  name = "jenkins-lb"
  internal = false
  load_balancer_type = "application"
  security_groups = [aws_security_group.jenkins_web_sg.id]
  subnets = data.terraform_remote_state.networking.outputs.main_public_subnet_ids[*]
}

resource "aws_lb_listener" "https_forward" {
  load_balancer_arn = aws_lb.jenkins_lb.arn
  port = 443
  protocol = "HTTPS"

  default_action {
    type = "forward"
    target_group_arn = aws_lb_target_group.jenkins_target_group.arn
  }

  certificate_arn = data.aws_acm_certificate.issued.arn
}

resource "aws_lb_target_group" "jenkins_target_group" {
  name = "jenkins-target-group"
  port = 80
  protocol = "HTTP"
  vpc_id = data.terraform_remote_state.networking.outputs.vpc_id
  target_type = "instance"

  health_check {
    enabled = true
    # path = "/login"
    path = "/login?from=%2F"
  }
}

resource "aws_lb_target_group_attachment" "lb_attachment" {
  target_group_arn = aws_lb_target_group.jenkins_target_group.arn
  target_id = aws_instance.main.id
  # target_id = aws_eip.jenkins_eip.public_ip
  port = 80
}

# resource "aws_lb_listener_certificate" "lb_cert" {
#   listener_arn = aws_lb_listener.https_forward.arn
#   # certificate_arn = data.aws
#   certificate_arn = data.aws_acm_certificate.issued.arn
#   # certificate_arn = data.terraform_remote_state.certs.outputs.ssl_cert_arn
# }
