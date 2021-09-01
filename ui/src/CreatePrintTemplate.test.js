import React from "react";
import { screen } from "@testing-library/react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { BrowserRouter as Router } from "react-router-dom";
import CreatePrintTemplate from "./CreatePrintTemplate";

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

it("renders create print template", async () => {
  const fakePrintSupplier = ["SUPPLIER_A"];
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve(fakePrintSupplier),
    })
  );

  // Use the asynchronous version of act to apply resolved promises
  await act(async () => {
    render(
      <Router>
        <CreatePrintTemplate />
      </Router>,
      container
    );
  });

  const createPrintTemplateButtonElement = screen.getByText(
    /Create Print Template/i
  );
  expect(createPrintTemplateButtonElement).toBeInTheDocument();

  const printSupplier = screen.getByText(/SUPPLIER_A/i);
  expect(printSupplier).toBeInTheDocument();
});
