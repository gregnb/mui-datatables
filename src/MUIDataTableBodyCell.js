import React from "react";
import PropTypes from "prop-types";
import Table from "material-ui/Table";
import { TableCell } from "material-ui/Table";

class MUIDataTableBodyCell extends React.Component {
  render() {
    const { children, ...otherProps } = this.props;

    return <TableCell {...otherProps}>{children}</TableCell>;
  }
}

export default MUIDataTableBodyCell;
