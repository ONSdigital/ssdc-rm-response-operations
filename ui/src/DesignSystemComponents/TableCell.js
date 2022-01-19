import React from "react";
import PropTypes from 'prop-types';

function TableCell(props) {
  return <td className="ons-table__cell ">{props.children}</td>;
}

TableCell.propTypes = {
  children: PropTypes.node
}

export default TableCell;
