import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
} from "react-router-dom";
import DocumentTitle from "react-document-title";
import Home from "./Home";
import CreateSurvey from "./CreateSurvey";
import Surveys from "./Surveys";
import ViewSurvey from "./ViewSurvey";
import PrintTemplates from "./PrintTemplates";
import NotFound from "./NotFound";
import CreatePrintTemplate from "./CreatePrintTemplate";

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
    <DocumentTitle title="Response Operations">
      <div className="container container--wide page__container">
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
    </DocumentTitle>
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
        <DocumentTitle title="Home">
          <Home authorisedActivities={props.authorisedActivities} />
        </DocumentTitle>
      </Route>
      <Route path="/surveys">
        <DocumentTitle title="Surveys">
          <Surveys
            authorisedActivities={props.authorisedActivities}
            flashMessageUntil={query.get("flashMessageUntil")}
          />
        </DocumentTitle>
      </Route>
      <Route path="/createsurvey">
        <DocumentTitle title="Create Survey">
          <CreateSurvey />
        </DocumentTitle>
      </Route>
      <Route path="/viewsurvey">
        <DocumentTitle title="View Survey">
          <ViewSurvey surveyId={query.get("surveyId")} />
        </DocumentTitle>
      </Route>
      <Route path="/printtemplates">
        <DocumentTitle title="View Print Templates">
          <PrintTemplates
            authorisedActivities={props.authorisedActivities}
            flashMessageUntil={query.get("flashMessageUntil")}
          />
        </DocumentTitle>
      </Route>
      <Route path="/createprinttemplate">
        <DocumentTitle title="Create Print Template">
          <CreatePrintTemplate />
        </DocumentTitle>
      </Route>
      <Route path="*">
        <DocumentTitle title="Page Not Found">
          <NotFound />
        </DocumentTitle>
      </Route>
    </Switch>
  );
}

export default App;
