import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import Announcer from "react-a11y-announcer";

function CreatePrintTemplate() {
  const [printSupplierOptions, setPrintSupplierOptions] = useState([]);
  const [printSupplier, setPrintSupplier] = useState();
  const [packCode, setPackCode] = useState("");
  const [printTemplate, setPrintTemplate] = useState("");
  const [validationFailed, setValidationFailed] = useState(false);
  const [validationFailedMessages, setValidationFailedMessages] = useState([]);

  let printSupplierInput = null;
  let packCodeInput = null;
  let printTemplateInput = null;

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/printsuppliers");
      const printSuppliers = await response.json();
      // const printSuppliers = ["SUPPLIER_A", "SUPPLIER_B"]

      const options = printSuppliers.map((supplier, index) => (
          <option key={index} value={supplier}>
            {supplier}
          </option>
      ));
      setPrintSupplierOptions(options);
    }

    fetchData();
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
    // TODO: We're using 2 validation failed variables here because the setValidationFailed is async so may not update. Need to find a way around this
    let failedValidation = false;
    let failures = [];
    setValidationFailed(false);

    if (!printSupplier) {
      failedValidation = true;
      setValidationFailed(true);
      failures.push({
          message: "Must select a print supplier",
          location: printSupplierInput
      })
    }

    try {
      const parsedJson = JSON.parse(printTemplate);
      if (!Array.isArray(parsedJson) || parsedJson.length === 0) {
        failedValidation = true;
        // failures.push("Print template must be array with one or more elements")
        setValidationFailed(true);
        // printTemplateInput.focus();
      }
    } catch (err) {
      // printTemplateInput.focus();
      failedValidation = true;
      // failures.push("Print template JSON is not valid")
      setValidationFailed(true);
    }

    const failureMessages = failures.map((failure, index) => (
        <li className="list__item u-fs-r">
          {index + 1} <a className="js-inpagelink" href={failure['location']}>{failure['message']}</a>
        </li>
    ));
    setValidationFailedMessages(failureMessages);

    event.preventDefault();

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
      }
    }
  }

  return (
      <>
        {validationFailed && (
            <>
              <Announcer text={"Error"} />
              <div className="panel panel--error">
                <div className="panel__header">
                  <div className="u-fs-r--b">Error</div>
                </div>
                <div className="panel__body">
                  <p className="u-fs-r">This is wrong, fix it before continuing.</p>

                  {/*TODO: Dynamically build the list and have it displayed in here*/}
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
                className="input input--select"
                onChange={handlePrintSupplierChange}
                aria-label={"Select a print supplier"}
                aria-required="true"
                required
                defaultValue={'DEFAULT'}
                ref={(input) => {
                  printSupplierInput = input;
                }}
            >
              <option value={'DEFAULT'} disabled>Select a print supplier</option>
              {printSupplierOptions}
            </select>
          </div>

          <div className="field">
            <label className="label venus">Enter a pack code</label>
            <input
                className="input input--text input-type__input"
                type="text"
                aria-label={"Enter a pack code"}
                aria-required="true"
                required
                value={packCode}
                onChange={handlePackCodeChange}
                // ref={(input) => {
                //   packCodeInput = input;
                // }}
            />
          </div>

          <div className="field">
            <label className="label venus">Enter a print template</label>
            <input
                className="input input--text input-type__input"
                type="text"
                aria-label={"Enter a print template"}
                aria-required="true"
                required
                value={printTemplate}
                onChange={handleTemplateChange}
                ref={(input) => {
                  printTemplateInput = input;
                }}
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
