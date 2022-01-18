import React, { useState, useEffect } from "react";
import Announcer from "react-a11y-announcer";
import { Helmet } from "react-helmet";
import ExtraPropTypes from 'react-extra-prop-types';

function ViewSurvey(props) {
  const [survey, setSurvey] = useState();

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/api/surveys/${props.surveyId}`);
      setSurvey(await response.json());
    }
    fetchData();
  }, [props.surveyId]);

  return (
    <>
      <Helmet>
        <title>View Survey</title>
      </Helmet>
      <h2>View Survey</h2>
      <Announcer text={"View Survey"} />
      {survey && (
        <p data-testid="surveyName">
          <b>Survey name</b>: {survey.name}
        </p>
      )}
    </>
  );
}

ViewSurvey.propTypes = {
  surveyId: ExtraPropTypes.uuid.isRequired
}

export default ViewSurvey;
