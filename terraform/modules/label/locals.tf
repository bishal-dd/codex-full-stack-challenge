
locals {
  id = join("-", [
    var.namespace,
    var.region,
    var.stage,
    join("-", var.attributes),
  ])

  tags = {
    "Namespace"  = var.namespace
    "Region"     = var.region
    "Stage"      = var.stage
  }
}
