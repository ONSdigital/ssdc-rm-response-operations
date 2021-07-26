import React, { Component } from "react";

class ViewSurvey extends Component {
  state = {
    survey: [],
  };

  componentDidMount() {
    this.getSurvey();
  }

  getSurvey = async () => {
    const response = await fetch(`/api/surveys/${this.props.surveyId}`);
    const survey = await response.json();

    this.setState({ survey: survey });
  };

  render() {
    return (
      <>
        <h2>View Survey</h2>
        <p>
          <b>Survey name</b>: {this.state.survey.name}
        </p>
      </>
    );
  }
}

export default ViewSurvey;
