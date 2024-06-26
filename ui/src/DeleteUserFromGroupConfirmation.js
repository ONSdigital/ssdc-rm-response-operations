import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Button from "./DesignSystemComponents/Button";
import ErrorSummary from "./DesignSystemComponents/ErrorSummary";
import PropTypes from "prop-types";

function DeleteUserFromGroupConfirmation(props) {
  let navigate = useNavigate();
  let removeAdminFromGroupInProgress = false;
  const [errorSummary, setErrorSummary] = useState([]);
  const errorSummaryTitle = useRef(null);
  const [hasErrors, setHasErrors] = useState(false);

  function cancel() {
    navigate(
      `/groupadmin?groupId=${props.groupId}&groupName=${props.groupName}`,
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
      navigate(
        `/groupadmin?groupId=${props.groupId}&groupName=${
          props.groupName
        }&deletedUserEmail=${props.userEmail}&flashMessageUntil=${
          Date.now() + 5000
        }`,
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
      <Link
        to={`/groupadmin?groupId=${props.groupId}&groupName=${props.groupName}`}
      >
        ← Back to group admin
      </Link>
      {errorSummary.length > 0 && (
        <ErrorSummary errorSummary={errorSummary} ref={errorSummaryTitle} />
      )}
      <h2>User Removal Confirmation Page</h2>
      <p>
        Do you wish to remove user {props.userEmail} from group{" "}
        {props.groupName}?
      </p>

      <Button onClick={() => removeUser()}>Yes</Button>
      <Button onClick={() => cancel()} secondary>
        Cancel
      </Button>
    </>
  );
}

DeleteUserFromGroupConfirmation.propTypes = {
  groupId: PropTypes.string.isRequired,
  groupName: PropTypes.string.isRequired,
  userEmail: PropTypes.string.isRequired,
  groupUserId: PropTypes.string.isRequired,
};

export default DeleteUserFromGroupConfirmation;
