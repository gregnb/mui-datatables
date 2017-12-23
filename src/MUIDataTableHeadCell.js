import React from "react";
import PropTypes from "prop-types";
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
    const { options, sortDirection, children, classes } = this.props;

    return (
      <TableCell className={classes.root} sortDirection={sortDirection}>
        {options.sort ? (
          <Tooltip title="Sort" placement={"bottom-end"} enterDelay={300}>
            <TableSortLabel
              direction={sortDirection}
              onClick={this.handleSortClick}
              active={true}
              classes={{
                root: classes.sortLabel,
              }}>
              {children}
            </TableSortLabel>
          </Tooltip>
        ) : (
          children
        )}
      </TableCell>
    );
  }
}

export default MUIDataTableHeadCell;
