import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { TableSortLabel } from "material-ui/Table";
import { TableCell } from "material-ui/Table";
import Tooltip from "material-ui/Tooltip";

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

    let sortName = "descending";
    if (sortDirection === "desc" || sortDirection === null) sortName = "ascending";

    return (
      <TableCell className={classes.root} scope={"col"} sortDirection={sortDirection}>
        {options.sort ? (
          <Tooltip
            title="Sort"
            placement={"bottom-end"}
            className={classes.tooltip}
            enterDelay={300}
            onClick={this.handleSortClick}>
            <span role="button" tabIndex={0}>
              <div className={classes.data}>{children}</div>
              <div className={classes.sortAction}>
                <span
                  className={classNames({
                    [classes.arrowUp]: true,
                    [classes.arrowActive]: sortDirection === "asc" ? true : false,
                  })}>
                  <svg>
                    <path
                      d="m7.54878,4.12621q0,0.20139 -0.13005,0.34856t-0.30802,0.14717l-6.13296,0q-0.17796,0 -0.30802,-0.14717t-0.13005,-0.34856t0.13005,-0.34856l3.06648,-3.47017q0.13005,-0.14717 0.30802,-0.14717t0.30802,0.14717l3.06648,3.47017q0.13005,0.14717 0.13005,0.34856l0,0l0,0z"
                      fill="black"
                    />
                  </svg>
                </span>
                <span
                  className={classNames({
                    [classes.arrowDown]: true,
                    [classes.arrowActive]: sortDirection === "desc" ? true : false,
                  })}>
                  <svg>
                    <path
                      d="m7.54878,4.12621q0,0.20139 -0.13005,0.34856t-0.30802,0.14717l-6.13296,0q-0.17796,0 -0.30802,-0.14717t-0.13005,-0.34856t0.13005,-0.34856l3.06648,-3.47017q0.13005,-0.14717 0.30802,-0.14717t0.30802,0.14717l3.06648,3.47017q0.13005,0.14717 0.13005,0.34856l0,0l0,0z"
                      fill="black"
                    />
                  </svg>
                </span>
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

export default MUIDataTableHeadCell;
