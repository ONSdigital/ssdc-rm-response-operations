import React from "react";
import { screen } from "@testing-library/react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { BrowserRouter as Router } from "react-router-dom";
import CreateExportFileTemplate from "./CreateExportFileTemplate";

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

it("renders create export file template", async () => {
  const fakeexportFileDestination = ["SUPPLIER_A"];
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve(fakeexportFileDestination),
    })
  );

  // Use the asynchronous version of act to apply resolved promises
  await act(async () => {
    render(
      <Router>
        <CreateExportFileTemplate />
      </Router>,
      container
    );
  });

  const createExportFileTemplateButtonElement = screen.getByText(
    /Create Export File Template/i
  );
  expect(createExportFileTemplateButtonElement).toBeInTheDocument();

  const exportFileDestination = screen.getByText(/SUPPLIER_A/i);
  expect(exportFileDestination).toBeInTheDocument();

  global.fetch.mockRestore();
});
