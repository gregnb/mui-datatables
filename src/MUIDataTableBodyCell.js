import React from "react";
import { TableCell } from "material-ui/Table";

class MUIDataTableBodyCell extends React.Component {
  render() {
    const { children, ...otherProps } = this.props;

    return <TableCell {...otherProps}>{children}</TableCell>;
  }
}

export default MUIDataTableBodyCell;
