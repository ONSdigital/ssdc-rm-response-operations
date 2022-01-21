import React, { forwardRef } from "react";
import PropTypes from "prop-types";

const TextInput = forwardRef((props, ref) => (
  <div className="ons-field">
    <label className="ons-label" htmlFor={props.id}>
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
));

TextInput.displayName = "TextInput";

TextInput.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string.isRequired,
  required: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default TextInput;
