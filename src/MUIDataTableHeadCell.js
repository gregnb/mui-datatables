import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { TableCell, TableSortLabel } from "material-ui/Table";
import Tooltip from "material-ui/Tooltip";
import { withStyles } from "material-ui/styles";

const defaultHeadCellStyles = {
  tooltip: {
    cursor: "pointer",
  },
  data: {
    display: "inline-block",
  },
  sortAction: {
    display: "inline-block",
    verticalAlign: "top",
    cursor: "pointer",
    paddingLeft: "4px",
    height: "10px",
  },
  sortActive: {
    color: "rgba(0, 0, 0, 0.87)",
  },
  toolButton: {
    height: "10px",
    outline: "none",
    cursor: "pointer",
  },
};

class MUIDataTableHeadCell extends React.Component {
  static propTypes = {
    /** Extend the style applied to components */
    classes: PropTypes.object,
    /** Options used to describe table */
    options: PropTypes.object.isRequired,
    /** Current sort direction */
    sortDirection: PropTypes.string,
    /** Callback to trigger column sort */
    toggleSort: PropTypes.func.isRequired,
  };

  handleSortClick = () => {
    this.props.toggleSort(this.props.index);
  };

  render() {
    const { children, classes, index, options, sortDirection } = this.props;
    const sortActive = sortDirection !== null && sortDirection !== undefined ? true : false;

    const sortLabelProps = {
      active: sortActive,
      ...(sortDirection ? { direction: sortDirection } : {}),
    };

    return (
      <TableCell className={classes.root} scope={"col"} sortDirection={sortDirection}>
        {options.sort ? (
          <Tooltip title="Sort" placement={"bottom-end"} className={classes.tooltip} enterDelay={300}>
            <span
              role="button"
              onKeyUp={this.handleClickSort}
              onClick={this.handleSortClick}
              className={classes.toolButton}
              tabIndex={0}>
              <div
                className={classNames({
                  [classes.data]: true,
                  [classes.sortActive]: sortActive,
                })}>
                {children}
              </div>
              <div className={classes.sortAction}>
                <TableSortLabel {...sortLabelProps} />
              </div>
            </span>
          </Tooltip>
        ) : (
          children
        )}
      </TableCell>
    );
  }
}

export default withStyles(defaultHeadCellStyles, { name: "MUIDataTableHeadCell" })(MUIDataTableHeadCell);
