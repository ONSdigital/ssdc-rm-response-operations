import React, { forwardRef } from "react";

const TextInput = (props, ref) => (
  <div className="ons-field">
    <label className="ons-label" htmlFor="text" htmlFor={props.id}>
      {props.label}{" "}
    </label>
    <input
      type="text"
      id={props.id}
      className="ons-input ons-input--text ons-input-type__input"
      required={props.required}
      value={props.value}
      onChange={props.onChange}
      ref={ref}
    />
  </div>
);

export default forwardRef(TextInput);
