import React from "react";
import { screen } from "@testing-library/react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { BrowserRouter as Router } from "react-router-dom";
import DeleteUserFromGroupConfirmation from "./DeleteUserFromGroupConfirmation";

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

it("renders My admin groups", async () => {
  const fakeMyGroups = [
    {
      id: "fake-id",
      name: "test-group"
    },
  ];

  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve(fakeMyGroups),
    })
  );

  // Use the asynchronous version of act to apply resolved promises
  await act(async () => {
    render(
      <Router>
        <DeleteUserFromGroupConfirmation />
      </Router>,
      container
    );
  });

  const groupNameElement = screen.getByText(/test-group/);
  expect(groupNameElement).toBeInTheDocument();

  // remove the mock to ensure tests are completely isolated
  global.fetch.mockRestore();
});
