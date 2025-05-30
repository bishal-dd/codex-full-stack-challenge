provider "aws" {
  region  = var.region
  default_tags {
    tags = {
      Namespace = "vrso"
      Region    = local.short_region
      Stage     = var.stage
    }
  }
}
