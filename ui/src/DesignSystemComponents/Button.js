import React from "react";
import PropTypes from 'prop-types';

function Button(props) {
  const className =
    "ons-btn" +
    (props.secondary ? " ons-btn--secondary" : "") +
    (props.small ? " ons-btn--small" : "");

  const buttonType = props.type ? props.type : "button";

  return (
    <>
      <button type={buttonType} className={className} onClick={props.onClick}>
        <span className="ons-btn__inner">{props.children}</span>
      </button>
    </>
  );
}

Button.propTypes = {
  secondary: PropTypes.bool,
  small: PropTypes.bool,
  type: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.string.isRequired
}

export default Button;
