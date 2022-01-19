import React from "react";
import PropTypes from 'prop-types';

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

RadioBtnItem.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  children: PropTypes.string.isRequired
};

export default RadioBtnItem;
