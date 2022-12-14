data "aws_availability_zones" "available" {}

locals {
  azs = data.aws_availability_zones.available.names
}

resource "random_id" "random" {
  byte_length = 2
}

resource "aws_vpc" "main" {
  cidr_block = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support = true

  tags = {
    Name = "main_vpc_${random_id.random.dec}"
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_internet_gateway" "main_internet_gateway" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "main_igw_${random_id.random.dec}"
  }
}

resource "aws_route_table" "main_public_rt" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "main_public"
  }
}

resource "aws_route" "default_route" {
  route_table_id = aws_route_table.main_public_rt.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id = aws_internet_gateway.main_internet_gateway.id
}

resource "aws_default_route_table" "main_private_rt" {
  default_route_table_id = aws_vpc.main.default_route_table_id

  tags = {
    Name = "main_private"
  }
}

resource "aws_subnet" "main_public_subnet" {
  count = length(local.azs)
  vpc_id = aws_vpc.main.id
  cidr_block = cidrsubnet(var.vpc_cidr, 8, count.index)
  map_public_ip_on_launch = true
  availability_zone = local.azs[count.index]

  tags = {
    Name = "main_public_${count.index + 1}"
  }
}

resource "aws_subnet" "main_private_subnet" {
  count  = length(local.azs)
  vpc_id = aws_vpc.main.id
  cidr_block              = cidrsubnet(var.vpc_cidr, 8, length(local.azs) + count.index)
  map_public_ip_on_launch = false
  availability_zone       = local.azs[count.index]

  tags = {
    Name = "main_private_${count.index + 1}"
  }
}

resource "aws_route_table_association" "main_public_assoc" {
  count          = length(local.azs)
  subnet_id      = aws_subnet.main_public_subnet[count.index].id
  route_table_id = aws_route_table.main_public_rt.id
}

resource "aws_security_group" "main_sg" {
  name        = "public_sg"
  description = "Security group for public instances"
  vpc_id      = aws_vpc.main.id
}

resource "aws_security_group" "jenkins_sg" {
  name = "jenkins_sg"
  description = "Security group for jenkins"
  vpc_id = aws_vpc.main.id

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_security_group_rule" "ingress_all" {
  type              = "ingress"
  from_port         = 0
  to_port           = 65535
  protocol          = "-1"
  cidr_blocks       = [var.access_ip]
  security_group_id = aws_security_group.main_sg.id
}

resource "aws_security_group_rule" "egress_all" {
  type              = "egress"
  from_port         = 0
  to_port           = 65535
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.main_sg.id
}

resource "aws_security_group_rule" "ingress_jenkins" {
  type = "ingress"
  from_port = 8080
  to_port = 8080
  protocol = "tcp"
  cidr_blocks = ["0.0.0.0/0"]
  security_group_id = aws_security_group.jenkins_sg.id
}
