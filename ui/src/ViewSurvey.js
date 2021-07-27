import React, { useState, useEffect } from "react";

function ViewSurvey(props) {
  const [survey, setSurvey] = useState();

  async function fetchData() {
    const response = await fetch(`/api/surveys/${props.surveyId}`);
    setSurvey(await response.json());
  }

  useEffect(() => {
    fetchData();
  }, [props.surveyId, survey]);

  return (
    <>
      <h2>View Survey</h2>
      {survey && (
        <p data-testid="surveyName">
          <b>Survey name</b>: {survey.name}
        </p>
      )}
    </>
  );
}

export default ViewSurvey;
