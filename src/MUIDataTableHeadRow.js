import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { TableRow } from "material-ui/Table";
import { withStyles } from "material-ui/styles";

const defaultHeadRowStyles = {
  root: {},
};

class MUIDataTableHeadRow extends React.Component {
  static propTypes = {
    /** Extend the style applied to components */
    classes: PropTypes.object,
  };

  render() {
    const { classes, options } = this.props;

    return (
      <TableRow
        className={classNames({
          [classes.root]: true,
        })}>
        {this.props.children}
      </TableRow>
    );
  }
}

export default withStyles(defaultHeadRowStyles, { name: "MUIDataTableHeadRow" })(MUIDataTableHeadRow);
