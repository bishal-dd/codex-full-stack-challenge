output "table" {
  value       = aws_dynamodb_table.this
  description = "DynamoDB Table"
}

output "read_table_policy" {
  value       = aws_iam_policy.read
  description = "Policy to read DynamoDB Table"
}

output "write_table_policy" {
  value       = aws_iam_policy.write
  description = "Policy to write DynamoDB Table"
}
