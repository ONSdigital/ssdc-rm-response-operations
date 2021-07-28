import React from "react";
import { screen } from "@testing-library/react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { BrowserRouter as Router } from "react-router-dom";
import NotFound from "./NotFound";

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

it("renders not found", async () => {
  // Use the asynchronous version of act to apply resolved promises
  await act(async () => {
    render(
      <Router>
        <NotFound />
      </Router>,
      container
    );
  });

  const notFoundElement = screen.getByText(/Page not found/i);
  expect(notFoundElement).toBeInTheDocument();
});
