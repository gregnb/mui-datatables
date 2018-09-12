import React from "react";
import classNames from "classnames";
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
  sticky: {
    width: "56px",
    maxWidth: "56px",
    backgroundColor: "#F4F7FA",
    position: "sticky",
    top: 0,
    zIndex: 10,
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
    const { classes, radio, sticky, ...otherProps } = this.props;

    return (
      <TableCell
        className={classNames(classes.root, {[classes.sticky]: sticky})}
        padding="checkbox"
      >
        {radio ? (
          <Radio color="primary" {...otherProps} />
        ) : (
          <Checkbox
            color="primary"
            classes={{
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
