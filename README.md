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

## Let's Test our API

After the CloudFormation has finished provisioning the resources, let's head over to the AWS Console and go to AppSync. We should be able to see our newly created API:

![Alt text](/images/017-aws-appsync.PNG)

Choose `votenbabesttrio` and click on Schema. We notice that Amplify generated a set of Queries and Mutations for us:

```
type Candidate {
	id: ID!
	name: String!
	description: String
	votes: Int!
	createdAt: AWSDateTime!
	updatedAt: AWSDateTime!
}

input CreateCandidateInput {
	id: ID
	name: String!
	description: String
	votes: Int!
}

input DeleteCandidateInput {
	id: ID
}

enum ModelAttributeTypes {
	binary
	binarySet
	bool
	list
	map
	number
	numberSet
	string
	stringSet
	_null
}

input ModelBooleanInput {
	ne: Boolean
	eq: Boolean
	attributeExists: Boolean
	attributeType: ModelAttributeTypes
}

input ModelCandidateConditionInput {
	name: ModelStringInput
	description: ModelStringInput
	votes: ModelIntInput
	and: [ModelCandidateConditionInput]
	or: [ModelCandidateConditionInput]
	not: ModelCandidateConditionInput
}

type ModelCandidateConnection {
	items: [Candidate]
	nextToken: String
}

input ModelCandidateFilterInput {
	id: ModelIDInput
	name: ModelStringInput
	description: ModelStringInput
	votes: ModelIntInput
	and: [ModelCandidateFilterInput]
	or: [ModelCandidateFilterInput]
	not: ModelCandidateFilterInput
}

input ModelFloatInput {
	ne: Float
	eq: Float
	le: Float
	lt: Float
	ge: Float
	gt: Float
	between: [Float]
	attributeExists: Boolean
	attributeType: ModelAttributeTypes
}

input ModelIDInput {
	ne: ID
	eq: ID
	le: ID
	lt: ID
	ge: ID
	gt: ID
	contains: ID
	notContains: ID
	between: [ID]
	beginsWith: ID
	attributeExists: Boolean
	attributeType: ModelAttributeTypes
	size: ModelSizeInput
}

input ModelIntInput {
	ne: Int
	eq: Int
	le: Int
	lt: Int
	ge: Int
	gt: Int
	between: [Int]
	attributeExists: Boolean
	attributeType: ModelAttributeTypes
}

input ModelSizeInput {
	ne: Int
	eq: Int
	le: Int
	lt: Int
	ge: Int
	gt: Int
	between: [Int]
}

enum ModelSortDirection {
	ASC
	DESC
}

input ModelStringInput {
	ne: String
	eq: String
	le: String
	lt: String
	ge: String
	gt: String
	contains: String
	notContains: String
	between: [String]
	beginsWith: String
	attributeExists: Boolean
	attributeType: ModelAttributeTypes
	size: ModelSizeInput
}

type Mutation {
	createCandidate(input: CreateCandidateInput!, condition: ModelCandidateConditionInput): Candidate
	updateCandidate(input: UpdateCandidateInput!, condition: ModelCandidateConditionInput): Candidate
	deleteCandidate(input: DeleteCandidateInput!, condition: ModelCandidateConditionInput): Candidate
}

type Query {
	getCandidate(id: ID!): Candidate
	listCandidates(filter: ModelCandidateFilterInput, limit: Int, nextToken: String): ModelCandidateConnection
}

type Subscription {
	onCreateCandidate: Candidate
		@aws_subscribe(mutations: ["createCandidate"])
	onUpdateCandidate: Candidate
		@aws_subscribe(mutations: ["updateCandidate"])
	onDeleteCandidate: Candidate
		@aws_subscribe(mutations: ["deleteCandidate"])
}

input UpdateCandidateInput {
	id: ID!
	name: String
	description: String
	votes: Int
}
```
Go to Queries and run let's try running a query that will list all candidates:

![Alt text](/images/018-list-query.PNG)
