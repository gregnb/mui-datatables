import React from "react";
import PropTypes from "prop-types";
import { TableSortLabel } from "material-ui/Table";
import { TableCell } from "material-ui/Table";
import Tooltip from "material-ui/Tooltip";
import { getStyle, withDataStyles } from "./withDataStyles";

const cellStyles = theme => ({
  root: {
    borderBottom: "solid 1px #bdbdbd",
  },
  sortLabel: {
    color: "inherit",
  },
});

class MUIDataTableHeadCell extends React.Component {
  handleSortClick = () => {
    this.props.toggleSort(this.props.index);
  };

  render() {
    const { options, sortDirection, children, classes } = this.props;

    return (
      <TableCell className={classes.root}>
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

export default withDataStyles(cellStyles)(MUIDataTableHeadCell);
