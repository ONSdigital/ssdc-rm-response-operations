import React from "react";

function Table(props) {
    return (
        <table className="ons-table ons-table--row-hover">{props.children}</table>
    );
}

export default Table;