import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import Announcer from "react-a11y-announcer";
import { Helmet } from "react-helmet";
import Button from "./DesignSytemComponents/Button";
import TextInput from "./DesignSytemComponents/TextInput";
import RadioBtnGroup from "./DesignSytemComponents/RadioBtnGroup";
import RadioBtnItem from "./DesignSytemComponents/RadioBtnItem";
import ComponentErrorPanel from "./DesignSytemComponents/ComponentErrorPanel";
import ErrorSummary from "./DesignSytemComponents/ErrorSummary";

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
      <p id={`error${index}`} key={index} className="ons-panel__error">
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
      <li key={index} className="ons-list__item">
        <Announcer text={formError.message} />
        <a
          className="ons-list__link js-inpagelink"
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

  const packCodeInputFragment = (
    <div>
      <TextInput
        label="Enter pack code"
        id="packCodeInput"
        ref={printPackCodeInput}
        onChange={handlePackCodeChange}
        required
        value={packCode}
      />
    </div>
  );

  const packCodeInputErrorFragment = (
    <ComponentErrorPanel
      id="packCodeInputError"
      errorSummary={packCodeInputErrorSummary}
    >
      {packCodeInputFragment}
    </ComponentErrorPanel>
  );

  const descriptionInputFragment = (
    <div>
      <TextInput
        label="Enter description"
        id="descriptionInput"
        onChange={handleDescriptionChange}
        required
        value={description}
      />
    </div>
  );

  const exportFileTemplateFragment = (
    <TextInput
      label="Enter export file template"
      id="exportFileTemplateInputXXX"
      onChange={handleTemplateChange}
      required
      value={exportFileTemplate}
      ref={exportFileTemplateInput}
    />
  );

  const exportFileTemplateErrorFragment = (
    <ComponentErrorPanel
      id="exportFileTemplateInputError"
      errorSummary={exportFileTemplateInputErrorSummary}
    >
      {exportFileTemplateFragment}
    </ComponentErrorPanel>
  );

  const supplierInputFragment = (
    <RadioBtnGroup
      ref={exportFileDestinationInput}
      legend="Select export file destination"
      onChange={handleExportFileDestinationChange}
    >
      {exportFileDestinationOptions}
    </RadioBtnGroup>
  );

  const supplierInputErrorFragment = (
    <ComponentErrorPanel
      id="SupplierInputError"
      errorSummary={supplierInputErrorSummary}
    >
      {supplierInputFragment}
    </ComponentErrorPanel>
  );

  return (
    <>
      <Helmet>
        <title>Create Export File Template</title>
      </Helmet>
      {errorSummary.length > 0 && (
        <ErrorSummary errorSummary={errorSummary} ref={errorSummaryTitle} />
      )}
      <h2>Create a Export File Template</h2>
      <form onSubmit={validateFormAndCreateExportFileTemplate}>
        <div className="ons-question ons-u-mt-no">
          {packCodeInputErrorSummary.length === 0
            ? packCodeInputFragment
            : packCodeInputErrorFragment}
        </div>
        <br />
        <div className="ons-question ons-u-mt-no">
          {descriptionInputFragment}
        </div>
        <br />
        <div className="ons-question ons-u-mt-no">
          {exportFileTemplateInputErrorSummary.length === 0
            ? exportFileTemplateFragment
            : exportFileTemplateErrorFragment}
        </div>
        <br />
        <div className="ons-question ons-u-mt-no">
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
