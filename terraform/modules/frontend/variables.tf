variable "namespace" {
  type = string
}

variable "region" {
  type = string
}

variable "stage" {
  type = string
}

variable "user_pool_id" {
  description = "User pool id"
  type        = string
}

variable "local" {
  type = bool
}
