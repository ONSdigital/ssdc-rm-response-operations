import React from "react";
import { screen } from "@testing-library/react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { BrowserRouter as Router } from "react-router-dom";
import PrintTemplates from "./PrintTemplates";

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

it("renders print template data", async () => {
  const fakePrintTemplates = [
    {
      packCode: "Test Pack Code",
      printSupplier: "Test Print Supplier",
      template: ["__uac__"],
    },
  ];
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve(fakePrintTemplates),
    })
  );

  // Use the asynchronous version of act to apply resolved promises
  await act(async () => {
    render(
      <Router>
        <PrintTemplates authorisedActivities={[]} />
      </Router>,
      container
    );
  });

  const packCodeElement = screen.getByText(/Test Pack Code/i);
  expect(packCodeElement).toBeInTheDocument();

  const printSupplierElement = screen.getByText(/Test Print Supplier/i);
  expect(printSupplierElement).toBeInTheDocument();

  const printTemplateElement = screen.getByText('["__uac__"]');
  expect(printTemplateElement).toBeInTheDocument();

  // remove the mock to ensure tests are completely isolated
  global.fetch.mockRestore();
});
