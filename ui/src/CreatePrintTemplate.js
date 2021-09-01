import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import Announcer from "react-a11y-announcer";

function CreatePrintTemplate() {
  const [printSupplier, setPrintSupplier] = useState("");
  const [packCode, setPackCode] = useState("");
  const [printTemplate, setPrintTemplate] = useState("");
  const [printSupplierOptions, setPrintSupplierOptions] = useState([]);
  const [hasErrors, setHasErrors] = useState(false);
  const [printTemplateInputErrorDetail, setPrintTemplateInputErrorDetail] =
    useState([]);
  const [errorSummary, setErrorSummary] = useState([]);

  const printSupplierInput = useRef(null);
  const printPackCodeInput = useRef(null);
  const printTemplateInput = useRef(null);
  const errorSummaryTitle = useRef(null);

  let history = useHistory();

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/printsuppliers");
      const printSuppliers = await response.json();

      const options = printSuppliers.map((supplier, index) => (
        <div key={index}>
          <p className="radios__item">
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
                className="radio__label"
              >
                {supplier}
              </label>
            </span>
          </p>
          <br />
        </div>
      ));
      setPrintSupplierOptions(options);
    }

    fetchData();
    printPackCodeInput.current.focus();
  }, []);

  useEffect(() => {
    if (hasErrors) {
      document.title = "Error";
      errorSummaryTitle.current.focus();
    }
  }, [hasErrors]);

  function handlePrintSupplierChange(event) {
    setPrintSupplier(event.target.value);
    setHasErrors(false);
  }

  function handlePackCodeChange(event) {
    setPackCode(event.target.value);
    setHasErrors(false);
  }

  function handleTemplateChange(event) {
    setPrintTemplate(event.target.value);
    setHasErrors(false);
  }

  function validatePrintTemplateInput() {
    const inputErrorMessageInfo = {
      arrayFormatError:
        "Print template must be JSON array with one or more elements",
      jsonFormatError: "Print template is not valid JSON",
    };

    let errorMessageAndLocation = [];
    try {
      const parsedJson = JSON.parse(printTemplate);
      if (!Array.isArray(parsedJson) || parsedJson.length === 0) {
        errorMessageAndLocation.push({
          message: inputErrorMessageInfo.arrayFormatError,
          anchorTo: printTemplateInput.current.id,
        });
        setPrintTemplateInputErrorDetail(
          inputErrorMessageInfo.arrayFormatError
        );
      }
    } catch (err) {
      errorMessageAndLocation.push({
        message: inputErrorMessageInfo.jsonFormatError,
        anchorTo: printTemplateInput.current.id,
      });
      setPrintTemplateInputErrorDetail(inputErrorMessageInfo.jsonFormatError);
    }
    return errorMessageAndLocation;
  }

  function validatePrintTemplateForm() {
    return validatePrintTemplateInput();
  }

  async function createPrintTemplate() {
    const newPrintTemplate = {
      packCode: packCode,
      printSupplier: printSupplier,
      template: JSON.parse(printTemplate),
    };

    const response = await fetch("/api/printtemplates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPrintTemplate),
    });

    if (response.ok) {
      history.push(`/printtemplates?flashMessageUntil=${Date.now() + 5000}`);
    }
  }

  async function validateFormAndCreatePrintTemplate(event) {
    event.preventDefault();

    setHasErrors(false);
    setErrorSummary([]);
    setPrintTemplateInputErrorDetail([]);

    let validationFailures = validatePrintTemplateForm();

    const failedValidation = validationFailures.length;
    if (failedValidation) {
      const failureMessages = validationFailures.map((failure, index) => (
        <li key={index} className="list__item">
          <Announcer text={failure.message} />
          <a
            className="list__link js-inpagelink"
            // MUST use href in-page links for accessibility
            href={`#${failure.anchorTo}`}
          >
            {failure.message}
          </a>
        </li>
      ));
      setHasErrors(true);
      setErrorSummary(failureMessages);
    }

    if (!failedValidation) {
      await createPrintTemplate();
    }
  }

  function ErrorSummary() {
    const failureMessageCount = errorSummary.length;
    let validationErrorInfoText;
    if (failureMessageCount === 1) {
      validationErrorInfoText = "There is 1 problem with this page";
    } else {
      validationErrorInfoText = `There are ${failureMessageCount} problems with this page`;
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
        <Announcer text={"Error"} />
        <div className="panel__header">
          <h2 data-qa="error-header" className="panel__title u-fs-r--b">
            {validationErrorInfoText}
          </h2>
        </div>
        <div className="panel__body">
          <ol className="list">{errorSummary}</ol>
        </div>
      </div>
    );
  }

  const PrintTemplateError = (
    <div
      className="panel panel--error panel--no-title u-mb-s"
      id="printTemplateInputError"
    >
      <span className="u-vh">Error: </span>
      <div className="panel__body">
        <p className="panel__error">
          <strong>{printTemplateInputErrorDetail}</strong>
        </p>
        <div className="field">
          <label className="label" htmlFor={printTemplateInput}>
            Enter Print Template
          </label>
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
      </div>
    </div>
  );

  const PrintTemplate = (
    <div className="question u-mt-no">
      <label className="label" htmlFor={printTemplateInput}>
        Enter print template
      </label>
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
  );

  return (
    <>
      {errorSummary.length > 0 && <ErrorSummary />}

      <h2>Create a Print Template</h2>
      <form onSubmit={validateFormAndCreatePrintTemplate}>
        <div className="question u-mt-no">
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
        <br />
        <div className="question u-mt-no">
          {printTemplateInputErrorDetail.length > 0
            ? PrintTemplateError
            : PrintTemplate}
        </div>
        <br />
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
              <div className="radios__items">{printSupplierOptions}</div>
            </div>
          </fieldset>
        </div>
        <br />
        <button type="submit" className="btn btn--link">
          <span className="btn__inner">Create Print Template</span>
        </button>
      </form>
    </>
  );
}

export default CreatePrintTemplate;
