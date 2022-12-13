data "terraform_remote_state" "certs" {
  backend = "s3"
  config = {
    bucket                  = "terraform-state-ljustint"
    key                     = "personal-website"
    region = "us-west-2"
  }
}
