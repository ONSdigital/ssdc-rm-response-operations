import React from "react";
import { screen } from "@testing-library/react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { BrowserRouter as Router } from "react-router-dom";
import DeleteUserFromGroupConfirmation from "./DeleteUserFromGroupConfirmation";
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

it("renders user to delete", async () => {
  // Use the asynchronous version of act to apply resolved promises
  await act(async () => {
    render(
      <Router>
        <DeleteUserFromGroupConfirmation
          userEmail="test@email.com"
          groupName="test-group"
          groupId={uuid()}
          groupUserId={uuid()}
        />
      </Router>,
      container,
    );
  });

  const emailNameElement = screen.getByText(/test@email.com/);
  expect(emailNameElement).toBeInTheDocument();

  const groupNameElement = screen.getByText(/test-group/);
  expect(groupNameElement).toBeInTheDocument();
});
