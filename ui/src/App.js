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
    <div className="container container--wide page__container">
      <Helmet>
        <title>Response Operations</title>
      </Helmet>
      <div className="page__container container container--wide">
        <main id="main-content" className="page__main">
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
        <GroupAdmin groupId={query.get("groupId")}
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
  );
}

export default App;
