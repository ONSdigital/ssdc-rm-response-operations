import { Link } from "react-router-dom";

function Home(props) {
  return (
    <>
      <h2>Home</h2>
      {props.authorisedActivities.includes("LIST_SURVEYS") && (
        <p>
          <Link to="/surveys">Surveys</Link>
        </p>
      )}
    </>
  );
}

export default Home;
