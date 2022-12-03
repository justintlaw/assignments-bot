# TODO: Replace ip with elastic ip
output "application_endpoint" {
  value = {for i in aws_instance.main[*] : i.tags.Name => "${i.public_ip}:3000"}
}
