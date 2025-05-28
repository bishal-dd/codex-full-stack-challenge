locals {
  lambdas_dir = "${path.module}/../../../apps/service"
  environment_vars = {
    TABLE_NAME = var.table_name
  }
}

module "label" {
  source     = "../label"
  namespace  = var.namespace
  region     = var.region
  stage      = var.stage
  attributes = ["service"]
}

resource "terraform_data" "build" {
  triggers_replace = {
    apps     = sha1(join("", [for f in fileset(local.lambdas_dir, "src/**/*") : filesha1("${local.lambdas_dir}/${f}")]))
    build_id = var.build_id
  }

  provisioner "local-exec" {
    command = "pnpm --filter @verso/service build"
  }
}

module "books_book_id_post" {
  source            = "../lambda_route"
  namespace         = var.namespace
  region            = var.region
  stage             = var.stage
  module_name       = "service"
  authorizer_id     = aws_apigatewayv2_authorizer.this.id
  api_execution_arn = aws_apigatewayv2_api.this.execution_arn
  api_id            = aws_apigatewayv2_api.this.id
  app_dir           = local.lambdas_dir
  route             = "books/{bookId}"
  http_method       = "POST"
  environment_vars  = local.environment_vars
  build_id          = terraform_data.build.id
}

module "books_book_id_get" {
  source            = "../lambda_route"
  namespace         = var.namespace
  region            = var.region
  stage             = var.stage
  module_name       = "service"
  authorizer_id     = aws_apigatewayv2_authorizer.this.id
  api_execution_arn = aws_apigatewayv2_api.this.execution_arn
  api_id            = aws_apigatewayv2_api.this.id
  app_dir           = local.lambdas_dir
  route             = "books/{bookId}"
  http_method       = "GET"
  environment_vars  = local.environment_vars
  build_id          = terraform_data.build.id
}

module "books_get" {
  source            = "../lambda_route"
  namespace         = var.namespace
  region            = var.region
  stage             = var.stage
  module_name       = "service"
  authorizer_id     = aws_apigatewayv2_authorizer.this.id
  api_execution_arn = aws_apigatewayv2_api.this.execution_arn
  api_id            = aws_apigatewayv2_api.this.id
  app_dir           = local.lambdas_dir
  route             = "books"
  http_method       = "GET"
  environment_vars  = local.environment_vars
  build_id          = terraform_data.build.id
}

module "books_post" {
  source            = "../lambda_route"
  namespace         = var.namespace
  region            = var.region
  stage             = var.stage
  module_name       = "service"
  authorizer_id     = aws_apigatewayv2_authorizer.this.id
  api_execution_arn = aws_apigatewayv2_api.this.execution_arn
  api_id            = aws_apigatewayv2_api.this.id
  app_dir           = local.lambdas_dir
  route             = "books"
  http_method       = "POST"
  environment_vars  = local.environment_vars
  build_id          = terraform_data.build.id
}

resource "aws_iam_role_policy_attachment" "read_table" {
  for_each = toset([
    module.books_book_id_post.role.name,
    module.books_book_id_get.role.name,
    module.books_get.role.name,
    module.books_post.role.name,
  ])

  role       = each.key
  policy_arn = var.read_table_policy_arn
}

resource "aws_iam_role_policy_attachment" "write_table" {
  for_each = toset([
    module.books_book_id_post.role.name,
    module.books_post.role.name,
  ])

  role       = each.key
  policy_arn = var.write_table_policy_arn
}

resource "aws_apigatewayv2_api" "this" {
  name          = module.label.id
  protocol_type = "HTTP"
  cors_configuration {
    allow_methods = ["GET", "POST", "OPTIONS"]
    allow_origins = flatten(["https://${var.cloudfront_domain}", var.local ? ["http://localhost:5173"] : []])
    allow_headers = ["*"]
  }
}

resource "aws_apigatewayv2_stage" "this" {
  api_id      = aws_apigatewayv2_api.this.id
  name        = module.label.id
  auto_deploy = true
}

resource "aws_apigatewayv2_authorizer" "this" {
  api_id           = aws_apigatewayv2_api.this.id
  authorizer_type  = "JWT"
  name             = module.label.id
  identity_sources = ["$request.header.Authorization"]
  jwt_configuration {
    audience = [var.user_pool_client_id]
    issuer   = "https://${var.user_pool_endpoint}"
  }
}
