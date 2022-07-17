### Anonymail

This project is a simple attempt at generating anonymous, throwaway email addresses in a serverless environment.

The idea is that a user can visit a simple website, and immediately be granted and anonymous email address to
use for receiving potentially spammy emails.

The overall goal was to complete this project fairly fast, and use a combination of serverless technologies
provided by AWS via the [Serverless Stack (SST)](https://sst.dev/) NodeJS framework.

### Notes

* This app ***does not send*** any emails, it only receives them.
* This app does not log, or store your emails in any way.
* Each time the web-interface is loaded, you get a new email address.
* Your emails are only available during a single page refresh.

### Installation

`yarn install`

### Requirements

* A properly configured installation [AWS CLI](https://sst.dev/chapters/configure-the-aws-cli.html)
* NodeJS >= 10.15.1

### AWS Requirements

You only need to go so far as to make sure that your SES is able to receive, and route emails.

* An AWS account with a 'Verified Identity' domain verified with
  [Amazon Simple Email Service (SES)](https://docs.aws.amazon.com/ses/latest/dg/creating-identities.html#verify-domain-procedure) from which to send emails from is required.

If you've already got a domain registered through AWS, then the process is straightforward and a lot of the work gets done for you during the verification process. If not, there
will be some manual steps you'll need to take with your registrar. Please refer to the documentation in the bullet above.

**Note:** The deployment process will create a [Receipt Rule Set](https://docs.aws.amazon.com/ses/latest/dg/receiving-email-concepts.html#receiving-email-concepts-rules) for your
verified domain, however there is currently no way to set it as 'Active' from the CDK; you'll need to manually go to
the [AWS SES Console](https://us-east-1.console.aws.amazon.com/ses/home?region=us-east-1#/email-receiving) and manually activate it.

### Running locally

In order to deploy the development stack you can run `yarn start` from the root directory. To run the web-interface, run `yarn start` from the `frontend` directory.

You'll need to be running both if you want to hack / debug locally.

### Deploying to a production server

`yarn deploy` from the root directory. SST will take care of everything needed to provision the cloud architecture required for the app to run.

### Additional info

There is are a lot of good guides about further configuration of this SST app available on [their guides page](https://sst.dev/guide.html).

From there you can learn how to modify the frontend stack to use your own domain, and other stuff that wouldn't be worth the time reiterating in this readme.




