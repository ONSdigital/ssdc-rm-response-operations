import React, { useState, useEffect } from "react";

function ViewSurvey(props) {
  const [survey, setSurvey] = useState();
  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/api/surveys/${props.surveyId}`);

      if (response.ok) {
        const survey = await response.json();
        setSurvey(survey);
      }
    }
    fetchData();
  }, [props.surveyId, survey]);

  return (
    <>
      <h2>View Survey</h2>
      {survey && (
        <p>
          <b>Survey name</b>: {survey.name}
        </p>
      )}
    </>
  );
}

export default ViewSurvey;
