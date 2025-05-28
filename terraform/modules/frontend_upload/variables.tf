variable "build_id" {
  description = "pnpm build null resource id"
  type        = string
}

variable "user_pool_client_id" {
  description = "User pool client id"
  type        = string
}

variable "cloudfront_distribution_id" {
  description = "Cloudfront distribution id"
  type        = string
}

variable "cloudfront_bucket_name" {
  description = "Cloudfront bucket name"
  type        = string
}

variable "user_pool_domain" {
  description = "User pool domain"
  type        = string
}

variable "service_api_url" {
  description = "Service API URL"
  type        = string
}

variable "local" {
  type        = bool
}

