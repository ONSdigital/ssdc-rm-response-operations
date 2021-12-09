import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import Button from "./DesignSytemComponents/Button";
import TextInput from "./DesignSytemComponents/TextInput";
import RadioBtnGroup from "./DesignSytemComponents/RadioBtnGroup";
import RadioBtnItem from "./DesignSytemComponents/RadioBtnItem";

function CreateSurvey() {
  const surveyNameInput = useRef(null);
  const [surveyTypeOptions, setsurveyTypeOptions] = useState([]);
  const [surveyName, setSurveyName] = useState("");
  const [surveyType, setSurveyType] = useState("");

  let history = useHistory();

  useEffect(() => {
    async function fetchSurveyTypes() {
      const response = await fetch("/api/surveys/surveyTypes");

      const surveyTypes = await response.json();

      const options = surveyTypes.map((surveyTypeOption, index) => (
        <div key={index}>
          <RadioBtnItem id={surveyTypeOption} value={surveyTypeOption} name="survey-type">
            {surveyTypeOption}
          </RadioBtnItem>
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

  function handleSurveyTypeChange(event) {
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
        <div className="ons-field">
          <TextInput label="Enter a survey name"
            required value={surveyName}
            onChange={handleSurveyNameChange}
            ref={surveyNameInput} />
        </div>
        <br />

        <RadioBtnGroup legend="Select Survey Type" onChange={handleSurveyTypeChange}>
          {surveyTypeOptions}
        </RadioBtnGroup>

        <p></p>

        <Button type="submit" action>Create Survey</Button>
      </form>
    </>
  );
}

export default CreateSurvey;
