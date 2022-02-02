import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Announcer from "react-a11y-announcer";
import Button from "./DesignSystemComponents/Button";
import Table from "./DesignSystemComponents/Table";
import TableHead from "./DesignSystemComponents/TableHead";
import TableHeaderCell from "./DesignSystemComponents/TableHeaderCell";
import TableCell from "./DesignSystemComponents/TableCell";
import TableBody from "./DesignSystemComponents/TableBody";
import TableRow from "./DesignSystemComponents/TableRow";
import SuccessPanel from "./DesignSystemComponents/SuccessPanel";
import PropTypes from "prop-types";
import ExtraPropTypes from "react-extra-prop-types";

function GroupAdmin(props) {
  let history = useHistory();
  const [userTableRows, setUserTableRowsRows] = useState([]);
  const [existingEmailsInGroup, setExistingEmailsInGroup] = useState([]);

  function openRemoveUserPage(groupUser) {
    history.push(
      `deleteuserfromgroupconfirmation?groupUserId=${groupUser.id}&groupName=${props.groupName}&groupId=${props.groupId}&userEmail=${groupUser.userEmail}`
    );
  }

  function openAddUserPage() {
    history.push(
      `addUserToGroup?groupName=${props.groupName}&groupId=${props.groupId}`,
      { existingEmailsInGroup: existingEmailsInGroup }
    );
  }

  useEffect(() => {
    async function fetchAllUsersInGroup() {
      const allGroupMembersResponse = await fetch(
        `/api/userGroupMembers/findByGroup/${props.groupId}`
      );
      const allUsersInGroup = await allGroupMembersResponse.json();

      const usersInGroupRows = await allUsersInGroup.map((groupUser, index) => (
        <TableRow key={index}>
          <TableCell>{groupUser.userEmail}</TableCell>
          <TableCell>
            <Button
              secondary
              small
              onClick={() => openRemoveUserPage(groupUser)}
            >
              Remove
            </Button>
          </TableCell>
        </TableRow>
      ));
      setExistingEmailsInGroup(allUsersInGroup.map((user) => user.userEmail));
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
          {props.deletedUserEmail && (
            <>
              <Announcer text={`Removed user ${props.deletedUserEmail}`} />
              <br />
              <br />
              <SuccessPanel>Removed user {props.deletedUserEmail}</SuccessPanel>
              <br />
            </>
          )}
          {props.addedUserEmail && (
            <>
              <Announcer text={`Added user ${props.addedUserEmail}`} />
              <br />
              <br />
              <SuccessPanel>Added user {props.addedUserEmail}</SuccessPanel>
              <br />
            </>
          )}
        </>
      )}
      <h2>Members Of Group: {props.groupName}</h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Group Member Email</TableHeaderCell>
            <TableHeaderCell></TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>{userTableRows}</TableBody>
      </Table>

      <Button onClick={() => openAddUserPage()}>Add User To Group</Button>
    </>
  );
}

GroupAdmin.propTypes = {
  groupName: PropTypes.string.isRequired,
  groupId: PropTypes.string.isRequired,
  flashMessageUntil: ExtraPropTypes.datetime,
  addedUserEmail: PropTypes.string,
  deletedUserEmail: PropTypes.string,
};

export default GroupAdmin;
