import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { BrowserRouter as Router } from "react-router-dom";
import CreateSurvey from "./CreateSurvey";
import fetchMock from "jest-fetch-mock";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
  fetchMock.enableMocks();
  fetchMock.mockClear();
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
  jest.restoreAllMocks();
});

it("renders create survey", async () => {
  const surveyTypes = ["Social"];
  jest.spyOn(global, "fetch").mockImplementationOnce(() =>
    Promise.resolve({
      json: () => Promise.resolve(surveyTypes),
    })
  );
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

it("Creating a survey called Test_survey", async () => {
  const expectedPostRequest = '{"name":"Test_survey","surveyType":"Social"}';

  // Mocking the initial fetch to return a radio list option of Social, Business and Health
  const surveyTypes = ["Social", "Business", "Health"];
  jest.spyOn(global, "fetch").mockImplementationOnce(() =>
    Promise.resolve({
      json: () => Promise.resolve(surveyTypes),
    })
  );

  // Mocking the second fetch to return a response ok for the post
  const fetchResponse = fetchMock.mockResponse(
    JSON.stringify({ statusText: "success" }),
    { status: 200 }
  );

  // Use the asynchronous version of act to apply resolved promises
  await act(async () => {
    render(
      <Router>
        <CreateSurvey />
      </Router>,
      container
    );
  });

  // Naming the survey on the page
  const surveyNameElement = screen.getByLabelText(/Enter a survey name/i);
  fireEvent.change(surveyNameElement, { target: { value: "Test_survey" } });
  expect(surveyNameElement.value).toBe("Test_survey");

  // Check the radio button is not initially selected and then click the social option
  const surveyButtonRadio = screen.getByLabelText(/Social/i);
  expect(surveyButtonRadio).not.toBeChecked();
  fireEvent.click(surveyButtonRadio);
  expect(surveyButtonRadio).toBeChecked();

  // Submit the request to create a survey. We await the request so it completes and we can then do the assertions
  const surveyButton = screen.getByRole(/button/i);
  await fireEvent.click(surveyButton);

  // Now that the request has been made, this is checking that the url is different and the post request is as expected
  expect(fetchResponse).toBeCalledTimes(2);
  expect(global.window.location.pathname).toEqual("/surveys");
  expect(global.window.location.search).toContain("?flashMessageUntil");
  expect(String(fetchResponse.mock.calls[1][1].body)).toEqual(
    expectedPostRequest
  );
});
