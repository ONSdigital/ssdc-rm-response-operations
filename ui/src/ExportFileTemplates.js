import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Table from "./DesignSystemComponents/Table";
import TableHead from "./DesignSystemComponents/TableHead";
import TableHeaderCell from "./DesignSystemComponents/TableHeaderCell";
import TableCell from "./DesignSystemComponents/TableCell";
import TableBody from "./DesignSystemComponents/TableBody";
import TableRow from "./DesignSystemComponents/TableRow";
import SuccessPanel from "./DesignSystemComponents/SuccessPanel";
import PropTypes from "prop-types";
import ExtraPropTypes from "react-extra-prop-types";

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
            <TableCell>{exportFileTemplate.exportFileDestination}</TableCell>
            <TableCell>{JSON.stringify(exportFileTemplate.template)}</TableCell>
          </TableRow>
        ),
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
      {!props.flashMessageUntil}
      {props.flashMessageUntil > Date.now() && (
        <>
          <SuccessPanel>New export file template has been created</SuccessPanel>
          <br />
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
            <TableHeaderCell>Pack Code</TableHeaderCell>
            <TableHeaderCell>Description</TableHeaderCell>
            <TableHeaderCell>Export File Destination</TableHeaderCell>
            <TableHeaderCell>Template</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>{tableRows}</TableBody>
      </Table>
    </>
  );
}

ExportFileTemplates.propTypes = {
  flashMessageUntil: ExtraPropTypes.datetime,
  authorisedActivities: PropTypes.array.isRequired,
};

export default ExportFileTemplates;
