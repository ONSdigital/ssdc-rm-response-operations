import React from "react";
import PropTypes from 'prop-types';

function TableBody(props) {
  return <tbody className="ons-table__body">{props.children}</tbody>;
}

TableBody.propTypes = {
  children: PropTypes.node.isRequired
}


export default TableBody;
