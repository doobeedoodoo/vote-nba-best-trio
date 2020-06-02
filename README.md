# Creating A React Web Application from Scratch and Deploying It in Cloud

![Alt text](/images/00-header.PNG)

This guide demonstrates how to deploy a React web application in the Cloud. It uses GraphQL for its API and is managed by AWS AppSync. Finally, it is deployed to the cloud using AWS Amplify.

This application lets users vote for their NBA best trio and provides real-time updates to the user.

Here's a screenshot of the application:

![Alt text](/images/000-product.PNG)

## Steps

Overall, here are the steps:
1. Set up the environment
2. Install, configure, and initialize AWS Amplify
3. Create the backend using GraphQL and AppSync.
4. Create the frontend using React JS.
5. Connect the frontend and backend.
6. Deploy the application in cloud.

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

Choose `votenbabesttrio` and click on Schema. We notice that Amplify generated a set of Queries and Mutations for us.

Now, go to Queries and run let's try running a query that will list all candidates:

![Alt text](/images/018-list-query.PNG)

## Populating our Database

Amplify automatically provisioned a DyanamoDB for us (cool!). To populate it, let's run the following query in AppSync:

```
mutation createCandidates {
  candidate1: createCandidate(input: {name: "Jordan Pippen Rodman", votes: 0, description: "Chicago Bulls"}) {
    id votes name description
  }
  candidate2: createCandidate(input: {name: "Duncan Ginobili Parker", votes: 0, description: "San Antonio Spurs"}) {
    id votes name description
  }
  candidate3: createCandidate(input: {name: "James Wade Bosh", votes: 0, description: "Miami Heat"}) {
    id votes name description
  }
  candidate4: createCandidate(input: {name: "Bryant O'Neal Horry", votes: 0, description: "Los Angeles Lakers"}) {
    id votes name description
  }
  candidate5: createCandidate(input: {name: "Curry Thompson Green", votes: 0, description: "Golden State Warriors"}) {
    id votes name description
  }
}
```

Go to Data Sources, and you can see that Amplify has created a table for us:

![Alt text](/images/019-data-sources.PNG)

Go to the table and we can see the items there:

![Alt text](/images/020-dynamodb.PNG)

## Creating Our Frontend and Connecting It With Our Backend

Let's use React Bootstrap to generate our frontend components:

```
npm install react-bootstrap bootstrap
```
Here's a snippet from App.js that calls our backend API from our frontend:
```js
import { API, graphqlOperation } from 'aws-amplify'
import { listCandidates as ListCandidates } from './graphql/queries'
import { updateCandidate as UpdateCandidate } from './graphql/mutations'
import { onUpdateCandidate } from './graphql/subscriptions'

class App extends React.Component {
...
  async componentDidMount() {
    try {
      const candidateData = await API.graphql(graphqlOperation(ListCandidates))
      this.setState({
        candidates: candidateData.data.listCandidates.items
      })
    ...
    }

    this.subscription = API.graphql(graphqlOperation(onUpdateCandidate)
    ).subscribe({
      next: candidateData => {
        const candidate = candidateData.value.data.onUpdateCandidate
        const updatedCandidates = this.state.candidates
        ...
        const updatedChartData = this.state.chartData
        var chartIndex = updatedChartData.data[0].dataPoints.findIndex(x => x.label === candidate.name)
        updatedChartData.data[0].dataPoints[chartIndex].y = candidate.votes
        ...
        this.setState({
          candidates: updatedCandidates,
          chartData: updatedChartData
        })
      }
    })

    this.generateChart()
  }
  
  async updateVote(candidate) {
    ...
    this.state.candidates[candidateIndex].votes = currentVotes + 1
    ...
    updatedChartData.data[0].dataPoints[chartIndex].y = currentVotes
    ...
    this.setState({
      candidates: this.state.candidates,
      chartData: updatedChartData
    })

    try {
      await API.graphql(graphqlOperation(UpdateCandidate, {
        input: {
          id: candidate.id,
          votes: this.state.candidates[candidateIndex].votes
        }
      }))
      ...
    }
  }
  
    render() {

    const styles = {
      divStyle: {
        width: "600px"
      }
    }

    return (
      <>
        </* JSX code goes here */
      </>
    )
  }
}

export default App
```
App.js is the heart and soul of our frontend app. Check out the whole file in this repo.

To test locally, run:
```
npm start
```

## Deploying our Application via AWS Amplify

Go to AWS Amplify and we can see our application:

![Alt text](/images/021-amplify-deploy.PNG)

Our project is hosted in GitHub so we will choose that:

![Alt text](/images/022-amplify-deploy-2.PNG)

We authorize AWS to access our GitHub account and choose the correct repository and branch:

![Alt text](/images/023-amplify-deploy-3.PNG)

Next, we configure our build settings:

![Alt text](/images/024-amplify-deploy-build-settings.PNG)

Finally, click on "Save and Deploy" a.k.a. Fire away!

![Alt text](/images/025-amplify-deploy-save.PNG)

AWS Amplify will now build and deploy our project.

![Alt text](/images/026-amplify-deploy.PNG)

After the build has finished, visit the link to visit our web application. :)

![Alt text](/images/000-product.PNG)

## Ramping Down Our Deployment

To remove our provisioned resources, just execute:
```
amplify delete
```

## Questions?

Let's keep in touch!
