terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.64.0"
    }

    null = {
      source  = "hashicorp/null"
      version = "~> 3.2.2"
    }

    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.7.0"
    }
  }

  required_version = "~> 1.9.5"
}
