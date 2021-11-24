import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import Announcer from "react-a11y-announcer";
import { Link } from "react-router-dom";

function GroupAdmin(props) {
  let history = useHistory();
  const [userTableRows, setUserTableRowsRows] = useState([]);

  function openRemoveUserPage(groupUser) {
    history.push(
      `deleteuserfromgroupconfirmation?groupUserId=${groupUser.id}&groupName=${props.groupName}&groupId=${props.groupId}&userEmail=${groupUser.userEmail}`
    );
  }

  useEffect(() => {
    async function fetchAllUsersInGroup() {
      const allGroupMembersResponse = await fetch(
        `/api/userGroupMembers/findByGroup/${props.groupId}`
      );
      const allUsersInGroup = await allGroupMembersResponse.json();

      const usersInGroupRows = await allUsersInGroup.map((groupUser, index) => (
        <tr className="table__row" key={index}>
          <td className="table__cell">{groupUser.userEmail}</td>
          <td className="table__cell">
            <button onClick={() => openRemoveUserPage(groupUser)} type="button">
              Remove
            </button>
          </td>
        </tr>
      ));
      setUserTableRowsRows(usersInGroupRows);
    }

    fetchAllUsersInGroup();
  }, [props.groupId]);

  return (
    <>
      <Helmet>
        <title>View Group</title>
      </Helmet>
      <Link to="/">← Back to home</Link>
      {!props.flashMessageUntil && (
        <Announcer text={`Users in group: ${props.groupName}`} />
      )}
      {props.flashMessageUntil > Date.now() && (
        <>
          <Announcer text={`Removed user ${props.deletedUserEmail}`} />
          <div className="panel panel--success">
            <div className="panel__header">
              <p
                id="success"
                data-qa="success-header"
                className="panel__title u-fs-r--b"
              >
                <strong>Removed user {props.deletedUserEmail}</strong>
              </p>
            </div>
          </div>
        </>
      )}
      <br />
      <table className="table table--row-hover">
        <thead className="table__head">
          <tr className="table__row">
            <th scope="col" className="table__header">
              Users in group: {props.groupName}
            </th>
          </tr>
        </thead>

        <tbody className="table__body">{userTableRows}</tbody>
      </table>
    </>
  );
}

export default GroupAdmin;
