import React from "react";
import classNames from "classnames";
import { TableCell } from "material-ui/Table";
import { withStyles } from "material-ui/styles";

const defaultBodyCellStyles = {
  root: {},
  cellStacked: {
    display: "none",
    "@media screen and (max-width: 960px)": {
      display: "inline-block",
      backgroundColor: "#FFF",
      fontSize: "16px",
      height: "24px",
      width: "calc(50% - 80px)",
      whiteSpace: "nowrap",
    },
  },
  responsiveStacked: {
    "@media screen and (max-width: 960px)": {
      display: "inline-block",
      fontSize: "16px",
      width: "calc(50% - 80px)",
      whiteSpace: "nowrap",
      height: "24px",
    },
  },
};

class MUIDataTableBodyCell extends React.Component {
  render() {
    const { children, classes, columnHeader, options, ...otherProps } = this.props;

    return [
      <TableCell
        key={1}
        className={classNames({
          [classes.root]: true,
          [classes.cellStacked]: true,
        })}>
        {columnHeader}
      </TableCell>,
      <TableCell
        key={2}
        className={classNames({
          [classes.root]: true,
          [classes.responsiveStacked]: options.responsive === "stacked",
        })}
        {...otherProps}>
        {children}
      </TableCell>,
    ];
  }
}

export default withStyles(defaultBodyCellStyles, { name: "MUIDataTableBodyCell" })(MUIDataTableBodyCell);
