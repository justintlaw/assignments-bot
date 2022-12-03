data "aws_iam_policy_document" "terraform_assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

resource "aws_iam_instance_profile" "terraform_profile" {
  name = "terraform_ec2_profile"
  role = aws_iam_role.terraform_role.name
}

resource "aws_iam_role_policy" "terraform_policy" {
  name = "terraform_policy"
  role = aws_iam_role.terraform_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "s3:ListBucket"
        Effect   = "Allow"
        Resource = "arn:aws:s3:::terraform-state-ljustint"
      },
      {
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject"
        ],
        Effect = "Allow",
        Resource = "arn:aws:s3:::terraform-state-ljustint/*"
      }
    ]
  })
}

resource "aws_iam_role" "terraform_role" {
  name = "terraform_role"
  path = "/"
  assume_role_policy = data.aws_iam_policy_document.terraform_assume_role_policy.json

  # dangerous, but having for now so I don't have to fine-tune jenkins policies
  managed_policy_arns = ["arn:aws:iam::aws:policy/AdministratorAccess"]
}
