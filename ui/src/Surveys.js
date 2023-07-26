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

function Surveys(props) {
  const [tableRows, setTableRows] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/surveys");
      const surveys = await response.json();
      const tableRows = await surveys.map((survey, index) => (
        <TableRow key={index}>
          <TableCell>
            <Link to={`/viewSurvey?surveyId=${survey.id}`}>{survey.name}</Link>
          </TableCell>
        </TableRow>
      ));
      setTableRows(tableRows);
    }
    fetchData();
  }, []);

  return (
    <>
      <Helmet>
        <title>Surveys</title>
      </Helmet>
      {!props.flashMessageUntil}
      {props.flashMessageUntil > Date.now() && (
        <>
          <SuccessPanel>New survey has been created</SuccessPanel>
          <br />
        </>
      )}
      <h2>Surveys</h2>
      {props.authorisedActivities.includes("CREATE_SURVEY") && (
        <p>
          <Link to="/createsurvey">Create New Survey</Link>
        </p>
      )}

      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Survey Name</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>{tableRows}</TableBody>
      </Table>
    </>
  );
}

Surveys.propTypes = {
  authorisedActivities: PropTypes.array.isRequired,
  flashMessageUntil: ExtraPropTypes.datetime,
};

export default Surveys;
