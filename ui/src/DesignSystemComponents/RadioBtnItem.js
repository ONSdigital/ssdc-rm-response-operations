import React from "react";

function RadioBtnItem(props) {
  return (
    <span className="ons-radios__item">
      <span className="ons-radio">
        <input
          type="radio"
          id={props.id}
          className="ons-radio__input ons-js-radio"
          value={props.value}
          name={props.name}
          onChange={props.onChange}
        />
        <label
          className="ons-radio__label"
          htmlFor={props.id}
          id={`${props.id}-label`}
        >
          {props.children}
        </label>
      </span>
    </span>
  );
}

export default RadioBtnItem;
