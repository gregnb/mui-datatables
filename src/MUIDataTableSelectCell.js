import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Checkbox from "@material-ui/core/Checkbox";
import TableCell from "@material-ui/core/TableCell";
import { withStyles } from "@material-ui/core/styles";
import { OptionPropTypes } from "./propTypes";
import styled from "./styled";

const defaultSelectCellStyles = (theme, props) => {
  return {
    root: {
      "@media screen and (max-width: 960px)": {
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
    fixedHeaderAndToolbar: {
      top: "64px",
    },
    checkboxRoot: {
      "&$checked": {
        color: "#027cb5",
      },
    },
    checked: {},
    disabled: {},
  };
};

class MUIDataTableSelectCell extends React.Component {
  static propTypes = {
    /** Select cell checked on/off */
    checked: PropTypes.bool.isRequired,
    /** Select cell part of fixed header */
    fixedHeader: PropTypes.bool.isRequired,
    /** Callback to trigger cell update */
    onChange: PropTypes.func,
    /** Extend the style applied to components */
    classes: PropTypes.object,
    fixedToolbar: PropTypes.bool.isRequired,
  };

  render() {
    const { classes, fixedHeader, fixedToolbar, ...otherProps } = this.props;

    const cellClass = classNames({
      [classes.root]: true,
      [classes.fixedHeader]: fixedHeader,
      [classes.fixedHeaderAndToolbar]: fixedHeader && fixedToolbar,
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

export default styled(MUIDataTableSelectCell)(defaultSelectCellStyles, { name: "MUIDataTableSelectCell" });
