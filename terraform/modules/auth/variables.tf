variable "namespace" {
  type = string
}

variable "region" {
  type = string
}

variable "stage" {
  type = string
}

variable "create_test_user" {
  type = bool
  default = false
}

variable "create_test_admin" {
  type = bool
  default = false
}
