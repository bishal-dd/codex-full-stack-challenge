output "cloudfront" {
  value       = aws_cloudfront_distribution.this
  description = "Cloudfront distribution"
}

output "bucket" {
  value       = aws_s3_bucket.this
  description = "S3 bucket"
}

output "user_pool_client" {
  value       = aws_cognito_user_pool_client.this
  description = "Cognito user pool client"
}
