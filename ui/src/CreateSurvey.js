import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";

function CreateSurvey() {
  const surveyNameInput = useRef(null);
  const [surveyTypeOptions, setsurveyTypeOptions] = useState([]);
  const [surveyName, setSurveyName] = useState("");
  const [surveyType, setSurveyType] = useState("");
  const surveyTypeInput = useRef(null);

  let history = useHistory();

  useEffect(() => {
    async function fetchSurveyTypes() {
      const response = await fetch("/api/surveys/surveyTypes");

      const surveyTypes = await response.json();

      const options = surveyTypes.map((surveyType, index) => (
        <div key={index}>
          <p className="radios__item">
            <span className="radio">
              <input
                id={surveyType}
                type="radio"
                className="radio__input js-radio"
                value={surveyType}
                name="surveyType"
                required
              />
              <label
                htmlFor={surveyType}
                id={`${surveyType}-label`}
                className="radio__label"
              >
                {surveyType}
              </label>
            </span>
          </p>
          <br />
        </div>
      ));
      setsurveyTypeOptions(options);
    }

    fetchSurveyTypes();
    surveyNameInput.current.focus();
  }, []);

  function handleSurveyNameChange(event) {
    setSurveyName(event.target.value);
  }

  function handlesurveyTypeChange(event) {
    setSurveyType(event.target.value);
  }

  async function createSurvey(event) {
    event.preventDefault();
    const newSurvey = {
      name: surveyName,
      surveyType: surveyType,
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
            ref={surveyNameInput}
          />
        </div>
        <br />
        <div className="question u-mt-no">
          <fieldset
            id="surveyTypeInput"
            aria-required="true"
            aria-label={"Select Survey Type"}
            required
            className="fieldset"
            ref={surveyTypeInput}
            onChange={handlesurveyTypeChange}
          >
            <legend className="fieldset__legend">
              <label className="label venus">Select Survey Type</label>
            </legend>
            <div className="input-items">
              <div className="radios__items">{surveyTypeOptions}</div>
            </div>
          </fieldset>
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
