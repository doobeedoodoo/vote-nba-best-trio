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
```
amplify configure
````

Login to your AWS Console and follow the instructions in the CLI.

![Alt text](/images/010-create-cli-user.PNG)
![Alt text](/images/011-create-cli-user.PNG)
![Alt text](/images/012-create-cli-user.PNG)
![Alt text](/images/013-create-cli-user.PNG)

## Initializing our Project with Amplify

```
amplify init
```
![Alt text](/images/014-amplify-init.PNG)

Amplify CLI will generate a CloudFormation template that will spin up an S3 bucket and all the necessary roles.

## Connect our React Project with Amplify

Next, we have to configure our React application so it knows it uses Amplify. Add the following lines of codes:
```
import Amplify from 'aws-amplify'
import config from './aws-exports'
Amplify.configure(config)
```

## Creating our Backend - Let's Start Creating APIs!

We'll use GraphQL for our APIs. To know more about GraphQL, check: https://graphql.org/

Let's create our first API:
```
amplify add api
```
![Alt text](/images/015-add-api.PNG)

Update the schema according to our needs:

```
type Candidate @model {
  id: ID!
  name: String!
  description: String
  votes: Int!
}
```
After creating our schema, we can now push to our AWS environment using:
```
amplify push
```
![Alt text](/images/016-push-api.PNG)

