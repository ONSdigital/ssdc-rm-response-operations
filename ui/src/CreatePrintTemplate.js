import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import Announcer from "react-a11y-announcer";

function CreatePrintTemplate() {
  const [printSupplier, setPrintSupplier] = useState("");
  const [packCode, setPackCode] = useState("");
  const [printTemplate, setPrintTemplate] = useState("");
  const [printSupplierOptions, setPrintSupplierOptions] = useState([]);
  const [hasErrors, setHasErrors] = useState(false);
  const [errorSummary, setErrorSummary] = useState([]);
  const [printTemplateInputErrorSummary, setPrintTemplateInputErrorSummary] =
    useState([]);

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

  function getPrintTemplateInputErrors() {
    const printTemplateInputErrorInfo = {
      arrayFormatError:
        "Print template must be JSON array with one or more elements",
      jsonFormatError: "Print template is not valid JSON",
    };

    let errors = [];
    try {
      const parsedJson = JSON.parse(printTemplate);
      if (!Array.isArray(parsedJson) || parsedJson.length === 0) {
        errors.push({
          message: printTemplateInputErrorInfo.arrayFormatError,
          anchorTo: printTemplateInput.current.id,
        });
      }
    } catch (err) {
      errors.push({
        message: printTemplateInputErrorInfo.jsonFormatError,
        anchorTo: printTemplateInput.current.id,
      });
    }
    return errors;
  }

  function validatePrintTemplateForm() {
    const printTemplateInputErrors = getPrintTemplateInputErrors();
    const errors = printTemplateInputErrors.map(
      (printTemplateInputError, index) => (
        <p
          id={`printTemplateInputError${index}`}
          key={index}
          className="panel__error"
        >
          <strong>{printTemplateInputError.message}</strong>
        </p>
      )
    );
    setPrintTemplateInputErrorSummary(errors);

    return printTemplateInputErrors;
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
    setPrintTemplateInputErrorSummary([]);

    let formSummaryErrors = validatePrintTemplateForm();
    const errors = formSummaryErrors.map((formError, index) => (
      <li key={index} className="list__item">
        <Announcer text={formError.message} />
        <a
          className="list__link js-inpagelink"
          // MUST use href in-page links for accessibility
          href={`#${formError.anchorTo}`}
        >
          {formError.message}
        </a>
      </li>
    ));
    setErrorSummary(errors);

    if (!formSummaryErrors.length) {
      await createPrintTemplate();
    } else {
      setHasErrors(true);
    }
  }

  function ErrorSummary() {
    const errorSummaryCount = errorSummary.length;
    const validationErrorInfoText =
      errorSummaryCount === 1
        ? "There is 1 problem with this page"
        : `There are ${errorSummaryCount} problems with this page`;

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

  const printTemplateErrorFragment = (
    <div
      className="panel panel--error panel--no-title u-mb-s"
      id="printTemplateInputError"
    >
      <span className="u-vh">Error: </span>
      <div className="panel__body">
        <p className="panel__error">
          <strong>{printTemplateInputErrorSummary}</strong>
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

  const printTemplateFragment = (
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
          {printTemplateInputErrorSummary.length === 0 && printTemplateFragment}
          {printTemplateInputErrorSummary.length > 0 && printTemplateErrorFragment}
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
