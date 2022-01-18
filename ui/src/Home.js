import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";
import ExtraPropTypes from 'react-extra-prop-types';

function Home(props) {
  const [usersAdminGroups, SetUsersAdminGroups] = useState([]);

  useEffect(() => {
    async function fetchGroupsUserAdminOf() {
      const response = await fetch("/api/userGroups/thisUserAdminGroups");
      const userAdminGroupsJson = await response.json();

      SetUsersAdminGroups(userAdminGroupsJson);
    }

    fetchGroupsUserAdminOf();
  }, []);

  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>
      <h2>Home</h2>
      {props.authorisedActivities.includes("LIST_SURVEYS") && (
        <p>
          <Link to="/surveys">Surveys</Link>
        </p>
      )}
      {props.authorisedActivities.includes("LIST_EXPORT_FILE_TEMPLATES") && (
        <p>
          <Link to="/exportfiletemplates">Export File Templates</Link>
        </p>
      )}
      {usersAdminGroups.length > 0 && (
        <p>
          <Link to="/mygroupsadmin">My Groups Admin</Link>
        </p>
      )}
    </>
  );
}

Home.propTypes = {
  authorisedActivities: PropTypes.array,
  flashMessageUntil: ExtraPropTypes.datetime,
}

export default Home;
