locals {
  frontend_dir = "${path.module}/../../../apps/frontend"
  vite_environment = {
    NODE_ENV               = "production"
    VITE_COGNITO_DOMAIN    = var.user_pool_domain
    VITE_COGNITO_CLIENT_ID = var.user_pool_client_id
    VITE_AWS_REGION        = data.aws_region.current.name
    VITE_API_URL           = var.service_api_url
  }
}

data "aws_region" "current" {}

resource "terraform_data" "build" {
  triggers_replace = {
    frontend         = sha1(join("", [for f in fileset(local.frontend_dir, "src/**/*") : filesha1("${local.frontend_dir}/${f}")]))
    build_id         = var.build_id
    vite_environment = local.vite_environment
  }

  provisioner "local-exec" {
    command = "pnpm --filter @verso/frontend build"

    environment = local.vite_environment
  }
}

resource "terraform_data" "upload" {
  triggers_replace = {
    build_id = terraform_data.build.id
  }

  provisioner "local-exec" {
    command     = <<EOT
      aws s3 sync dist/ s3://${var.cloudfront_bucket_name} --delete
    EOT
    working_dir = local.frontend_dir
  }
}

resource "terraform_data" "invalidate" {
  triggers_replace = {
    build_id = terraform_data.upload.id
  }

  provisioner "local-exec" {
    command = "aws cloudfront create-invalidation --distribution-id ${var.cloudfront_distribution_id} --paths '/'"
  }
}

resource "terraform_data" "env_file" {
  count = var.local ? 1 : 0

  triggers_replace = {
    vite_environment = local.vite_environment
  }

  provisioner "local-exec" {
    working_dir = local.frontend_dir
    command     = <<EOF
echo "VITE_COGNITO_DOMAIN=${var.user_pool_domain}
VITE_COGNITO_CLIENT_ID=${var.user_pool_client_id}
VITE_AWS_REGION=${data.aws_region.current.name}
VITE_API_URL=${var.service_api_url}" > .env.local
    EOF
  }
}
