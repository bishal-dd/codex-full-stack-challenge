# terraform {
#   backend "s3" {
#     bucket         = "jp-apse2-dev-tfstate"
#     key            = "jb-apse2-dev-tfstate"
#     region         = "ap-southeast-2"
#     dynamodb_table = "jp-apse2-dev-tfstate"
#   }
# }

terraform {
  backend "local" {}
}

