import React from "react";
import PropTypes from 'prop-types';

function Th(props) {
  return (
    <th scope="col" className="ons-table__header">
      <span>{props.children}</span>
    </th>
  );
}

Th.propTypes = {
  children: PropTypes.string
}

export default Th;
