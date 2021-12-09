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
import SuccessPanel from "./DesignSytemComponents/SuccessPanel";

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
      {!props.flashMessageUntil && <Announcer text={"Surveys"} />}
      {props.flashMessageUntil > Date.now() && (
        <>
          <Announcer text={"New survey has been created"} />
          <SuccessPanel>New survey has been created</SuccessPanel>
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
        <TableBody>
          {tableRows}
        </TableBody>
      </Table>
    </>
  );
}

export default Surveys;
