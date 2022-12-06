variable "main_instance_type" {
  type    = string
  default = "t3.small" # ALERT: Not the free tier
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
