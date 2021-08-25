import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";


// '{"SUPPLIER_A":{"sftpDirectory":"foo","encryptionKeyFilename": "bar"},"SUPPLIER_B":{"sftpDirectory":"foo","encryptionKeyFilename":"bar"}}'


function CreatePrintTemplate() {
  // let printSupplierInput = null;
  let packCodeInput = null;
  let printTemplateInput = null;


  useEffect(() => {
    // printSupplierInput.focus();
    packCodeInput.focus();
    printTemplateInput.focus();
  });

  const [printSupplier, setPrintSupplier] = useState([]);
  const [packCode, setPackCode] = useState("");
  const [printTemplate, setPrintTemplate] = useState("");

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
    const newPrintTemplate = {
      packCode: packCode,
      printSupplier: printSupplier,
      template: JSON.parse(printTemplate),
    };

    const response = await fetch("/api/printTemplates", {
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
          <select className="input input--select" id="select" name="select">
            <option selected disabled>Select a print supplier</option>
            <option value="SUPPLIER_A">SUPPLIER_A</option>
            <option value="SUPPLIER_B">SUPPLIER_B</option>
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
            ref={(input) => {
              packCodeInput = input;
            }}
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
