output "cloudfront_url" {
  value       = module.frontend.cloudfront.domain_name
  description = "URL of the CloudFront distribution"
}
