variable "region" {
  description = "AWS Region (e.g ap-southeast-2)"
  type        = string
}

variable "stage" {
  description = "Stage identifier (e.g dev, test, prod)"
  type        = string
}

variable "options" {
  type    = map(any)
  default = {}
}

variable "aws_profile" {
  description = "AWS CLI profile to use"
  type        = string
  default     = "codex-challenge"
}
