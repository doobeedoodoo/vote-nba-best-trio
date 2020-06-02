import React from 'react';
import { API, graphqlOperation } from 'aws-amplify'

import { listCandidates as ListCandidates } from './graphql/queries'
import { updateCandidate as UpdateCandidate } from './graphql/mutations'
import { onUpdateCandidate } from './graphql/subscriptions'

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import CanvasJSReact from './canvasjs.react';

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      candidates: [],
      chartData: {},
      hasVoted: false,
      subscription: {}
    }
  }

  async componentDidMount() {
    try {
      //Using our GraphQL query, retrieve candidates from our database.
      const candidateData = await API.graphql(graphqlOperation(ListCandidates))
      //Set initial values for candidates.
      this.setState({
        candidates: candidateData.data.listCandidates.items
      })
    } catch (err) {
      console.error('Error fetching data.', err)
    }

    this.subscription = API.graphql(graphqlOperation(onUpdateCandidate)
    ).subscribe({
      next: candidateData => {
        const candidate = candidateData.value.data.onUpdateCandidate
        const updatedCandidates = this.state.candidates
        var candidateIndex = this.state.candidates.findIndex(x => x.id === candidate.id)
        updatedCandidates[candidateIndex].votes = candidate.votes

        const updatedChartData = this.state.chartData
        var chartIndex = updatedChartData.data[0].dataPoints.findIndex(x => x.label === candidate.name)
        updatedChartData.data[0].dataPoints[chartIndex].y = candidate.votes

        this.setState({
          candidates: updatedCandidates,
          chartData: updatedChartData
        })
      }
    })

    this.generateChart()
  }

  generateChart() {
    const data = {
      title: {
      },
      data: [{
        type: "column",
        dataPoints: [
          { label: this.state.candidates[0].name, y: this.state.candidates[0].votes, color: "purple" },
          { label: this.state.candidates[1].name, y: this.state.candidates[1].votes, color: "red" },
          { label: this.state.candidates[2].name, y: this.state.candidates[2].votes, color: "black" },
          { label: this.state.candidates[3].name, y: this.state.candidates[3].votes, color: "gray" },
          { label: this.state.candidates[4].name, y: this.state.candidates[4].votes, color: "blue" }
        ]
      }]
    }

    this.setState({ chartData: data })
  }

  //Handle vote clicks.
  async handleClick(candidate, event) {
    this.updateVote(candidate)
  }

  async updateVote(candidate) {
    //Look for candidateIndex of candidate in our current state using the item's ID.
    var candidateIndex = this.state.candidates.findIndex(x => x.id === candidate.id)
    //Retrieve vote count.
    var currentVotes = this.state.candidates[candidateIndex].votes
    //Increment.
    this.state.candidates[candidateIndex].votes = currentVotes + 1

    const updatedChartData = this.state.chartData
    var chartIndex = updatedChartData.data[0].dataPoints.findIndex(x => x.label === candidate.name)
    updatedChartData.data[0].dataPoints[chartIndex].y = currentVotes

    this.setState({
      candidates: this.state.candidates,
      hasVoted: true,
      chartData: updatedChartData
    })

    //Update the database.
    try {
      await API.graphql(graphqlOperation(UpdateCandidate, {
        input: {
          id: candidate.id,
          votes: this.state.candidates[candidateIndex].votes
        }
      }))
    } catch (err) {
      console.log('Error updating item.', err)
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


        <Container fluid="sm">

          <Row>
            <h1>Vote For Your Favorite NBA Trio!</h1>
            <CardDeck>
              {
                this.state.candidates.map((candidate, index) => (
                  <Card style={{ width: '18rem' }} key={index}>
                    {<Card.Img variant="top" src={candidate.image}></Card.Img>}
                    {console.log('image: ', candidate.image)}
                    <Card.Body>
                      <Card.Title>{candidate.name}</Card.Title>
                      <Card.Text>{candidate.description}</Card.Text>
                      {!this.state.hasVoted &&
                        <Button variant="primary" onClick={(e) => this.handleClick(candidate, e)}>VOTE</Button>
                      }
                      {!this.state.hasVoted ||
                        <Card.Text>Votes: <b>{candidate.votes}</b></Card.Text>
                      }
                    </Card.Body>
                  </Card>
                ))
              }
            </CardDeck>

          </Row>

          <br />
          <br />

          {!this.state.hasVoted ||
            <div style={styles.divStyle}>
              <CanvasJSChart options={this.state.chartData}
              /* onRef = {ref => this.chart = ref} */
              />
            </div>
          }


        </Container>

      </>
    )
  }
}

export default App