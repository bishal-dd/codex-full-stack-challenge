output "role" {
  value       = aws_iam_role.this
  description = "Lambda execution role"
}

output "function" {
  value       = aws_lambda_function.this
  description = "Lambda function"
}
