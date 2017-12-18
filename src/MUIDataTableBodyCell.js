import React from "react";
import PropTypes from "prop-types";
import Table from "material-ui/Table";
import { TableCell } from "material-ui/Table";
import { getStyle, withDataStyles } from "./withDataStyles";

const cellStyles = theme => ({
  root: {
    borderBottom: "solid 1px #bdbdbd",
  },
});

class MUIDataTableBodyCell extends React.Component {
  render() {
    const { children, classes, ...otherProps } = this.props;
    return (
      <TableCell className={classes.root} {...otherProps}>
        {children}
      </TableCell>
    );
  }
}

export default withDataStyles(cellStyles)(MUIDataTableBodyCell);
