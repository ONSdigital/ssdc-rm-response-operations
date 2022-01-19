import React from "react";
import PropTypes from 'prop-types';

function TableRow(props) {
  return <tr className="ons-table__row">{props.children}</tr>;
}

TableRow.propTypes = {
  children: PropTypes.node
}

export default TableRow;
