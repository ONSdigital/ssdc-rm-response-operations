import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
} from "react-router-dom";
import Home from "./Home";
import CreateSurvey from "./CreateSurvey";
import Surveys from "./Surveys";
import ViewSurvey from "./ViewSurvey";
import ExportFileTemplates from "./ExportFileTemplates";

import NotFound from "./NotFound";
import CreateExportFileTemplate from "./CreateExportFileTemplate";
import { Helmet } from "react-helmet";
import GroupAdmin from "./GroupAdmin";
import DeleteUserFromGroupConfirmation from "./DeleteUserFromGroupConfirmation";
import MyGroupsAdmin from "./MyGroupsAdmin";

function App() {
  const [loading, setLoading] = useState(true);
  const [authorisedActivities, setAuthorisedActivities] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/auth");
      setLoading(false);

      if (response.ok) {
        const authorisedActivities = await response.json();

        setAuthorisedActivities(authorisedActivities);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="ons-container ons-container--wide ons-page__container">
      <Helmet>
        <title>Response Operations</title>
      </Helmet>
      <div className="ons-page__container ons-container ons-container--wide">
        <main id="main-content" className="ons-page__main">
          {authorisedActivities.length === 0 && !loading && (
            <p>User not authorised</p>
          )}
          {authorisedActivities.length > 0 && (
            <Router>
              <QueryRouting authorisedActivities={authorisedActivities} />
            </Router>
          )}
        </main>
      </div>
    </div>
  );
}

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function QueryRouting(props) {
  let query = useQuery();

  return (
    <>
      <div className="ons-grid ons-grid--gutterless">
        <div className="ons-grid__col ons-col-8@m">
          <div id="country-of-birth-container"
            className="ons-js-autosuggest   ons-autosuggest-input"
            data-instructions="Use up and down keys to navigate suggestions once you&#39;ve typed more than two characters. Use the enter key to select a suggestion. Touch device users, explore by touch or with swipe gestures."
            data-aria-you-have-selected="You have selected" data-min-chars=""
            data-aria-min-chars="Enter 3 or more characters for suggestions."
            data-aria-one-result="There is one suggestion available."
            data-aria-n-results="There are {n} suggestions available."
            data-aria-limited-results="Results have been limited to 10 suggestions. Type more characters to improve your search"
            data-more-results="Continue entering to improve suggestions"
            data-results-title="Suggestions"
            data-no-results="No suggestions found. You can enter your own answer"
            data-type-more="Continue entering to get suggestions"
            data-autosuggest-data="https://gist.githubusercontent.com/rmccar/c123023fa6bd1b137d7f960c3ffa1fed/raw/4dede1d6e757cf0bb836228600676c62ceb4f86c/country-of-birth.json">
            <div className="ons-field">
              <label className="ons-label  ons-label--with-description "
                htmlFor="country-of-birth" id="country-of-birth-label">Current name of
                country
              </label>
              <span id="country-of-birth-label-description-hint"
                className="ons-label__description  ons-input--with-description">
                Enter your own answer or select from suggestions
              </span>
              <input type="text" id="country-of-birth"
                className="ons-input ons-input--text ons-input-type__input ons-js-autosuggest-input "
                autoComplete="off"
                aria-describedby="country-of-birth-label-description-hint" />
            </div>
            <div className="ons-autosuggest-input__results ons-js-autosuggest-results">
              <header id="country-of-birth-suggestions"
                className="ons-autosuggest-input__results-title ons-u-fs-s">Suggestions
              </header>
              <ul className="ons-autosuggest-input__listbox ons-js-autosuggest-listbox"
                role="listbox" id="country-of-birth-listbox"
                aria-labelledby="country-of-birth-suggestions" tabIndex="-1"></ul>
            </div>
            <div className="ons-autosuggest-input__instructions ons-u-vh ons-js-autosuggest-instructions"
              id="country-of-birth-instructions" tabIndex="-1">Use up and down keys to
              navigate suggestions once you&#39;ve typed more than two characters. Use the
              enter key to select a suggestion. Touch device users, explore by touch or
              with swipe gestures.</div>
            <div className="ons-autosuggest-input__status ons-u-vh ons-js-autosuggest-aria-status"
              aria-live="assertive" role="status" tabIndex="-1"></div>
          </div>
        </div>
      </div>
      <Switch>
        <Route exact path="/">
          <Home authorisedActivities={props.authorisedActivities} />
        </Route>
        <Route path="/surveys">
          <Surveys
            authorisedActivities={props.authorisedActivities}
            flashMessageUntil={query.get("flashMessageUntil")}
          />
        </Route>
        <Route path="/createsurvey">
          <CreateSurvey />
        </Route>
        <Route path="/viewsurvey">
          <ViewSurvey surveyId={query.get("surveyId")} />
        </Route>
        <Route path="/exportfiletemplates">
          <ExportFileTemplates
            authorisedActivities={props.authorisedActivities}
            flashMessageUntil={query.get("flashMessageUntil")}
          />
        </Route>
        <Route path="/createexportfiletemplate">
          <CreateExportFileTemplate />
        </Route>
        <Route path="/mygroupsadmin">
          <MyGroupsAdmin />
        </Route>
        <Route path="/groupadmin">
          <GroupAdmin
            groupId={query.get("groupId")}
            groupName={query.get("groupName")}
            flashMessageUntil={query.get("flashMessageUntil")}
            deletedUserEmail={query.get("deletedUserEmail")}
          />
        </Route>
        <Route path="/deleteuserfromgroupconfirmation">
          <DeleteUserFromGroupConfirmation
            groupUserId={query.get("groupUserId")}
            groupName={query.get("groupName")}
            groupId={query.get("groupId")}
            userEmail={query.get("userEmail")}
          />
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </>
  );
}

export default App;
