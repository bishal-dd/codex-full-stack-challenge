output "user_pool" {
  value       = aws_cognito_user_pool.this
  description = "Cognito user pool"
}

output "user_pool_domain" {
  value       = aws_cognito_user_pool_domain.main
  description = "Cognito user pool domain"
}

