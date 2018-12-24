import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Checkbox from "@material-ui/core/Checkbox";
import TableCell from "@material-ui/core/TableCell";
import { withStyles } from "@material-ui/core/styles";

const defaultSelectCellStyles = theme => ({
  root: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  fixedHeader: {
    position: "sticky",
    top: "0px",
    left: "0px",
    zIndex: 100,
    backgroundColor: "#FFF",
  },
  headerCell: {
    zIndex: 110
  },
  checkboxRoot: {
    "&$checked": {
      color: "#027cb5",
    },
  },
  checked: {},
  disabled: {},
});

class TableSelectCell extends React.Component {
  static propTypes = {
    /** Select cell checked on/off */
    checked: PropTypes.bool.isRequired,
    /** Select cell part of fixed header */
    fixedHeader: PropTypes.bool.isRequired,
    /** Callback to trigger cell update */
    onChange: PropTypes.func,
    /** Extend the style applied to components */
    classes: PropTypes.object,
  };

  static defaultProps = {
    isHeaderCell: false
  };

  render() {
    const { classes, fixedHeader, isHeaderCell, ...otherProps } = this.props;

    const cellClass = classNames({
      [classes.root]: true,
      [classes.fixedHeader]: fixedHeader,
      [classes.headerCell]: isHeaderCell,
    });

    return (
      <TableCell className={cellClass} padding="checkbox">
        <Checkbox
          classes={{
            root: classes.checkboxRoot,
            checked: classes.checked,
            disabled: classes.disabled,
          }}
          {...otherProps}
        />
      </TableCell>
    );
  }
}

export default withStyles(defaultSelectCellStyles, { name: "MUIDataTableSelectCell" })(TableSelectCell);
