import React from "react";

function RadioBtnItem(props) {
  return (
    <span class="ons-radios__item">
      <span class="ons-radio">
        <input
          type="radio"
          id={props.id}
          class="ons-radio__input ons-js-radio"
          value={props.value}
          name={props.name}
          onChange={props.onChange}
        />
        <label class="ons-radio__label" for={props.id} id={`${props.id}-label`}>
          {props.children}
        </label>
      </span>
    </span>
  );
}

export default RadioBtnItem;
