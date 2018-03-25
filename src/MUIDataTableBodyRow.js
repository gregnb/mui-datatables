import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { TableRow } from "material-ui/Table";
import { withStyles } from "material-ui/styles";

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
    /** Extend the style applied to components */
    classes: PropTypes.object,
  };

  render() {
    const { classes, options } = this.props;

    return (
      <TableRow
        hover={options.rowHover ? true : false}
        className={classNames({
          [classes.root]: true,
          [classes.responsiveStacked]: options.responsive === "stacked",
        })}>
        {this.props.children}
      </TableRow>
    );
  }
}

export default withStyles(defaultBodyRowStyles, { name: "MUIDataTableBodyRow" })(MUIDataTableBodyRow);
