import React from "react";
import { screen } from "@testing-library/react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { BrowserRouter as Router } from "react-router-dom";
import CreateSurvey from "./CreateSurvey";

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

it("renders create survey", async () => {
  // Use the asynchronous version of act to apply resolved promises
  await act(async () => {
    render(
      <Router>
        <CreateSurvey />
      </Router>,
      container
    );
  });

  const createSurveyButtonElement = screen.getByText(/Create Survey/i);
  expect(createSurveyButtonElement).toBeInTheDocument();
});
