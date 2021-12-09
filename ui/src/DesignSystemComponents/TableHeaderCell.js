function Th(props) {
  return (
    <th scope="col" className="ons-table__header">
      <span>{props.children}</span>
    </th>
  );
}

export default Th;
