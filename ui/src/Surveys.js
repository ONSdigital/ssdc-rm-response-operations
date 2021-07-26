import React, { Component } from "react";
import { Link } from "react-router-dom";

class Surveys extends Component {
  state = {
    surveys: [],
  };

  componentDidMount() {
    this.getSurveys();
  }

  getSurveys = async () => {
    const response = await fetch("/api/surveys");
    const surveys = await response.json();

    this.setState({ surveys: surveys });
  };

  render() {
    const tableRows = this.state.surveys.map((survey) => (
      <tr className="table__row">
        <td className="table__cell">
          <Link to={`/viewSurvey?surveyId=${survey.id}`}>{survey.name}</Link>
        </td>
      </tr>
    ));

    return (
      <>
        {this.props.flashMessageUntil > Date.now() && (
          <div className="panel panel--success">
            <div className="panel__header">
              <p
                id="success"
                data-qa="success-header"
                className="panel__title u-fs-r--b"
              >
                <strong>New survey has been created</strong>
              </p>
            </div>
          </div>
        )}
        <h2>Surveys</h2>
        {this.props.authorisedActivities.includes("CREATE_SURVEY") && (
          <p>
            <Link to="/createsurvey">Create New Survey</Link>
          </p>
        )}
        <table className="table table--row-hover">
          <thead className="table__head">
            <tr className="table__row">
              <th scope="col" className="table__header">
                Survey Name
              </th>
            </tr>
          </thead>

          <tbody className="table__body">{tableRows}</tbody>
        </table>
      </>
    );
  }
}

export default Surveys;
