import React, {useEffect, useState} from "react";
import {Link, useHistory} from "react-router-dom";
import Announcer from "react-a11y-announcer";

function CreatePrintTemplate() {
  const [printSupplierOptions, setPrintSupplierOptions] = useState([]);
  const [printSupplier, setPrintSupplier] = useState();
  const [packCode, setPackCode] = useState("");
  const [printTemplate, setPrintTemplate] = useState("");
  const [validationFailed, setValidationFailed] = useState(false);
  const [validationFailedMessages, setValidationFailedMessages] = useState([]);

  const inputAnchors = {
    printSupplierInput: "#printSupplierInput",
    packCodeInput: "#packCodeInput",
    printTemplateInput: "#printTemplateInput",
  }

  let printSupplierInput = null;

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
    printSupplierInput.focus();
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
    setValidationFailed(false);

    let failedValidation = false;
    let failures = [];

    if (!printSupplier) {
      failedValidation = true;
      failures.push({
        message: "Must select a print supplier",
        anchorTo: inputAnchors.printSupplierInput
      })
    }

    try {
      const parsedJson = JSON.parse(printTemplate);
      if (!Array.isArray(parsedJson) || parsedJson.length === 0) {
        failedValidation = true;
        failures.push({
          message: "Print template must be JSON array with one or more elements",
          anchorTo: inputAnchors.printTemplateInput
        })
      }
    } catch (err) {
      failedValidation = true;
      failures.push({
        message: "Print template is not valid JSON",
        anchorTo: inputAnchors.printTemplateInput
      })
    }

    if (failedValidation) {
      setValidationFailed(true);
      const failureMessages = failures.map((failure, index) => (
          <li className="list__item u-fs-r">
            <Announcer text={failure.message}/>
            {index + 1} <a className="js-inpagelink" href={failure.anchorTo}>{failure.message}</a>
            {/*{index + 1} {failure.message}*/}

            {/*{index + 1} <a className="js-inpagelink" href="#printSupplierInput">{failure.message}</a>*/}
            {/*<Link to={`/viewSurvey?surveyId=${survey.id}`}>{survey.name}</Link>*/}
            {/*<Link to="printSupplierInput">test</Link>*/}

            {/*<Link*/}
            {/*    className="js-inpagelink"*/}
            {/*    to={{*/}
            {/*      pathname: "/createprinttemplate",*/}
            {/*      // search: "?sort=name",*/}
            {/*      hash: "printSupplierInput",*/}
            {/*      // state: { fromDashboard: true }*/}
            {/*    }}*/}
            {/*>Test</Link>*/}

            {/*<Link to={{hash: printSupplierInput }} </Link>*/}
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

        const serverErrorInfoMessage = "Error response from server - Unable to create print template";
        setValidationFailedMessages([
          <li className="list__item u-fs-r">
            <Announcer text={serverErrorInfoMessage}/>
            <strong>
              {serverErrorInfoMessage}
            </strong>
          </li>
        ])
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
                ref={(input) => {
                  printSupplierInput = input;
                }}
            >
              <option value={"DEFAULT"} disabled>Select a print supplier</option>
              {printSupplierOptions}
            </select>
          </div>

          <div className="field">
            <label className="label venus">Enter a pack code</label>
            <input
                id="packCodeInput"
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
                id="printTemplateInput"
                className="input input--text input-type__input"
                type="text"
                aria-label={"Enter a print template"}
                aria-required="true"
                required
                value={printTemplate}
                onChange={handleTemplateChange}
                // ref={(input) => {
                //   printTemplateInput = input;
                // }}
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
