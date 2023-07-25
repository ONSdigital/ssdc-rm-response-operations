import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useHistory, useLocation } from "react-router-dom";
import Button from "./DesignSystemComponents/Button";
import ErrorSummary from "./DesignSystemComponents/ErrorSummary";
import Autosuggest from "react-autosuggest";
import Parser from "html-react-parser";
import "./AutoSuggest.css";
import PropTypes from "prop-types";

function AddUserToGroup(props) {
  let history = useHistory();
  const location = useLocation();

  const errorSummaryTitle = useRef(null);

  const [errorSummary, setErrorSummary] = useState([]);
  const [hasErrors, setHasErrors] = useState(false);
  const [value, setValue] = useState("");
  // Suggestions is tied to the AutoSuggest Component, it can be filted, mutated etc
  const [suggestions, setSuggestions] = useState([]);
  // We load userList this on the page load, we don't mutate it. We filter it to create Suggetions
  const [userList, setUserList] = useState([]);
  const [noSuggestions, setNoSuggestions] = useState(false);
  let addUserInProgress = false;

  useEffect(() => {
    async function fetchAvailableUsersForGroup() {
      const response = await fetch(`/api/users?groupId=${props.groupId}`);
      const usersJson = await response.json();

      /*
         React-AutoSuggest has the option of 'sections'
         In order to look a little like the design system lets use this to 
         create a Suggestions section
      */
      const users = [
        {
          title: "Suggestions",
          users: usersJson,
        },
      ];

      setUserList(users);
      setSuggestions(users);
    }

    fetchAvailableUsersForGroup();
  }, []);

  useEffect(() => {
    if (hasErrors) {
      document.title = "Error";
      errorSummaryTitle.current.focus();
    }
  }, [hasErrors]);

  function cancel() {
    history.push(
      encodeURI(
        `/groupadmin?groupId=${props.groupId}&groupName=${props.groupName}`
      )
    );
  }

  // The User can choose Add with a bad email address,
  // Or by cutting and pasting a valid email address.
  // Check it's in out list and get the UserId
  function checkEmailExistsAndGetUserId(userInput) {
    var matchingUser = userList[0].users.filter(
      (user) => user.email.toLowerCase() === userInput.toLowerCase()
    );

    if (matchingUser.length === 0) {
      return undefined;
    }

    return matchingUser[0].id;
  }

  function isEmailAlreadyInGroup(newEmail) {
    return (
      location.state.existingEmailsInGroup.filter(
        (existingEmail) =>
          existingEmail.toLowerCase() === newEmail.toLowerCase()
      ).length > 0
    );
  }

  async function addUserToGroup() {
    if (addUserInProgress) {
      return;
    }

    addUserInProgress = true;

    setErrorSummary([]);
    setHasErrors(false);

    if (isEmailAlreadyInGroup(value)) {
      setErrorSummary(["User is already a member of this group"]);
      setHasErrors(true);
      addUserInProgress = false;
      return;
    }

    const userId = checkEmailExistsAndGetUserId(value);

    if (userId === undefined) {
      setErrorSummary([
        "Please select a user to add by the autocomplete below",
      ]);
      setHasErrors(true);
      addUserInProgress = false;
      return;
    }

    const newUserGroupMember = {
      groupId: props.groupId,
      userId: userId,
    };

    const response = await fetch("/api/userGroupMembers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUserGroupMember),
    });

    if (response.ok) {
      history.push(
        encodeURI(
          `/groupadmin?groupId=${props.groupId}&groupName=${
            props.groupName
          }&addedUserEmail=${value}&flashMessageUntil=${Date.now() + 5000}`
        )
      );
    } else {
      setErrorSummary(["Failed to add user"]);
      setHasErrors(true);
    }

    addUserInProgress = false;
  }

  function escapeRegexCharacters(str) {
    return str.replace(/[*+?^${}()|[\]\\]/g, "\\$&");
  }

  const getSuggestions = (value) => {
    const escapedValue = escapeRegexCharacters(value.trim()).toLowerCase();

    if (escapedValue === "") {
      return [];
    }

    return userList
      .map((section) => {
        return {
          title: section.title,
          users: section.users.filter((user) =>
            user.email.toLowerCase().includes(escapedValue)
          ),
        };
      })
      .filter((section) => section.users.length > 0);
  };

  const getSuggestionValue = (suggestion) => {
    return suggestion.email;
  };

  function renderSuggestion(suggestion) {
    // This is a cheap and simple implementation of highlighting the matched text
    // We use a Parser to turn this into valid JSX
    // Look here https://codepen.io/moroshko/pen/PZWbzK for a fancier set of formatting
    // if required in future

    var boldedText = suggestion.email.replace(
      value,
      "<strong>" + value + "</strong>"
    );
    return <>{Parser(boldedText)}</>;
  }

  function renderSectionTitle(section) {
    return (
      <div className="auto-suggest-section-title">
        <span>{section.title}</span>
      </div>
    );
  }

  const onChange = (event, { newValue }) => {
    setValue(newValue);
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    const suggestions = getSuggestions(value);
    setSuggestions(suggestions);

    const isInputBlank = value.trim() === "";
    const noSuggestions = !isInputBlank && suggestions.length === 0;
    setNoSuggestions(noSuggestions);
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  function getSectionSuggestions(section) {
    return section.users;
  }

  // Autosuggest will pass through all these props to the input.
  const inputProps = {
    placeholder: "Type a users email",
    value,
    onChange: onChange,
  };

  return (
    <>
      <div style={{ marginBottom: 150 }}>
        <Helmet>
          <title>Add User To Group</title>
        </Helmet>
        <Link
          to={encodeURI(
            `/groupadmin?groupId=${props.groupId}&groupName=${props.groupName}`
          )}
        >
          ← Back to group admin
        </Link>
        {errorSummary.length > 0 && (
          <ErrorSummary errorSummary={errorSummary} ref={errorSummaryTitle} />
        )}
        <h1>Add User To Group {props.groupName}</h1>
        <div className="ons-field">
          <h2>Select a user to add to the group</h2>
          <Autosuggest
            multiSection={true}
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSectionTitle={renderSectionTitle}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
            getSectionSuggestions={getSectionSuggestions}
          />
          {noSuggestions && (
            <div className="no-suggestions">No suggestions</div>
          )}
        </div>
        <br />

        <Button onClick={() => addUserToGroup()}>Yes</Button>
        <Button onClick={() => cancel()} secondary>
          Cancel
        </Button>
      </div>
    </>
  );
}

AddUserToGroup.propTypes = {
  groupId: PropTypes.string.isRequired,
  groupName: PropTypes.string.isRequired,
};

export default AddUserToGroup;
