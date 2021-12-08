import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Announcer from "react-a11y-announcer";
import { Link } from "react-router-dom";
import Table from "./DesignSytemComponents/Table";
import TableHead from "./DesignSytemComponents/TableHead";
import TableHeaderCell from "./DesignSytemComponents/TableHeaderCell";
import TableCell from "./DesignSytemComponents/TableCell";
import TableBody from "./DesignSytemComponents/TableBody";
import TableRow from "./DesignSytemComponents/TableRow";

function MyGroupsAdmin() {
  const [tableRows, setTableRows] = useState([]);

  useEffect(() => {
    async function fetchGroupsUserAdminOf() {
      const response = await fetch("/api/userGroups/thisUserAdminGroups");

      const userAdminGroupsJson = await response.json();

      const tableRows = await userAdminGroupsJson.map((group, index) => (
        <TableRow key={index}>
          <TableCell>
            <Link
              to={`/groupadmin?groupId=${group.id}&groupName=${group.name}`}>
              {group.name}
            </Link>
          </TableCell>
          <TableCell>{group.description}</TableCell>
        </TableRow>
      ));
      setTableRows(tableRows);
    }

    fetchGroupsUserAdminOf();
  }, []);

  return (
    <>
      <Helmet>
        <title>My Admin Groups</title>
      </Helmet>
      <Announcer text={"My Admin Groups"} />
      <Link to="/">← Back to home</Link>
      <h2>My Admin Groups</h2>

      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Group Name</TableHeaderCell>
            <TableHeaderCell>Group Description</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>{tableRows}</TableBody>
      </Table>
    </>
  );
}

export default MyGroupsAdmin;
