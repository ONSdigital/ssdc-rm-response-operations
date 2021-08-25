import React, { useEffect, useState } from "react";
import {Link, useHistory} from "react-router-dom";

function CreatePrintTemplate() {
  const [printSupplierOptions, setPrintSupplierOptions] = useState([]);
  const [printSupplier, setPrintSupplier] = useState([]);
  const [packCode, setPackCode] = useState("");
  const [printTemplate, setPrintTemplate] = useState("");

  let printSupplierInput = null;
  let packCodeInput = null;
  let printTemplateInput = null;

  useEffect(() => {
    async function fetchData() {
      // const response = await fetch("/api/printsuppliers");
      // const printSuppliers = await response.json();
      const printSuppliers = ["SUPPLIER_A", "SUPPLIER_B"]

      const printSupplierOptions = printSuppliers.map((supplier, index) => (
          <option key={index} value={supplier}>
            {supplier}
          </option>
      ));
      setPrintSupplierOptions(printSupplierOptions);
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
    // TODO: Shift validation on parsing template here instead
    try {
      const parsedJson = JSON.parse(printTemplate);
      if (!Array.isArray(parsedJson) || parsedJson.length === 0) {
        setPrintTemplate(null);
        return;
      }
    } catch (err) {
      setPrintTemplate(null);
      return;
      // this.setState({ templateValidationError: true });
      // failedValidation = true;
    }

    event.preventDefault();
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

  return (
    <>
      <h2>Create a New Print Template</h2>
      <form onSubmit={createPrintTemplate}>

        <div className="field field--select">
          <label className="label venus">Select a print supplier</label>
          <select
              className="input input--select"
              id="select"
              name="select"
              onChange={handlePrintSupplierChange}
              required
              // value={printSupplier}
              ref={(input) => {
                printSupplierInput = input;
              }}
          >
            <option selected disabled>Select a print supplier</option>
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
