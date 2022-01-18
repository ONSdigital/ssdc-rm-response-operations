import Announcer from "react-a11y-announcer";
import React, { forwardRef } from "react";
import PropTypes from 'prop-types';

const ErrorSummary = (props, ref) => (
  <div
    id="errorSummaryTitle"
    ref={ref}
    aria-labelledby="error-summary-title"
    role="alert"
    tabIndex="-1"
    className="ons-panel ons-panel--error"
  >
    <Announcer text={"Error"} />
    <div className="ons-panel__header">
      <h2 data-qa="ons-error-header" className="ons-panel__title ons-u-fs-r--b">
        {props.errorSummary.length === 1
          ? "There is 1 problem with this page"
          : `There are ${props.errorSummary.length} problems with this page`}
      </h2>
    </div>
    <div className="ons-panel__body">
      <ol className="ons-list">{props.errorSummary}</ol>
    </div>
  </div>
);

ErrorSummary.propTypes = {
  errorSummary: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default forwardRef(ErrorSummary);
