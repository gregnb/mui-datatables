import React from "react";
import PropTypes from "prop-types";
import { TableHead, TableRow } from "material-ui/Table";
import MUIDataTableHeadCell from "./MUIDataTableHeadCell";
import { getStyle, withDataStyles } from "./withDataStyles";

const headStyles = theme => ({});

class MUIDataTableHead extends React.Component {
  render() {
    const { toggleSort, columns, options } = this.props;

    return (
      <TableHead>
        <TableRow classes={getStyle(options, "table.head.row")}>
          {columns.map(
            (column, index) =>
              column.display ? (
                <MUIDataTableHeadCell
                  key={index}
                  index={index}
                  classes={getStyle(options, "table.head.cell")}
                  sortDirection={column.sort}
                  toggleSort={toggleSort}
                  options={options}>
                  {column.name}
                </MUIDataTableHeadCell>
              ) : (
                false
              ),
          )}
        </TableRow>
      </TableHead>
    );
  }
}

export default withDataStyles(headStyles)(MUIDataTableHead);
