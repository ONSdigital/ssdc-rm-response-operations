import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Table from "./DesignSystemComponents/Table";
import TableHead from "./DesignSystemComponents/TableHead";
import TableHeaderCell from "./DesignSystemComponents/TableHeaderCell";
import TableCell from "./DesignSystemComponents/TableCell";
import TableBody from "./DesignSystemComponents/TableBody";
import TableRow from "./DesignSystemComponents/TableRow";

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
              to={`/groupadmin?groupId=${group.id}&groupName=${group.name}`}
            >
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
