import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import TableRow from "@material-ui/core/TableRow";
import { withStyles } from "@material-ui/core/styles";

const defaultBodyRowStyles = {
  root: {},
  responsiveStacked: {
    "@media screen and (max-width: 960px)": {
      border: "solid 2px rgba(0, 0, 0, 0.15)",
    },
  },
};

class MUIDataTableBodyRow extends React.Component {
  static propTypes = {
    /** Options used to describe table */
    options: PropTypes.object.isRequired,
    /** Current row selected or not */
    rowSelected: PropTypes.bool,
    /** Extend the style applied to components */
    classes: PropTypes.object,
  };

  render() {
    const { classes, options, rowSelected } = this.props;

    return (
      <TableRow
        hover={options.rowHover ? true : false}
        className={classNames({
          [classes.root]: true,
          [classes.responsiveStacked]: options.responsive === "stacked",
        })}
        selected={rowSelected}>
        {this.props.children}
      </TableRow>
    );
  }
}

export default withStyles(defaultBodyRowStyles, { name: "MUIDataTableBodyRow" })(MUIDataTableBodyRow);
