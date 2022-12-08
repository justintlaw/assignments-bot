variable "vpc_cidr" {
  type    = string
  default = "10.123.0.0/16"
}

// specify personal ip when calling script
// ie. TF_VAR_access_ip=192.0.0.1 terraform apply ...
variable "access_ip" {
  type    = string
}

variable "main_instance_type" {
  type    = string
  default = "t2.micro"
}

variable "main_vol_size" {
  type    = number
  default = 8
}

variable "main_instance_count" {
  type    = number
  default = 1
}

variable "key_name" {
  type = string
}

variable "public_key_path" {
  type = string
}
