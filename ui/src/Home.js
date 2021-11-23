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
      {props.authorisedActivities.includes("LIST_EXPORT_FILE_TEMPLATES") && (
        <p>
          <Link to="/exportfiletemplates">Export File Templates</Link>
        </p>
      )}
      {(
        <p>
          <Link to="/mygroupsadmin">My Groups Admin</Link>
        </p>
      )}
    </>
  );
}

export default Home;
