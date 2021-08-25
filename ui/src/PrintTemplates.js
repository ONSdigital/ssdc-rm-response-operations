import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Announcer from "react-a11y-announcer";

function PrintTemplates(props) {
  const [tableRows, setTableRows] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/printtemplates");
      const printTemplates = await response.json();
      const tableRows = await printTemplates.map((printTemplate, index) => (
        <tr className="table__row" key={index}>
          <td className="table__cell">
            {printTemplate.packCode}
          </td>
          <td className="table__cell">
            {printTemplate.printSupplier}
          </td>
          <td className="table__cell">
            {JSON.stringify(printTemplate.template)}
          </td>
        </tr>
      ));
      setTableRows(tableRows);
    }
    fetchData();
  }, []);

  return (
    <>
      {!props.flashMessageUntil && <Announcer text={"Print Templates"} />}
      {props.flashMessageUntil > Date.now() && (
        <>
          <Announcer text={"New print template has been created"} />
          <div className="panel panel--success">
            <div className="panel__header">
              <p
                id="success"
                data-qa="success-header"
                className="panel__title u-fs-r--b"
              >
                <strong>New print template has been created</strong>
              </p>
            </div>
          </div>
        </>
      )}
      <h2>Print Templates</h2>
      {props.authorisedActivities.includes("CREATE_PRINT_TEMPLATE") && (
        <p>
          <Link to="/createprinttemplate">Create New Print Template</Link>
        </p>
      )}
      <table className="table table--row-hover">
        <thead className="table__head">
          <tr className="table__row">
            <th scope="col" className="table__header">
              Pack Code
            </th>
            <th scope="col" className="table__header">
              Print Supplier
            </th>
            <th scope="col" className="table__header">
              Template
            </th>
          </tr>
        </thead>
        <tbody className="table__body">{tableRows}</tbody>
      </table>
    </>
  );
}

export default PrintTemplates;
