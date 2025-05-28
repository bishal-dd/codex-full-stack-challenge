variable "namespace" {
  type = string
}

variable "region" {
  type = string
}

variable "stage" {
  type = string
}

variable "module_name" {
  type = string
}

variable "api_id" {
  type = string
}

variable "authorizer_id" {
  type = string
}

variable "api_execution_arn" {
  type = string
}

variable "route" {
  type = string
}

variable "http_method" {
  type = string
}

variable "environment_vars" {
  type = map(string)
}

variable "app_dir" {
  description = "Application directory"
  type        = string
}

variable "build_id" {
  type = string
}
