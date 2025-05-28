# Codex Full Stack Engineer Code Challenge

## Introduction

Verso is an online library that allows users to view and borrow books. The library is managed by admin users who can add and update books from the library.

This is a monolithic codebase including frontend, backend, and infrastructure as code.

## Getting Started

You will need an AWS account to deploy the resources. [Create a free account first if you need to](https://aws.amazon.com/free). All of the resources for this challenge will fall under the free tier.

1. Clone this repository, you can commit directly to this repository
2. Install `pnpm` and `terraform 1.9.2` (you can use tfenv or similar to manage versions)
3. `pnpm i` to install dependencies
4. `pnpm -r build` to build
5. `pnpm -r test` to test
6. [Create an AWS access key in AWS console](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_root-user_manage_add-key.html)
7. Set up your AWS credentials on your machine however you like (e.g. `aws configure` or `export AWS_ACCESS_KEY=my-access-key && export AWS_SECRET_ACCESS_KEY=my-secret-key` or `aws-vault`)
8. `terraform -chdir=terraform/dev init` to initialise terraform
9. `terraform -chdir=terraform/dev apply` to deploy - it is normal for cloudfront to take ~10 mins on first deploy
10. `pnpm --filter @verso/frontend dev` to run the frontend locally
11. Login with `fake@user.com` and password `Password123!`
12. Login with `fake@admin.com` and password `Password123!` for admin
13. Delete the jwt_token local storage key to logout (or use incognito)
14. The frontend uses [shadcn-vue](https://www.shadcn-vue.com) as its component library, if you need more components you can find/install them from there
15. It may take a short while for the AWS managed login to work after deploy

After the interview process, you may want to destroy the resources with `terraform -chdir=terraform/dev destroy`.

## Tasks

It is not expected that you will complete all of the tasks. You should aim to complete as many as you can in the time you have available. I would not expect you to spend more than an hour or two on this challenge.

Depending on the level of experience you have with Vue, terraform, and AWS, you may not know how to complete the features (or even how to set up your environment). This is also fine, just do your best to understand the codebase and the requested features.

1. Each book in the library should store and display a count of the copies available, implement this feature
2. Users that are not admins should not be able to modify books, fix this oversight
3. Implement a feature for admin users to create books from the frontend
4. Implement a feature to allow users to borrow and return books from the library
   - Use the count of copies available
   - A user can only borrow one copy of book at a time (they can borrow multiple unique books)
   - If a user is currently borrowing a book, they should be able to return it

## Tips

1. Good commit hygiene would be a nice touch
2. Frontend is allowed to be ugly, we have good designers to make it look pretty :)
3. Deploying will create an `.env.local` file in frontend which will hook up to the deployed backend, so you can iterate frontend locally
4. Consider both frontend and backend when making changes. You may need to make changes to both to complete a feature.
5. If you do not have time to complete a feature, you can stub it out with a comment and prepare a description of how you would implement it (e.g methods without impl)
6. You may contact me via email at jonathan.schuster@codexconsulting.com.au if you have any questions or need to clear up requirements. No brownie points for asking questions though (I have work to do!), so don't feel like you have to.

## The Interview

1. Share your cloudfront URL
2. Be prepared to discuss your code and the decisions you made
3. Once prompted, share your screen and walk us through your commits
