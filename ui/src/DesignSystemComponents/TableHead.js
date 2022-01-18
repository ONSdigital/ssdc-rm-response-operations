import React from "react";
import PropTypes from 'prop-types';

function TableHead(props) {
  return <thead className="ons-table__head">{props.children}</thead>;
}

TableHead.propTypes = {
  children: PropTypes.object
}

export default TableHead;
