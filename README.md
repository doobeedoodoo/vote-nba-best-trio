# vote-nba-best-trio
This application lets users vote for their NBA best trio. This is implemented using React JS, GraphQL and DynamoDB and is deployed using AWS Amplify.

## Setting Up Your Environment

If you have not done it yet, install the NPM installer:

* npm (https://nodejs.org/en/download/)
* Create an AWS account (https://aws.amazon.com/resources/create-account/)

## Creating the React Application
```
npx create-react-app vote-nba-best-trio
cd vote-nba-best-trio
```
## Installing AWS Amplify

Since we are going to use AWS Amplify to manage and deploy our application, let's install it:
```
npm install aws-amplify aws-amplify-react
npm install -g @aws-amplify/cli
```

## Configuring AWS Amplify

We need to configure our AWS Amplify CLI to work with our AWS Account:
`amplify configure`

Login to your AWS Console and follow the instructions in the CLI.

<img src="https://github.com/doobeedoodoo/vote-nba-best-trio/images/010-create-cli-user.PNG" width="48">

![Alt text](/images/010-create-cli-user.PNG)
![Alt text](/images/011-create-cli-user.PNG)
![Alt text](/images/012-create-cli-user.PNG)
![Alt text](/images/013-create-cli-user.PNG)

