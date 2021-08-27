import React, {useEffect, useRef, useState} from "react";
import {useHistory} from "react-router-dom";
import Announcer from "react-a11y-announcer";

function CreatePrintTemplate() {
  const [printSupplierOptions, setPrintSupplierOptions] = useState([]);
  const [printSupplier, setPrintSupplier] = useState();
  const [packCode, setPackCode] = useState("");
  const [printTemplate, setPrintTemplate] = useState("");
  const [validationFailed, setValidationFailed] = useState(false);
  const [validationFailedMessages, setValidationFailedMessages] = useState([]);

  const printSupplierInput = useRef(null);
  const printPackCodeInput = useRef(null);
  const printTemplateInput = useRef(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/printsuppliers");
      const printSuppliers = await response.json();

      const options = printSuppliers.map((supplier, index) => (
          <option key={index} value={supplier}>
            {supplier}
          </option>
      ));
      setPrintSupplierOptions(options);
    }
    fetchData();
    printSupplierInput.current.focus();
  }, []);

  function handlePrintSupplierChange(event) {
    setPrintSupplier(event.target.value);
  }

  function handlePackCodeChange(event) {
    setPackCode(event.target.value);
  }

  function handleTemplateChange(event) {
    setPrintTemplate(event.target.value);
  }

  let history = useHistory();

  async function createPrintTemplate(event) {
    event.preventDefault();

    const printTemplateErrorMessages = {
      supplierSelection: "Must select a print supplier",
      templateArrayFormat: "Print template must be JSON array with one or more elements",
      templateInvalidJson: "Print template is not valid JSON",
      serverResponse: "Error response from server - Unable to create print template"
    }

    setValidationFailed(false);
    let failedValidation = false;
    let errors = [];

    if (!printSupplier) {
      failedValidation = true;
      errors.push({
        message: printTemplateErrorMessages.supplierSelection,
        anchorTo: printSupplierInput.current.id
      })
    }

    try {
      const parsedJson = JSON.parse(printTemplate);
      if (!Array.isArray(parsedJson) || parsedJson.length === 0) {
        failedValidation = true;
        errors.push({
          message: printTemplateErrorMessages.templateArrayFormat,
          anchorTo: printTemplateInput.current.id
        })
      }
    } catch (err) {
      failedValidation = true;
      errors.push({
        message: printTemplateErrorMessages.templateInvalidJson,
        anchorTo: printTemplateInput.current.id
      })
    }

    if (failedValidation) {
      setValidationFailed(true);
      const failureMessages = errors.map((failure, index) => (
          <li className="list__item u-fs-r">
            <Announcer text={failure.message}/>
            {index + 1})&nbsp;
            <a
              className="js-inpagelink"
              // MUST use href for in-page links for accessibility
              href={`#${failure.anchorTo}`}>
            {failure.message}
            </a>
          </li>
      ));
      setValidationFailedMessages(failureMessages);
    }

    if (!failedValidation) {
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
      } else {
        setValidationFailed(true);
        const serverErrorMessage = [
          <li className="list__item u-fs-r">
            <Announcer text={printTemplateErrorMessages.serverResponse}/>
            <strong>
              {printTemplateErrorMessages.serverResponse}
            </strong>
          </li>
        ];
        setValidationFailedMessages(serverErrorMessage);
      }
    }
  }

  return (
      <>
        {validationFailed && (
            <>
              <div className="panel panel--error">
                <div className="panel__header">
                  <Announcer text={"Error"}/>
                  <div className="u-fs-r--b">Error</div>
                </div>
                <div className="panel__body">
                  <Announcer text={"Error"}/>
                  <Announcer
                      text={`Error${validationFailedMessages.length > 1 ? "s" : ""} found. Please fix before continuing.`}/>
                  <p className="u-fs-r">
                    Error{validationFailedMessages.length > 1 ? "s" : ""} found. Please fix before continuing.
                  </p>
                  <ul className="list list--bare">
                    {validationFailedMessages}
                  </ul>
                </div>
              </div>
            </>
        )}
        <h2>Create a New Print Template</h2>
        <form onSubmit={createPrintTemplate}>
          <div className="field field--select">
            <label className="label venus">Select a print supplier</label>
            <select
                id="printSupplierInput"
                className="input input--select"
                onChange={handlePrintSupplierChange}
                aria-label={"Select a print supplier"}
                aria-required="true"
                required
                defaultValue={"DEFAULT"}
                ref={printSupplierInput}
            >
              <option value={"DEFAULT"} disabled>Select a print supplier</option>
              {printSupplierOptions}
            </select>
          </div>

          <div className="field">
            <label className="label venus">Enter a pack code</label>
            <input
                id="packCodeInput"
                ref={printPackCodeInput}
                className="input input--text input-type__input"
                type="text"
                aria-label={"Enter a pack code"}
                aria-required="true"
                required
                value={packCode}
                onChange={handlePackCodeChange}
            />
          </div>

          <div className="field">
            <label className="label venus">Enter a print template</label>
            <input
                id="printTemplateInput"
                ref={printTemplateInput}
                className="input input--text input-type__input"
                type="text"
                aria-label={"Enter a print template"}
                aria-required="true"
                required
                value={printTemplate}
                onChange={handleTemplateChange}
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
