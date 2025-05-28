resource "aws_apigatewayv2_integration" "this" {
  api_id             = var.api_id
  integration_type   = "AWS_PROXY"
  integration_uri    = module.lambda.function.invoke_arn
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "this" {
  api_id             = var.api_id
  route_key          = "${var.http_method} /${var.route}"
  target             = "integrations/${aws_apigatewayv2_integration.this.id}"
  authorization_type = "JWT"
  authorizer_id      = var.authorizer_id
}

resource "aws_lambda_permission" "this" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = module.lambda.function.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${var.api_execution_arn}/*"
}

module "lambda" {
  source           = "../lambda/"
  namespace        = var.namespace
  region           = var.region
  stage            = var.stage
  attributes       = concat([var.module_name], split("/", replace(replace(var.route, "{", ""), "}", "")), [lower(var.http_method)])
  source_file      = "${replace(replace(var.route, "{", "["), "}", "]")}/${lower(var.http_method)}.cjs"
  environment_vars = var.environment_vars
  app_dir          = var.app_dir
  build_id         = var.build_id
}
