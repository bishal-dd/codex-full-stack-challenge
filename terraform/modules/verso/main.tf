resource "terraform_data" "build" {
  triggers_replace = {
    packages = sha1(join("", [for f in fileset("${path.module}/../../../packages", "*/src/**/*") : filesha1("${path.module}/../../../packages/${f}")]))
  }

  provisioner "local-exec" {
    command = <<EOT
      pnpm i && pnpm --filter "./packages/*" build
    EOT
    working_dir = "${path.module}/../../../"
  }
}

module "persist" {
  source           = "../persist"
  namespace        = var.namespace
  region           = var.region
  stage            = var.stage
  create_test_data = try(var.options["create_test_data"], false)
}

module "frontend" {
  source       = "../frontend"
  namespace    = var.namespace
  region       = var.region
  stage        = var.stage
  user_pool_id = module.auth.user_pool.id
  local        = try(var.options["local"], false)
}

module "frontend_upload" {
  source                     = "../frontend_upload"
  build_id                   = terraform_data.build.id
  user_pool_client_id        = module.frontend.user_pool_client.id
  user_pool_domain           = module.auth.user_pool_domain.domain
  service_api_url            = module.service.service_stage.invoke_url
  cloudfront_bucket_name     = module.frontend.bucket.id
  cloudfront_distribution_id = module.frontend.cloudfront.id
  local                      = try(var.options["local"], false)
}

module "service" {
  source                 = "../service"
  namespace              = var.namespace
  region                 = var.region
  stage                  = var.stage
  table_arn              = module.persist.table.arn
  table_name             = module.persist.table.name
  build_id               = terraform_data.build.id
  user_pool_endpoint     = module.auth.user_pool.endpoint
  user_pool_client_id    = module.frontend.user_pool_client.id
  cloudfront_domain      = module.frontend.cloudfront.domain_name
  write_table_policy_arn = module.persist.write_table_policy.arn
  read_table_policy_arn  = module.persist.read_table_policy.arn
  local                  = try(var.options["local"], false)
}

module "auth" {
  source            = "../auth"
  create_test_user  = try(var.options["create_test_user"], false)
  create_test_admin = try(var.options["create_test_admin"], false)
  namespace         = var.namespace
  region            = var.region
  stage             = var.stage
}
