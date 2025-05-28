module "label" {
  source     = "../label"
  namespace  = var.namespace
  region     = var.region
  stage      = var.stage
  attributes = var.attributes
}

data "aws_iam_policy_document" "this" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "this" {
  name               = module.label.id
  assume_role_policy = data.aws_iam_policy_document.this.json
}

data "archive_file" "this" {
  depends_on  = [var.build_id]
  type        = "zip"
  source_file = "${var.app_dir}/dist/${var.source_file}"
  output_path = ".terraform/tmp/${module.label.id}.zip"
}

resource "aws_lambda_function" "this" {
  # If the file is not in the current working directory you will need to include a
  # path.module in the filename.
  filename      = data.archive_file.this.output_path
  function_name = module.label.id
  tags          = module.label.tags
  role          = aws_iam_role.this.arn
  handler       = "${split(".", reverse(split("/", var.source_file))[0])[0]}.handler"
  memory_size   = var.memory_size

  source_code_hash = data.archive_file.this.output_base64sha256
  environment {
    variables = var.environment_vars
  }

  runtime = "nodejs20.x"
}

data "aws_iam_policy" "lambda_basic_execution" {
  name = "AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "this" {
  role       = aws_iam_role.this.name
  policy_arn = data.aws_iam_policy.lambda_basic_execution.arn
}
