output "vpc_id" {
  value = aws_vpc.main.id
}

output "main_public_subnet_ids" {
  value = "${aws_subnet.main_public_subnet.*.id}"
}

output "public_sg_id" {
  value = aws_security_group.main_sg.id
}

output "ec2_instance_profile_id" {
  value = aws_iam_instance_profile.terraform_profile.id
}
