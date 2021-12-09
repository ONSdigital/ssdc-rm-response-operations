import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import Announcer from "react-a11y-announcer";
import { Link } from "react-router-dom";
import Button from "./DesignSytemComponents/Button";
import ErrorSummary from "./DesignSytemComponents/ErrorSummary";

function DeleteUserFromGroupConfirmation(props) {
  let history = useHistory();
  let removeAdminFromGroupInProgress = false;
  const [errorSummary, setErrorSummary] = useState([]);
  const errorSummaryTitle = useRef(null);
  const [hasErrors, setHasErrors] = useState(false);

  function cancel() {
    history.push(
      `/groupadmin?groupId=${props.groupId}&groupName=${props.groupName}`
    );
  }

  async function removeUser() {
    if (removeAdminFromGroupInProgress) {
      return;
    }

    removeAdminFromGroupInProgress = true;

    const response = await fetch(`/api/userGroupMembers/${props.groupUserId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      history.push(
        `/groupadmin?groupId=${props.groupId}&groupName=${props.groupName
        }&deletedUserEmail=${props.userEmail}&flashMessageUntil=${Date.now() + 5000
        }`
      );
    } else {
      // we need to decide on a standard - unexpected backend error strategy/page?
      setErrorSummary(["Failed to delete user"]);
      setHasErrors(true);
    }
  }

  useEffect(() => {
    if (hasErrors) {
      document.title = "Error";
      errorSummaryTitle.current.focus();
    }
  }, [hasErrors]);

  return (
    <>
      <Helmet>
        <title>Remove User From Group</title>
      </Helmet>
      <Announcer text={"User Removal Confirmation Page"} />
      <Link
        to={`/groupadmin?groupId=${props.groupId}&groupName=${props.groupName}`}
      >
        ← Back to group admin
      </Link>
      {errorSummary.length > 0 && <ErrorSummary errorSummary={errorSummary} ref={errorSummaryTitle} />}
      <h2>User Removal Confirmation Page</h2>
      <p>
        Do you wish to remove user {props.userEmail} from group{" "}
        {props.groupName}?
      </p>
      <Button onClick={removeUser}>Yes</Button>
      <Button onClick={cancel} secondary>Cancel</Button>
    </>
  );
}

export default DeleteUserFromGroupConfirmation;
