output "application_endpoint" {
  value = { for i in aws_instance.main[*] : i.tags.Name => "${i.public_ip}:3000" }
}

output "application_image_repo_name" {
  value = aws_ecr_repository.application_image_repo.name
}

output "account_id" {
  value = data.aws_caller_identity.current.account_id
}

output "instance_ips" {
  value = [for i in aws_instance.main[*]: i.public_ip]
}