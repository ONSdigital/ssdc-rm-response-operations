import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Announcer from "react-a11y-announcer";
import { Link } from "react-router-dom";

function MyGroupsAdmin() {
  const [tableRows, setTableRows] = useState([]);

  useEffect(() => {
    async function fetchGroupsUserAdminOf() {
      const response = await fetch("/api/userGroups/thisUserAdminGroups");

      const userAdminGroupsJson = await response.json();

      const tableRows = await userAdminGroupsJson.map((group, index) => (
        <tr className="table__row" key={index}>
          <td className="table__cell">
            <Link
              to={`/groupadmin?groupId=${group.id}&groupName=${group.name}`}
            >
              {group.name}
            </Link>
          </td>
        </tr>
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

      <table className="table table--row-hover">
        <thead className="table__head">
          <tr className="table__row">
            <th scope="col" className="table__header">
              Group Name
            </th>
          </tr>
        </thead>

        <tbody className="table__body">{tableRows}</tbody>
      </table>
    </>
  );
}

export default MyGroupsAdmin;
