import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Announcer from "react-a11y-announcer";
import { Helmet } from "react-helmet";

function ExportFileTemplates(props) {
  const [tableRows, setTableRows] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/exportfiletemplates");
      const exportFileTemplates = await response.json();
      const tableRows = await exportFileTemplates.map((exportFileTemplate, index) => (
        <tr className="table__row" key={index}>
          <td className="table__cell">{exportFileTemplate.packCode}</td>
          <td className="table__cell">{exportFileTemplate.exportFileDestination}</td>
          <td className="table__cell">
            {JSON.stringify(exportFileTemplate.template)}
          </td>
        </tr>
      ));
      setTableRows(tableRows);
    }
    fetchData();
  }, []);

  return (
    <>
      <Helmet>
        <title>View Export File Templates</title>
      </Helmet>
      {!props.flashMessageUntil && <Announcer text={"Export File Templates"} />}
      {props.flashMessageUntil > Date.now() && (
        <>
          <Announcer text={"New export file Template has been created"} />
          <div className="panel panel--success">
            <div className="panel__header">
              <p
                id="success"
                data-qa="success-header"
                className="panel__title u-fs-r--b"
              >
                <strong>New export file template has been created</strong>
              </p>
            </div>
          </div>
        </>
      )}
      <h2>Export File Templates</h2>
      {props.authorisedActivities.includes("CREATE_EXPORT_FILE_TEMPLATE") && (
        <p>
          <Link to="/createexportfiletemplate">Create New Export File Template</Link>
        </p>
      )}
      <table className="table table--row-hover">
        <thead className="table__head">
          <tr className="table__row">
            <th scope="col" className="table__header">
              Pack Code
            </th>
            <th scope="col" className="table__header">
              Export File Destination
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

export default ExportFileTemplates;
