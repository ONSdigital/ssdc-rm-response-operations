import React from "react";
import { screen } from "@testing-library/react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { BrowserRouter as Router } from "react-router-dom";
import ExportFileTemplates from "./ExportFileTemplates";

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

it("renders export file template data", async () => {
  const fakeExportFileTemplates = [
    {
      packCode: "Test Pack Code",
      exportFileDestination: "Test Export File Destination",
      template: ["__uac__"],
    },
  ];

  const spy = jest.spyOn("fetch").mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve(fakeExportFileTemplates),
    })
  );

  // Use the asynchronous version of act to apply resolved promises
  await act(async () => {
    render(
      <Router>
        <ExportFileTemplates authorisedActivities={[]} />
      </Router>,
      container
    );
  });

  const packCodeElement = screen.getByText(/Test Pack Code/i);
  expect(packCodeElement).toBeInTheDocument();

  const exportFileDestinationElement = screen.getByText(
    /Test Export File Destination/i
  );
  expect(exportFileDestinationElement).toBeInTheDocument();

  const exportFileTemplateElement = screen.getByText('["__uac__"]');
  expect(exportFileTemplateElement).toBeInTheDocument();

  // remove the mock to ensure tests are completely isolated
  spy.mockRestore();
});
