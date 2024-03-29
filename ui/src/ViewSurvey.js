import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";

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
      {survey && (
        <p data-testid="surveyName">
          <b>Survey name</b>: {survey.name}
        </p>
      )}
    </>
  );
}

ViewSurvey.propTypes = {
  surveyId: PropTypes.string.isRequired,
};

export default ViewSurvey;
