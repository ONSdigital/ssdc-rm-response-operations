import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";

function CreateSurvey() {
  let surveyNameInput = null;

  useEffect(() => {
    surveyNameInput.focus();
  });

  const [surveyName, setSurveyName] = useState("");

  function handleSurveyNameChange(event) {
    setSurveyName(event.target.value);
  }

  let history = useHistory();

  async function createSurvey(event) {
    event.preventDefault();
    const newSurvey = {
      name: surveyName,
    };

    const response = await fetch("/api/surveys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSurvey),
    });

    if (response.ok) {
      history.push(`/surveys?flashMessageUntil=${Date.now() + 5000}`);
    }
  }

  return (
    <>
      <Helmet>
        <title>Create Survey</title>
      </Helmet>
      <h2>Create a New Survey</h2>
      <form onSubmit={createSurvey}>
        <div className="field">
          <label className="label venus">Enter a survey name</label>
          <input
            className="input input--text input-type__input"
            type="text"
            aria-label={"Enter a survey name"}
            aria-required="true"
            required
            value={surveyName}
            onChange={handleSurveyNameChange}
            ref={(input) => {
              surveyNameInput = input;
            }}
          />
        </div>

        <p></p>
        <button type="submit" className="btn btn--link">
          <span className="btn__inner">Create Survey</span>
        </button>
      </form>
    </>
  );
}

export default CreateSurvey;
