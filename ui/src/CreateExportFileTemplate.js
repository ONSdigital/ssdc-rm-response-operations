import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import Announcer from "react-a11y-announcer";
import { Helmet } from "react-helmet";
import Button from "./DesignSytemComponents/Button";
import TextInput from "./DesignSytemComponents/TextInput";
import RadioBtnGroup from "./DesignSytemComponents/RadioBtnGroup";
import RadioBtnItem from "./DesignSytemComponents/RadioBtnItem";

function CreateExportFileTemplate() {
  const [exportFileDestination, setexportFileDestination] = useState("");
  const [packCode, setPackCode] = useState("");
  const [description, setDescription] = useState("");
  const [exportFileTemplate, setExportFileTemplate] = useState("");
  const [exportFileDestinationOptions, setexportFileDestinationOptions] =
    useState([]);
  const [hasErrors, setHasErrors] = useState(false);
  const [errorSummary, setErrorSummary] = useState([]);
  const [
    exportFileTemplateInputErrorSummary,
    setExportFileTemplateInputErrorSummary,
  ] = useState([]);
  const [packCodeInputErrorSummary, setPackCodeInputErrorSummary] = useState(
    []
  );
  const [supplierInputErrorSummary, setexportFileDestinationErrorSummary] =
    useState([]);

  const exportFileDestinationInput = useRef(null);
  const printPackCodeInput = useRef(null);
  const exportFileTemplateInput = useRef(null);
  const errorSummaryTitle = useRef(null);

  let history = useHistory();

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/exportfiledestinations");

      const exportFileDestinations = await response.json();

      const options = exportFileDestinations.map((supplier, index) => (
        <div key={index}>
          <RadioBtnItem id={supplier} value={supplier} name="supplier">
            {supplier}
          </RadioBtnItem>
          <br />
        </div>
      ));
      setexportFileDestinationOptions(options);
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

  function handleExportFileDestinationChange(event) {
    setexportFileDestination(event.target.value);
    setHasErrors(false);
  }

  function handlePackCodeChange(event) {
    setPackCode(event.target.value);
    setHasErrors(false);
  }

  function handleDescriptionChange(event) {
    setDescription(event.target.value);
    setHasErrors(false);
  }

  function handleTemplateChange(event) {
    setExportFileTemplate(event.target.value);
    setHasErrors(false);
  }

  function getExportFileTemplateInputErrors(errorStr) {
    const exportFileTemplateInputErrorInfo = {
      arrayFormatError:
        "Export file template must be JSON array with one or more elements",
      jsonFormatError: "Export file template is not valid JSON",
    };

    let errors = [];
    try {
      const parsedJson = JSON.parse(exportFileTemplate);
      if (!Array.isArray(parsedJson) || parsedJson.length === 0) {
        errors.push({
          message: exportFileTemplateInputErrorInfo.arrayFormatError,
          anchorTo: exportFileTemplateInput.current.id,
        });
      }
    } catch (err) {
      errors.push({
        message: exportFileTemplateInputErrorInfo.jsonFormatError,
        anchorTo: exportFileTemplateInput.current.id,
      });
    }
    return errors;
  }

  function buildServerSideErrorsMessagesForType(
    error,
    element_to_anchor_to_id
  ) {
    let errorMessages = [];

    if (error !== null) {
      errorMessages.push({
        message: error,
        anchorTo: element_to_anchor_to_id,
      });
    }

    return errorMessages;
  }

  function makePanelErrors(errorMessages) {
    const errorPanels = errorMessages.map((error, index) => (
      <p id={`error${index}`} key={index} className="panel__error">
        <strong>{error.message}</strong>
      </p>
    ));

    return errorPanels;
  }

  function getServerSideValidationErrors(errorJson) {
    let allErrorMessages = [];

    const packCodeErrorMessages = buildServerSideErrorsMessagesForType(
      errorJson.packCodeErrors,
      printPackCodeInput.current.id
    );

    if (packCodeErrorMessages.length > 0) {
      setPackCodeInputErrorSummary(makePanelErrors(packCodeErrorMessages));
      Array.prototype.push.apply(allErrorMessages, packCodeErrorMessages);
    }

    const exportFileTemplateErrorMessages =
      buildServerSideErrorsMessagesForType(
        errorJson.templateErrors,
        exportFileTemplateInput.current.id
      );

    if (exportFileTemplateErrorMessages.length > 0) {
      setExportFileTemplateInputErrorSummary(
        makePanelErrors(exportFileTemplateErrorMessages)
      );
      Array.prototype.push.apply(
        allErrorMessages,
        exportFileTemplateErrorMessages
      );
    }

    const supplierErrorMessages = buildServerSideErrorsMessagesForType(
      errorJson.destinationErrors,
      exportFileDestinationInput.current.id
    );

    if (supplierErrorMessages.length > 0) {
      setexportFileDestinationErrorSummary(
        makePanelErrors(supplierErrorMessages)
      );
      Array.prototype.push.apply(allErrorMessages, supplierErrorMessages);
    }

    return allErrorMessages;
  }

  function validateExportFileTemplateForm() {
    const exportFileTemplateInputErrors = getExportFileTemplateInputErrors();
    setExportFileTemplateInputErrorSummary(
      makePanelErrors(exportFileTemplateInputErrors)
    );

    return exportFileTemplateInputErrors;
  }

  async function createExportFileTemplateThroughAPI() {
    const newExportFileTemplate = {
      packCode: packCode,
      description: description,
      exportFileDestination: exportFileDestination,
      template: JSON.parse(exportFileTemplate),
    };

    const response = await fetch("/api/exportfiletemplates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newExportFileTemplate),
    });

    if (response.ok) {
      history.push(
        `/exportfiletemplates?flashMessageUntil=${Date.now() + 5000}`
      );
      return [];
    }

    const errorMessageJson = await response.json();

    if (errorMessageJson.validationError) {
      return getServerSideValidationErrors(errorMessageJson);
    }

    return [];
  }

  async function validateFormAndCreateExportFileTemplate(event) {
    event.preventDefault();

    setHasErrors(false);
    setErrorSummary([]);
    setExportFileTemplateInputErrorSummary([]);
    setPackCodeInputErrorSummary([]);

    let formSummaryErrors = validateExportFileTemplateForm();

    if (formSummaryErrors.length === 0) {
      formSummaryErrors = await createExportFileTemplateThroughAPI();
    }

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

    if (formSummaryErrors.length) {
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

  const packCodeInputFragment = (
    <div>
      <TextInput label="Enter pack code"
        id="packCodeInput"
        ref={printPackCodeInput}
        onChange={handlePackCodeChange}
        required
        value={packCode}
      />
    </div>
  );

  const packCodeInputErrorFragment = (
    <div
      className="panel panel--error panel--no-title u-mb-s"
      id="packCodeInputError"
    >
      <span className="u-vh">Error: </span>
      <div className="panel__body">
        <p className="panel__error">
          <strong>{packCodeInputErrorSummary}</strong>
        </p>
        <div className="field">
          {packCodeInputFragment}
        </div>
      </div>
    </div>
  );

  const descriptionInputFragment = (
    <div>
      <TextInput label="Enter description"
        id="descriptionInput"
        onChange={handleDescriptionChange}
        required
        value={description}
      />
    </div>
  );

  const exportFileTemplateFragment = (
    <div className="question u-mt-no">
      <TextInput label="Enter export file template"
        id="exportFileTemplateInputXXX"
        onChange={handleTemplateChange}
        required
        value={exportFileTemplate}
      // ref={exportFileTemplateInput}
      />
    </div>

  );

  const exportFileTemplateErrorFragment = (
    <div
      className="panel panel--error panel--no-title u-mb-s"
      id="exportFileTemplateInputError"
    >
      <span className="u-vh">Error: </span>
      <div className="panel__body">
        <p className="panel__error">
          <strong>{exportFileTemplateInputErrorSummary}</strong>
        </p>
        <div className="field">
          {exportFileTemplateFragment}
        </div>
      </div>
    </div>
  );

  const supplierInputFragment = (
    <div className="question u-mt-no">
      <RadioBtnGroup legend="Select export file destination" onChange={handleExportFileDestinationChange}>
        {exportFileDestinationOptions}
      </RadioBtnGroup>
    </div>
  );

  const supplierInputErrorFragment = (
    <div
      className="panel panel--error panel--no-title u-mb-s"
      id="SupplierInputError"
    >
      <span className="u-vh">Error: </span>
      <div className="panel__body">
        <p className="panel__error">
          <strong>{supplierInputErrorSummary}</strong>
        </p>
        <div className="field">
          <RadioBtnGroup legend="Select export file destination" onChange={handleExportFileDestinationChange}>
            {exportFileDestinationOptions}
          </RadioBtnGroup>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Create Export File Template</title>
      </Helmet>
      {errorSummary.length > 0 && <ErrorSummary />}
      <h2>Create a Export File Template</h2>
      <form onSubmit={validateFormAndCreateExportFileTemplate}>
        <div className="question u-mt-no">
          {packCodeInputErrorSummary.length === 0
            ? packCodeInputFragment
            : packCodeInputErrorFragment}
        </div>
        <br />
        <div className="question u-mt-no">{descriptionInputFragment}</div>
        <br />
        <div className="question u-mt-no">
          {exportFileTemplateInputErrorSummary.length === 0
            ? exportFileTemplateFragment
            : exportFileTemplateErrorFragment}
        </div>
        <br />
        <div className="question u-mt-no">
          {supplierInputErrorSummary.length === 0
            ? supplierInputFragment
            : supplierInputErrorFragment}
        </div>
        <br />
        <Button type="submit">Create Export File Template testing</Button>
      </form>
    </>
  );
}

export default CreateExportFileTemplate;
