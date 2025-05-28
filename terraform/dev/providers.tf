provider "aws" {
  region  = var.region
  profile = var.aws_profile

  default_tags {
    tags = {
      Namespace = "vrso"
      Region    = local.short_region
      Stage     = var.stage
    }
  }
}
