import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { TableHead } from "material-ui/Table";
import MUIDataTableHeadRow from "./MUIDataTableHeadRow";
import MUIDataTableHeadCell from "./MUIDataTableHeadCell";
import { withStyles } from "material-ui/styles";

const defaultHeadStyles = {
  main: {},
  responsiveStacked: {
    "@media screen and (max-width: 960px)": {
      display: "none",
    },
  },
};

class MUIDataTableHead extends React.Component {
  state = {
    activeColumn: null,
  };

  handleToggleColumn = index => {
    this.setState(() => ({
      activeColumn: index,
    }));
    this.props.toggleSort(index);
  };

  render() {
    const { classes, columns, options } = this.props;
    const { activeColumn } = this.state;

    return (
      <TableHead className={classNames({ [classes.responsiveStacked]: true, [classes.main]: true })}>
        <MUIDataTableHeadRow>
          {columns.map(
            (column, index) =>
              column.display ? (
                <MUIDataTableHeadCell
                  key={index}
                  index={index}
                  sort={column.sort}
                  sortDirection={column.sortDirection}
                  toggleSort={this.handleToggleColumn}
                  options={options}>
                  {column.name}
                </MUIDataTableHeadCell>
              ) : (
                false
              ),
          )}
        </MUIDataTableHeadRow>
      </TableHead>
    );
  }
}

export default withStyles(defaultHeadStyles, { name: "MUIDataTableHead" })(MUIDataTableHead);
