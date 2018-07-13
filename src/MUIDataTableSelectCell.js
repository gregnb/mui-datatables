import React from "react";
import PropTypes from "prop-types";
import Checkbox from "@material-ui/core/Checkbox";
import Radio from "@material-ui/core/Radio";
import TableCell from "@material-ui/core/TableCell";
import { withStyles } from "@material-ui/core/styles";

const defaultSelectCellStyles = {
  root: {
    "@media screen and (max-width: 960px)": {
      display: "none",
    },
  },
  checkboxRoot: {
    "&$checked": {
      color: "#027cb5",
    },
  },
  checked: {},
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
    const { classes, radio, ...otherProps } = this.props;

    return (
      <TableCell className={classes.root} padding="checkbox">
        {radio ? (
          <Radio {...otherProps} />
        ) : (
          <Checkbox
            classes={{
              root: classes.checkboxRoot,
              checked: classes.checked,
              disabled: classes.disabled,
            }}
            {...otherProps}
          />
        )}
      </TableCell>
    );
  }
}

export default withStyles(defaultSelectCellStyles, { name: "MUIDataTableSelectCell" })(MUIDataTableSelectCell);
