import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Announcer from "react-a11y-announcer";
import { Helmet } from "react-helmet";
import Table from "./DesignSytemComponents/Table";
import TableHead from "./DesignSytemComponents/TableHead";
import TableHeaderCell from "./DesignSytemComponents/TableHeaderCell";
import TableCell from "./DesignSytemComponents/TableCell";
import TableBody from "./DesignSytemComponents/TableBody";
import TableRow from "./DesignSytemComponents/TableRow";

function ExportFileTemplates(props) {
  const [tableRows, setTableRows] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/exportfiletemplates");
      const exportFileTemplates = await response.json();
      const tableRows = await exportFileTemplates.map(
        (exportFileTemplate, index) => (
          <TableRow key={index}>
            <TableCell>{exportFileTemplate.packCode}</TableCell>
            <TableCell>{exportFileTemplate.description}</TableCell>
            <TableCell>
              {exportFileTemplate.exportFileDestination}
            </TableCell>
            <TableCell >
              {JSON.stringify(exportFileTemplate.template)}
            </TableCell>
          </TableRow>
        )
      );
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
          <Link to="/createexportfiletemplate">
            Create New Export File Template
          </Link>
        </p>
      )}
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>
              Pack Code
            </TableHeaderCell>
            <TableHeaderCell>
              Description
            </TableHeaderCell>
            <TableHeaderCell>
              Export File Destination
            </TableHeaderCell>
            <TableHeaderCell>
              Template
            </TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>{tableRows}</TableBody>
      </Table>
    </>
  );
}

export default ExportFileTemplates;
