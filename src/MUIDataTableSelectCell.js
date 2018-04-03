import React from "react";
import PropTypes from "prop-types";
import Checkbox from "material-ui/Checkbox";
import { TableCell } from "material-ui/Table";
import { withStyles } from "material-ui/styles";

const defaultSelectCellStyles = {
  root: {
    "@media screen and (max-width: 960px)": {
      display: "none",
    },
  },
  default: {},
  checked: {
    color: "#027cb5",
  },
  checkedPrimary: {},
  checkedSecondary: {},
  disabled: {},
};

class MUIDataTableSelectCell extends React.Component {
  static propTypes = {
    /** Select cell checked on/off */
    checked: PropTypes.bool.isRequired,
    /** Callback to trigger cell update */
    onChange: PropTypes.func,
    /** Extend the style applied to components */
    classes: PropTypes.object,
  };

  render() {
    const { classes, ...otherProps } = this.props;

    return (
      <TableCell className={classes.root} padding="checkbox">
        <Checkbox
          classes={{
            default: classes.default,
            checked: classes.checked,
            checkedPrimary: classes.checkedPrimary,
            checkedSecondary: classes.checkedSecondary,
            disabled: classes.disabled,
          }}
          {...otherProps}
        />
      </TableCell>
    );
  }
}

export default withStyles(defaultSelectCellStyles, { name: "MUIDataTableSelectCell" })(MUIDataTableSelectCell);
