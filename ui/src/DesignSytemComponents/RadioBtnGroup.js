import React, { forwardRef } from "react";

const RadioBtnGroup = (props, ref) => {
  return (
    <div className="ons-question ons-u-mt-no">
      <fieldset className="ons-fieldset" ref={ref} onChange={props.onChange}>
        <legend className="ons-fieldset__legend">
          <h1 id="fieldset-legend-title" className="ons-fieldset__legend-title ">
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

export default forwardRef(RadioBtnGroup);
