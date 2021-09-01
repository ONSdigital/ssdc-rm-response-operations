import React from "react";
import { screen } from "@testing-library/react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { BrowserRouter as Router } from "react-router-dom";
import Home from "./Home";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("renders home page", async () => {
  // Use the asynchronous version of act to apply resolved promises
  await act(async () => {
    render(
      <Router>
        <Home authorisedActivities={["LIST_SURVEYS", "LIST_PRINT_TEMPLATES"]} />
      </Router>,
      container
    );
  });

  const surveysLinkElement = screen.getByText(/Surveys/i);
  expect(surveysLinkElement).toBeInTheDocument();

  const printTemplatesLinkElement = screen.getByText(/Print Templates/i);
  expect(printTemplatesLinkElement).toBeInTheDocument();
});
