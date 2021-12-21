import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Announcer from "react-a11y-announcer";
import { Link } from "react-router-dom";
import Table from "./DesignSystemComponents/Table";
import TableHead from "./DesignSystemComponents/TableHead";
import TableHeaderCell from "./DesignSystemComponents/TableHeaderCell";
import TableCell from "./DesignSystemComponents/TableCell";
import TableBody from "./DesignSystemComponents/TableBody";
import TableRow from "./DesignSystemComponents/TableRow";
import Autosuggest from 'react-autosuggest';

function MyGroupsAdmin() {
  const [tableRows, setTableRows] = useState([]);
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);


  useEffect(() => {
    async function fetchGroupsUserAdminOf() {
      const response = await fetch("/api/userGroups/thisUserAdminGroups");

      const userAdminGroupsJson = await response.json();

      const tableRows = await userAdminGroupsJson.map((group, index) => (
        <TableRow key={index}>
          <TableCell>
            <Link
              to={`/groupadmin?groupId=${group.id}&groupName=${group.name}`}
            >
              {group.name}
            </Link>
          </TableCell>
          <TableCell>{group.description}</TableCell>
        </TableRow>
      ));
      setTableRows(tableRows);
    }

    fetchGroupsUserAdminOf();

  }, []);


  const languages = [
    {
      name: 'Ada',
      year: 1972
    },
    {
      name: 'Java',
      year: 2012
    },
    {
      name: 'Python',
      year: 1901
    },
    {
      name: 'R',
      year: 2012
    },
    {
      name: 'Rust',
      year: 1972
    },
    {
      name: 'Fortran',
      year: 2012
    }
  ];

  // Teach Autosuggest how to calculate suggestions for any given input value.
  const getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    if (inputLength === 0) {
      return [];
    }

    return languages.filter(lang =>
      lang.name.toLowerCase().includes(inputValue)
    );
  };

  // When suggestion is clicked, Autosuggest needs to populate the input
  // based on the clicked suggestion. Teach Autosuggest how to calculate the
  // input value for every given suggestion.
  const getSuggestionValue = suggestion => suggestion.name;

  // Use your imagination to render suggestions.
  const renderSuggestion = suggestion => (
    <div>
      {suggestion.name}
    </div>
  );

  function onChange(event, { newValue }) {
    setValue(newValue);
  }

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  function onSuggestionsFetchRequested({ value }) {
    setSuggestions(getSuggestions(value));
  }

  // Autosuggest will call this function every time you need to clear suggestions.
  function onSuggestionsClearRequested() {
    setSuggestions([]);
  }

  // Autosuggest will pass through all these props to the input.
  const inputProps = {
    placeholder: 'Type a programming language',
    value,
    onChange: onChange
  };

  return (
    <>
      <Helmet>
        <title>My Admin Groups</title>
      </Helmet>
      <Announcer text={"My Admin Groups"} />
      <Link to="/">← Back to home</Link>
      <h2>My Admin Groups</h2>

      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Group Name</TableHeaderCell>
            <TableHeaderCell>Group Description</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>{tableRows}</TableBody>
      </Table>

      <h2>Off the Shelve AutoSuggest</h2>
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />

    </>
  );
}

export default MyGroupsAdmin;
