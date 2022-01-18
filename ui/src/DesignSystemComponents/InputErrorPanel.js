import React from "react";
import PropTypes from 'prop-types';

function InputErrorPanel(props) {
  return (
    <div
      className="ons-panel ons-panel--error ons-panel--no-title ons-u-mb-s"
      id={props.id}
    >
      <span className="ons-u-vh">Error: </span>
      <div className="ons-panel__body">
        <p className="ons-panel__error">
          <strong>{props.errorSummary}</strong>
        </p>
        <div className="ons-field">{props.children}</div>
      </div>
    </div>
  );
}

InputErrorPanel.propTypes = {
  id: PropTypes.string.isRequired,
  errorSummary: PropTypes.string.isRequired,
  children: PropTypes.object.isRequired
}

export default InputErrorPanel;
