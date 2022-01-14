import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import Announcer from "react-a11y-announcer";
import { Link } from "react-router-dom";
import Button from "./DesignSystemComponents/Button";
import Table from "./DesignSystemComponents/Table";
import TableHead from "./DesignSystemComponents/TableHead";
import TableHeaderCell from "./DesignSystemComponents/TableHeaderCell";
import TableCell from "./DesignSystemComponents/TableCell";
import TableBody from "./DesignSystemComponents/TableBody";
import TableRow from "./DesignSystemComponents/TableRow";
import SuccessPanel from "./DesignSystemComponents/SuccessPanel";

function GroupAdmin(props) {
  let history = useHistory();
  const [userTableRows, setUserTableRowsRows] = useState([]);

  function openRemoveUserPage(groupUser) {
    history.push(
      `deleteuserfromgroupconfirmation?groupUserId=${groupUser.id}&groupName=${props.groupName}&groupId=${props.groupId}&userEmail=${groupUser.userEmail}`
    );
  }

  function openAddUserPage() {
    history.push(
      `addUserToGroup?groupName=${props.groupName}&groupId=${props.groupId}`
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
          <br />
          <br />
          <SuccessPanel>Removed user {props.deletedUserEmail}</SuccessPanel>
          <br />
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

export default GroupAdmin;
