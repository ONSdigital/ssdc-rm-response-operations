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
            <button type="button" className="btn btn--secondary btn--small"
              onClick={() => openRemoveUserPage(groupUser)}>
              <span className="btn__inner">Remove</span>
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
      <Link to="/mygroupsadmin">← Back to groups</Link>
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
      <h2>Members Of Group: {props.groupName}</h2>
      <table className="table table--row-hover">
        <thead className="table__head">
          <tr className="table__row">
            <th scope="col" className="table__header">
              Group Member Email
            </th>
            <th scope="col" className="table__header" />
          </tr>
        </thead>

        <tbody className="table__body">{userTableRows}</tbody>
      </table>
    </>
  );
}

export default GroupAdmin;
