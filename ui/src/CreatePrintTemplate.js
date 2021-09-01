import React, {useEffect, useRef, useState} from "react";
import {useHistory} from "react-router-dom";
import Announcer from "react-a11y-announcer";

function CreatePrintTemplate() {
  const [printSupplier, setPrintSupplier] = useState("");
  const [packCode, setPackCode] = useState("");
  const [printTemplate, setPrintTemplate] = useState("");
  const [printSupplierOptions, setPrintSupplierOptions] = useState([]);
  const [validationFailureMessages, setValidationFailureMessages] = useState([]);

  const printSupplierInput = useRef(null);
  const printPackCodeInput = useRef(null);
  const printTemplateInput = useRef(null);
  const errorSummaryTitle = useRef(null);

  let history = useHistory();

  useEffect(() => {
    async function fetchData() {
      // TODO: Uncomment API call!
      // const response = await fetch("/api/printsuppliers");
      // const printSuppliers = await response.json();

      const printSuppliers = ['SUPPLIER_A', 'SUPPLIER_B']

      // TODO: Add <Announcer> for each supplier?
      const options = printSuppliers.map((supplier, index) => (
          <div>
            <p key={index} className="radios__item">
          <span className="radio">
            <input
                id={supplier}
                type="radio"
                className="radio__input js-radio"
                value={supplier}
                name="supplier"
                required
            />
            <label
                htmlFor={supplier}
                id={`${supplier}-label`}
                className="radio__label">
              {supplier}
            </label>
          </span>
            </p>
            <br/>
          </div>
      ));
      setPrintSupplierOptions(options);
    }

    fetchData();
    printSupplierInput.current.focus();
  }, []);


  // useEffect(() => {
  //   if (validationFailureMessages.length) {
  //     document.title = "Error"
  //     errorSummaryTitle.current.focus();
  //   }
  // },[validationFailureMessages.length]);

  function handlePrintSupplierChange(event) {
    setPrintSupplier(event.target.value);
  }

  function handlePackCodeChange(event) {
    setPackCode(event.target.value);
  }

  function handleTemplateChange(event) {
    setPrintTemplate(event.target.value);
  }

  function validatePrintTemplate() {
    const inputFailureMessages = {
      templateArrayFormat: "Print template must be JSON array with one or more elements",
      templateInvalidJson: "Print template is not valid JSON",
    }

    setValidationFailureMessages([]);

    let errors = [];

    try {
      const parsedJson = JSON.parse(printTemplate);
      if (!Array.isArray(parsedJson) || parsedJson.length === 0) {
        errors.push({
          message: inputFailureMessages.templateArrayFormat,
          anchorTo: printTemplateInput.current.id
        })
      }
    } catch (err) {
      errors.push({
        message: inputFailureMessages.templateInvalidJson,
        anchorTo: printTemplateInput.current.id
      })
    }

    return errors;
  }

  async function createPrintTemplate() {
    const newPrintTemplate = {
      packCode: packCode,
      printSupplier: printSupplier,
      template: JSON.parse(printTemplate),
    };

    const response = await fetch("/api/printtemplates", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(newPrintTemplate),
    });

    if (response.ok) {
      history.push(`/printtemplates?flashMessageUntil=${Date.now() + 5000}`);
    }
  }

  async function validateAndCreatePrintTemplate(event) {
    event.preventDefault();

    let validationFailures = validatePrintTemplate();

    const failedValidation = validationFailures.length;
    if (failedValidation) {

      const failureMessages = validationFailures.map((failure, index) => (
          <li key={index} className="list__item">
            <Announcer text={failure.message}/>
            <a
                className="list__link js-inpagelink"
                // MUST use href in-page links for accessibility
                href={`#${failure.anchorTo}`}>
              {failure.message}
            </a>
          </li>
      ));

      setValidationFailureMessages(failureMessages);
    }

    if (!failedValidation) {
      await createPrintTemplate();
    }
  }

  function ErrorDisplay() {
    const failureMessageCount = validationFailureMessages.length
    let validationErrorInfoText;
    if (failureMessageCount === 1) {
      validationErrorInfoText = "There is 1 problem with this page"
    } else {
      validationErrorInfoText = `There are ${failureMessageCount} problems with this page`
    }

    return (
        <div
            id="errorSummaryTitle"
            ref={errorSummaryTitle}
            aria-labelledby="error-summary-title"
            role="alert"
            tabIndex="-1"
            className="panel panel--error"
        >
          <Announcer text={"Error"}/>
          <div className="panel__header">
            <h2 data-qa="error-header" className="panel__title u-fs-r--b">
              {validationErrorInfoText}
            </h2>
          </div>
          <div className="panel__body">
            <ol className="list">
              {validationFailureMessages}
            </ol>
          </div>
        </div>
    )
  }

  return (
      <>
        {validationFailureMessages.length > 0 && <ErrorDisplay/>}
        <h2>Create a Print Template</h2>
        <form onSubmit={validateAndCreatePrintTemplate}>

          <div className="question u-mt-no">
            <fieldset
                id="printSupplierInput"
                aria-required="true"
                aria-label={"Select print supplier"}
                className="fieldset"
                ref={printSupplierInput}
                onChange={handlePrintSupplierChange}
            >
              <legend className="fieldset__legend">
                <label className="label venus">Select print supplier</label>
              </legend>
              <div className="input-items">
                <div className="radios__items">
                  {printSupplierOptions}
                </div>
              </div>
            </fieldset>
          </div>
          <p></p>

          <div className="field">
            <label className="label venus">Enter pack code</label>
            <input
                id="packCodeInput"
                ref={printPackCodeInput}
                className="input input--text input-type__input"
                onChange={handlePackCodeChange}
                type="text"
                aria-label={"Enter pack code"}
                aria-required="true"
                required
                value={packCode}
            />
          </div>

          <div className="field">
            <label className="label venus">Enter print template</label>
            <input
                id="printTemplateInput"
                ref={printTemplateInput}
                className="input input--text input-type__input"
                onChange={handleTemplateChange}
                type="text"
                aria-label={"Enter print template"}
                aria-required="true"
                required
                value={printTemplate}
            />
          </div>
          <p></p>
          <button type="submit" className="btn btn--link">
            <span className="btn__inner">Create Print Template</span>
          </button>
        </form>
      </>
  );
}

export default CreatePrintTemplate;
