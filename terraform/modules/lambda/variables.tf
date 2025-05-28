variable "namespace" {
  type = string
}

variable "region" {
  type = string
}

variable "stage" {
  type = string
}

variable "build_id" {
  description = "pnpm build null resource id"
  type        = string
}

variable "source_file" {
  description = "Source file"
  type        = string
}

variable "environment_vars" {
  description = "Lambda function environment vars"
  type        = map(string)
  default     = {}
}

variable "app_dir" {
  description = "Application directory"
  type        = string
}

variable "memory_size" {
  description = "Function memory size"
  default     = 512
  type        = number
}

variable "attributes" {
  type = list(string)
}
