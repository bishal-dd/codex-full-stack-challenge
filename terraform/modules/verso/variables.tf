variable "region" {
  type = string
}

variable "stage" {
  type = string
}

variable "namespace" {
  type = string
  default = "vrso"
}

variable "options" {
  type    = map(any)
  default = {}
}
