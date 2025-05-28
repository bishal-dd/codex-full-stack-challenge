locals {
  short_region = module.aws_utils.region_az_alt_code_maps.to_short[var.region]
}

module "aws_utils" {
  source  = "cloudposse/utils/aws"
  version = "1.4.0"
}

module "verso" {
  source  = "../modules/verso/"
  region  = local.short_region
  stage   = var.stage
  options = var.options
}

