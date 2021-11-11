import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import Announcer from "react-a11y-announcer";
import { Helmet } from "react-helmet";

function CreateSurvey() {
  let surveyNameInput = null;
  const [surveyTypeOptions, setsurveyTypeOptions] =
    useState([]);
  const [surveyName, setSurveyName] = useState("");
  const [surveyType, setSurveyType] = useState("");
  const surveyTypeInput = useRef(null);
  // const [hasErrors, setHasErrors] = useState(false);
  // const [errorSummary, setErrorSummary] = useState([]);
  // const [panelErrorsSummary, setPanelErrorsSummary] = useState([]);

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
    surveyNameInput.focus();
  });


  function handleSurveyNameChange(event) {
    setSurveyName(event.target.value);
    // setHasErrors(false);
  }

  function handlesurveyTypeChange(event) {
    setSurveyType(event.target.value);
    // setHasErrors(false);
  }

  let history = useHistory();

  async function createSurvey(event) {
    // TODO: double click protection
    // setHasErrors(false);
    // setErrorSummary([]);
    // setPanelErrorsSummary([]);

    // let formSummaryErrors = validateCreateSurveyForm();

    // if (formSummaryErrors.length === 0) {
    //   formSummaryErrors = await createExportFileTemplateThroughAPI();
    // }

    // const errors = formSummaryErrors.map((formError, index) => (
    //   <li key={index} className="list__item">
    //     <Announcer text={formError.message} />
    //     <a
    //       className="list__link js-inpagelink"
    //       // MUST use href in-page links for accessibility
    //       href={`#${formError.anchorTo}`}
    //     >
    //       {formError.message}
    //     </a>
    //   </li>
    // ));
    // setErrorSummary(errors);

    // if (formSummaryErrors.length) {
    //   setHasErrors(true);
    //   return;
    // }

    event.preventDefault();
    const newSurvey = {
      name: surveyName,
      surveyType: surveyType
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

  function getCreateSurveyErrors() {
    let errors = [];

    if (surveyName.trim().length === 0) {
      errors.push({
        message: "Survey Name cannot be empty",
        anchorTo: surveyNameInput.current.id,
      });
    }

    if (surveyName.trim() !== surveyName) {
      errors.push({
        message: "Survey Name should not have spaces at beginning or end",
        anchorTo: surveyNameInput.current.id,
      });
    }

    // TODO: Check it's unique compared to all the other surveys, will pass them in

    return errors;
  }

  // TODO: Move this to a utils file?
  function makePanelErrors(errorMessages) {
    const errorPanels = errorMessages.map((error, index) => (
      <p id={`error${index}`} key={index} className="panel__error">
        <strong>{error.message}</strong>
      </p>
    ));

    return errorPanels;
  }

  // function validateCreateSurveyForm() {
  //   const createSurveyErrors = getCreateSurveyErrors();

  //   setPanelErrorsSummary(makePanelErrors(createSurveyErrors));

  //   return createSurveyErrors;
  // }

  // const surveyTypeFragment = (
  //   <div className="question u-mt-no">
  //     <fieldset
  //       id="exportFileDestinationInput"
  //       aria-required="true"
  //       aria-label={"Select Survey Type"}
  //       className="fieldset"
  //       ref={surveyTypeInput}
  //       onChange={handlesurveyTypeChange}
  //     >
  //       <legend className="fieldset__legend">
  //         <label className="label venus">Select Survey Type</label>
  //       </legend>
  //       <div className="input-items">
  //         <div className="radios__items">{surveyTypeOptions}</div>
  //       </div>
  //     </fieldset>
  //   </div>
  // );

  // const surveyTypeInputErrorFragment = (
  //   <div
  //     className="panel panel--error panel--no-title u-mb-s"
  //     id="SupplierInputError"
  //   >
  //     <span className="u-vh">Error: </span>
  //     <div className="panel__body">
  //       <p className="panel__error">
  //         <strong>{supplierInputErrorSummary}</strong>
  //       </p>
  //       <div className="field">
  //         <label className="label" htmlFor={exportFileDestinationInput}>
  //           Select export file destination
  //         </label>
  //         <fieldset
  //           id="exportFileDestinationInput"
  //           aria-required="true"
  //           aria-label={"Select export file destination"}
  //           className="fieldset"
  //           ref={exportFileDestinationInput}
  //           onChange={handleExportFileDestinationChange}
  //         >
  //           <div className="input-items">
  //             <div className="radios__items">
  //               {exportFileDestinationOptions}
  //             </div>
  //           </div>
  //         </fieldset>
  //       </div>
  //     </div>
  //   </div>
  // );

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
        <br />
        <div className="question u-mt-no">
          <fieldset
            id="exportFileDestinationInput"
            aria-required="true"
            aria-label={"Select Survey Type"}
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
