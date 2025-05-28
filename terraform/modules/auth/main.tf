module "label" {
  source     = "../label"
  namespace  = var.namespace
  region     = var.region
  stage      = var.stage
  attributes = ["auth"]
}

resource "aws_cognito_user_pool" "this" {
  name             = module.label.id
  tags             = module.label.tags
  alias_attributes = ["email"]

  schema {
    name                = "admin"
    attribute_data_type = "Boolean"
  }
}

resource "aws_cognito_user" "test_user" {
  count        = var.create_test_user ? 1 : 0
  user_pool_id = aws_cognito_user_pool.this.id
  username     = "c7541bf5-fa41-4c12-87d8-6b307cb699cb"
  password     = "Password123!"

  attributes = {
    email          = "fake@user.com"
    email_verified = true
  }
}

resource "aws_cognito_user" "test_admin" {
  count        = var.create_test_admin ? 1 : 0
  user_pool_id = aws_cognito_user_pool.this.id
  username     = "38727cee-eee2-4e95-83d7-ad7d57d4d14a"
  password     = "Password123!"

  attributes = {
    email          = "fake@admin.com"
    email_verified = true
    admin          = true
  }
}

resource "aws_cognito_user_pool_domain" "main" {
  domain       = lower(replace(aws_cognito_user_pool.this.id, "_", ""))
  user_pool_id = aws_cognito_user_pool.this.id
}
