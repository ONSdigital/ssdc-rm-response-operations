import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import Announcer from "react-a11y-announcer";
import { Link } from "react-router-dom";
import Button from "./DesignSystemComponents/Button";
import ErrorSummary from "./DesignSystemComponents/ErrorSummary";
import Autosuggest from 'react-autosuggest';

function AddUserToGroup(props) {
  let history = useHistory();
  let addUserInProgress = false;
  const [errorSummary, setErrorSummary] = useState([]);
  const errorSummaryTitle = useRef(null);
  const [hasErrors, setHasErrors] = useState(false);
  const [value, setValue] = useState("");
  // Suggestions is tied to the AutoSuggest Component, it can be filted, mutated etc
  const [suggestions, setSuggestions] = useState([]);
  // We load userList this on the page load, we don't change it. We filter it to create Suggetions
  const [userList, setUserList] = useState([]);


  useEffect(() => {
    async function fetchUsers() {
      const response = await fetch(`/api/users?groupId=${props.groupId}`);
      const usersJson = await response.json();

      const users = [
        {
          title: 'Suggestions',
          users: usersJson

        }
      ];

      setUserList(users);
      setSuggestions(users);
    }

    fetchUsers();
  }, []);

  function cancel() {
    history.push(
      `/groupadmin?groupId=${props.groupId}&groupName=${props.groupName}`
    );
  }

  // The User can choose Add with a bad email address,
  // Or by cutting and pasting a valid email address.
  // Check it's in out list and get the UserId
  function checkEmailExistsAndGetUserId(userInput) {
    const usersToCheck = userList[0].users;
    for (var i = 0; i < usersToCheck.length; i++) {
      if (usersToCheck[i].email === userInput) {
        return usersToCheck[i].id;
      }
    }

    return undefined;
  }

  async function addUserToGroup() {
    if (addUserInProgress) {
      return;
    }

    addUserInProgress = true;

    setErrorSummary('');
    setHasErrors(false);

    const userId = checkEmailExistsAndGetUserId(value);

    if (userId === undefined) {
      setErrorSummary(["Please select a user to add by the autocomplete below"]);
      setHasErrors(true);
      addUserInProgress = false;
      return;
    }

    const newuUserGroupMember = {
      groupId: props.groupId,
      userId: userId
    };

    const response = await fetch("/api/userGroupMembers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newuUserGroupMember),
    });

    if (response.ok) {
      history.push(
        `/groupadmin?groupId=${props.groupId}&groupName=${props.groupName}`
      );
      // history.push(`/surveys?flashMessageUntil=${Date.now() + 5000}`);
    }
    else {
      setErrorSummary(["Failed to add user"]);
      setHasErrors(true);
    }

    addUserInProgress = false;
  }

  useEffect(() => {
    if (hasErrors) {
      document.title = "Error";
      errorSummaryTitle.current.focus();
    }
  }, [hasErrors]);

  function escapeRegexCharacters(str) {
    return str.replace(/[*+?^${}()|[\]\\]/g, '\\$&');
  }

  const getSuggestions = value => {
    const escapedValue = escapeRegexCharacters(value.trim()).toLowerCase();

    if (escapedValue === '') {
      return [];
    }

    return userList
      .map(section => {
        return {
          title: section.title,
          // users: section.users.filter(user => regex.test(user.email))
          users: section.users.filter(user => user.email.toLowerCase().includes(escapedValue))
        };
      })
      .filter(section => section.users.length > 0);
  };

  const getSuggestionValue = suggestion => {
    return suggestion.email;
  }

  function renderSuggestion(suggestion) {
    return (
      <strong>{suggestion.email}</strong>
    );
  }

  function renderSectionTitle(section) {
    return (
      <span className="auto-suggest-section-title"> {section.title}</span>
    );
  }

  const onChange = (event, { newValue }) => {
    setValue(newValue);
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    const suggestions = getSuggestions(value);
    setSuggestions(suggestions);
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  function getSectionSuggestions(section) {
    return section.users;
  }

  // Autosuggest will pass through all these props to the input.
  const inputProps = {
    placeholder: 'Type a users email',
    value,
    onChange: onChange
  };

  return (
    <>
      <Helmet>
        <title>Add User To Group</title>
      </Helmet>
      <Announcer text={"Add User Page Page"} />
      <Link
        to={`/groupadmin?groupId=${props.groupId}&groupName=${props.groupName}`}
      >
        ← Back to group admin
      </Link>
      {errorSummary.length > 0 && (
        <ErrorSummary errorSummary={errorSummary} ref={errorSummaryTitle} />
      )}
      <h1>Add User To Group {props.groupName} Page</h1>

      <div className='ons-field'>
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
      </div>
      <br />

      <Button onClick={() => addUserToGroup()}>Yes</Button>
      <Button onClick={() => cancel()} secondary>
        Cancel
      </Button>
    </>
  );
}

export default AddUserToGroup;
