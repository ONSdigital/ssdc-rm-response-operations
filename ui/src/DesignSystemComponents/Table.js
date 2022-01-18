import React from "react";
import PropTypes from 'prop-types';

function Table(props) {
  return (
    <table className="ons-table ons-table--row-hover">{props.children}</table>
  );
}

Table.propTypes = {
  children: PropTypes.object.isRequired
}

export default Table;
