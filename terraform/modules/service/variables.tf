variable "table_name" {
  description = "DynamoDB table name"
  type        = string
}


variable "table_arn" {
  description = "DynamoDB table arn"
  type        = string
}

variable "build_id" {
  description = "pnpm build null resource id"
  type        = string
}

variable "namespace" {
  type = string
}

variable "region" {
  type = string
}

variable "stage" {
  type = string
}

variable "user_pool_endpoint" {
  type = string
}

variable "user_pool_client_id" {
  type = string
}

variable "cloudfront_domain" {
  type = string
}

variable "read_table_policy_arn" {
  type = string
}

variable "write_table_policy_arn" {
  type = string
}

variable "local" {
  type = bool

}
