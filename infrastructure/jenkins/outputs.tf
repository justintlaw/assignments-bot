output "jenkins_ip" {
  value = aws_eip.jenkins_eip.public_ip
}

output "cloudfront_domain" {
  value = aws_cloudfront_distribution.jenkins_distro.domain_name
}
