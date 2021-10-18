import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

function Home(props) {
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
      {props.authorisedActivities.includes("LIST_PRINT_TEMPLATES") && (
        <p>
          <Link to="/printtemplates">Print Templates</Link>
        </p>
      )}
    </>
  );
}

export default Home;
