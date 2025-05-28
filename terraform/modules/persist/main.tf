module "label" {
  source     = "../label"
  namespace  = var.namespace
  region     = var.region
  stage      = var.stage
  attributes = ["persist"]
}

resource "aws_dynamodb_table" "this" {
  name         = module.label.id
  tags         = module.label.tags
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "PK"
  range_key    = "SK"

  global_secondary_index {
    name            = "GSI1"
    hash_key        = "GSI1PK"
    range_key       = "GSI1SK"
    projection_type = "ALL"
  }

  attribute {
    name = "PK"
    type = "S"
  }

  attribute {
    name = "SK"
    type = "S"
  }

  attribute {
    name = "GSI1PK"
    type = "S"
  }

  attribute {
    name = "GSI1SK"
    type = "S"
  }
}

module "read" {
  source     = "../label"
  namespace  = var.namespace
  region     = var.region
  stage      = var.stage
  attributes = ["persist", "read"]
}

data "aws_iam_policy_document" "read" {
  statement {
    effect    = "Allow"
    actions   = ["dynamodb:GetItem", "dynamodb:Query", "dynamodb:Scan"]
    resources = [aws_dynamodb_table.this.arn, "${aws_dynamodb_table.this.arn}/**"]
  }
}

resource "aws_iam_policy" "read" {
  name        = module.read.id
  tags        = module.read.tags
  description = "Read persist table"
  policy      = data.aws_iam_policy_document.read.json
}

module "write" {
  source     = "../label"
  namespace  = var.namespace
  region     = var.region
  stage      = var.stage
  attributes = ["persist", "write"]
}

data "aws_iam_policy_document" "write" {
  statement {
    effect    = "Allow"
    actions   = ["dynamodb:PutItem", "dynamodb:UpdateItem", "dynamodb:DeleteItem"]
    resources = [aws_dynamodb_table.this.arn]
  }
}

resource "aws_iam_policy" "write" {
  name        = module.write.id
  tags        = module.write.tags
  description = "Write persist table"
  policy      = data.aws_iam_policy_document.write.json
}

resource "aws_dynamodb_table_item" "test_data" {
  for_each = var.create_test_data ? tomap({
    "c653073a-8dbe-4dec-a57a-2729380de249" = {
      title : "1984",
      author : "George Orwell",
      blurb : "The story takes place in an imagined future (the year 1984) when much of the world has fallen victim to totalitarianism, mass surveillance, manipulation of the past and propaganda."
    },
    "58eda25f-b578-436e-81df-6589e560d80e" = {
      title : "The Great Gatsby",
      author : "F. Scott Fitzgerald",
      blurb : "The novel depicts narrator Nick Carraway's interactions with mysteriously wealthy Jay Gatsby, his obsession to reunite with his former lover, Daisy Buchanan and his love of lavish parties at a time when The New York Times noted 'gin was the national drink and sex the national obsession'."
    },
    "f4adbf54-efce-4124-803f-c35a79d4fb4a" = {
      title : "The Catcher in the Rye",
      author : "J.D Salinger",
      blurb : "The novel is set around the 1950s and is narrated by a young man named Holden Caulfield, who while telling the story, makes it clear that he is undergoing treatment in a mental hospital or sanatorium."
    },
    "43171b88-3bb9-46b4-a138-414640152be0" = {
      title : "To Kill a Mockingbird",
      author : "Harper Lee",
      blurb : "The novel deals with racist attitudes, the irrationality of adult attitudes towards race and class in the Deep South of the 1930s, as depicted through the eyes of two children."
    },
    "a0e55aa3-d49c-46c9-b378-d50617e22657" = {
      title : "Ulysses",
      author : "James Joyce",
      blurb : "Ulysses chronicles the peripatetic appointments and encounters of Leopold Bloom in Dublin in the course of an ordinary day, 16 June 1904."
    }
    "dc129bb6-d9a7-4559-a350-3e46d656686d" = {
      title : "Catch-22",
      author : "Joseph Heller",
      blurb : "The novel is set around the 1950s and is narrated by a young man named Holden Caulfield, who while telling the story, makes it clear that he is undergoing treatment in a mental hospital or sanatorium."
    }
  }) : tomap({})

  table_name = aws_dynamodb_table.this.name
  hash_key   = aws_dynamodb_table.this.hash_key
  range_key  = aws_dynamodb_table.this.range_key
  item       = <<ITEM
  {
    "PK": { "S": "B#${each.key}" },
    "SK": { "S": "B#${each.key}" },
    "GSI1PK": { "S": "BOOK" },
    "GSI1SK": { "S": "BOOK" },
    "book": { 
      "M": {
          "bookId": { "S": "${each.key}" },
          "title": { "S": "${each.value.title}" },
          "author": { "S": "${each.value.author}" },
          "blurb": { "S": "${each.value.blurb}" }
      }
    }
  }
  ITEM

}
