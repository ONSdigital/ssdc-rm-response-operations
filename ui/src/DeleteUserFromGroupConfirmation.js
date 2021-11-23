import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import Announcer from "react-a11y-announcer";


function DeleteUserFromGroupConfirmation(props) {
  let history = useHistory();
  let removeAdminFromGroupInProgress = false;
  const [errorSummary, setErrorSummary] = useState([]);
  const errorSummaryTitle = useRef(null);
  const [hasErrors, setHasErrors] = useState(false);

  function cancel() {
    history.push(`/groupadmin?groupId=${props.groupId}&groupName=${props.groupName}`);
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
      history.push(`/groupadmin?groupId=${props.groupId}&groupName=${props.groupName}&deletedUserEmail=${props.userEmail}&flashMessageUntil=${Date.now() + 5000}`);
    }
    else {
      // hmmm shouldn't be permission, might be backend error.  Display a nice Error thingy
      setErrorSummary(['Failed to delete user :(']);
      setHasErrors(true);
    }
  }

  useEffect(() => {
    if (hasErrors) {
      document.title = "Error";
      errorSummaryTitle.current.focus();
    }
  }, [hasErrors]);

  function ErrorSummary() {
    const validationErrorInfoText = "There is 1 problem with this page"

    return (
      <div
        id="errorSummaryTitle"
        ref={errorSummaryTitle}
        aria-labelledby="error-summary-title"
        role="alert"
        tabIndex="-1"
        className="panel panel--error"
      >
        <Announcer text={"Error"} />
        <div className="panel__header">
          <h2 data-qa="error-header" className="panel__title u-fs-r--b">
            {validationErrorInfoText}
          </h2>
        </div>
        <div className="panel__body">
          <ol className="list">{errorSummary}</ol>
        </div>
      </div>
    );
  }


  return (
    <>
      <Helmet>
        <title>Delete user from Group</title>
      </Helmet>
      {errorSummary.length > 0 && <ErrorSummary />}
      <p>Are you sure you wish to remove {props.userEmail} user? from {props.groupName}</p>
      <button type="button" className="btn" onClick={removeUser}>
        <span className="btn__inner">Yes</span>
      </button>
      {/* Todo How to do a cancel button? */}
      <button type="button" className="btn" onClick={cancel}>
        <span className="btn__inner">Cancel</span>
      </button>
    </>
  )
}

export default DeleteUserFromGroupConfirmation;
