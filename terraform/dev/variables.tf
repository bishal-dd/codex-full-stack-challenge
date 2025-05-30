variable "region" {
  description = "AWS Region (e.g ap-southeast-2)"
  type        = string
  default     = "ap-southeast-2"
}

variable "stage" {
  description = "Stage identifier (e.g dev, test, prod)"
  type        = string
}

variable "options" {
  type    = map(any)
  default = {}
}