import React, { forwardRef } from "react";
import PropTypes from 'prop-types';

const RadioBtnGroup = (props, ref) => {
  return (
    <div className="ons-question ons-u-mt-no">
      <fieldset className="ons-fieldset" ref={ref} onChange={props.onChange}>
        <legend className="ons-fieldset__legend">
          <h1
            id="fieldset-legend-title"
            className="ons-fieldset__legend-title "
          >
            {props.legend}
          </h1>
        </legend>
        <div className="ons-input-items">
          <div className="ons-radios__items">{props.children}</div>
        </div>
      </fieldset>
    </div>
  );
};

RadioBtnGroup.propTypes = {
  onChange: PropTypes.func,
  legend: PropTypes.string,
  children: PropTypes.object
}

export default forwardRef(RadioBtnGroup);
