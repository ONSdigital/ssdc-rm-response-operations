import React from "react";
import { screen } from "@testing-library/react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import ViewSurvey from "./ViewSurvey";
import { uuid } from "uuidv4";

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

it("renders survey data", async () => {
  const fakeSurvey = {
    name: "Test Survey",
  };

  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve(fakeSurvey),
    })
  );

  // Use the asynchronous version of act to apply resolved promises
  await act(async () => {
    render(<ViewSurvey surveyId={uuid()} />, container);
  });

  const surveyNameElement = screen.getByText(/Test Survey/i);
  expect(surveyNameElement).toBeInTheDocument();

  // remove the mock to ensure tests are completely isolated
  global.fetch.mockRestore();
});
