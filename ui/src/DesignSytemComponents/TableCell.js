import React from "react";

function TableCell(props) {
    return (
        <td class="ons-table__cell ">{props.children}</td>
    );
}

export default TableCell;