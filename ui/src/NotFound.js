import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

function NotFound() {
  return (
    <>
      <Helmet>
        <title>Page Not Found</title>
      </Helmet>
      <h2>Page not found</h2>
      <Link to="/">Go to homepage</Link>
    </>
  );
}

export default NotFound;
