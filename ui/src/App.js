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
import NotFound from "./NotFound";

function App() {
  const [authorisedActivities, setAuthorisedActivities] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/auth");
      const authorisedActivities = await response.json();

      setAuthorisedActivities(authorisedActivities);
    }
    fetchData();
  }, [authorisedActivities]);
  return (
    <div className="container container--wide page__container">
      <div className="page__container container container--wide">
        <main id="main-content" className="page__main">
          <Router>
            <QueryRouting authorisedActivities={authorisedActivities} />
          </Router>
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
      <Route path="*">
        <NotFound />
      </Route>
    </Switch>
  );
}

export default App;
