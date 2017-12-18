import React from "react";
import PropTypes from "prop-types";
import Table from "material-ui/Table";
import Typography from "material-ui/Typography";
import { TableBody, TableRow } from "material-ui/Table";
import MUIDataTableBodyCell from "./MUIDataTableBodyCell";
import { getStyle, withDataStyles } from "./withDataStyles";

const bodyStyles = theme => ({
  root: {
    borderBottom: "solid 1px #bdbdbd",
  },
  emptyTitle: {
    textAlign: "center",
  },
});

class MUIDataTableBody extends React.Component {
  static propTypes = {
    /** Data used to describe table */
    data: PropTypes.array.isRequired,
    /** Columns used to describe table */
    columns: PropTypes.array.isRequired,
    /** Options used to describe table */
    options: PropTypes.object.isRequired,
    /** Data used to filter table against */
    filterList: PropTypes.array,
    /** Data used to search table against */
    searchText: PropTypes.string,
    /** Extend the style applied to components */
    classes: PropTypes.object,
  };

  buildRows() {
    const { data, columns, options, page, rowsPerPage } = this.props;

    const newRows = [];
    const fromIndex = page === 0 ? 0 : page * rowsPerPage;
    const toIndex = Math.min(data.length, (page + 1) * rowsPerPage);

    for (let rowIndex = fromIndex; rowIndex < data.length && rowIndex < toIndex; rowIndex++) {
      newRows.push(
        <TableRow hover={options.rowHover ? true : false} key={rowIndex}>
          {data[rowIndex].map(
            (column, index) =>
              columns[index].display ? (
                <MUIDataTableBodyCell classes={getStyle(options, "table.body.cell")} key={index}>
                  {column}
                </MUIDataTableBodyCell>
              ) : (
                false
              ),
          )}
        </TableRow>,
      );
    }

    return newRows;
  }

  render() {
    const { columns, classes, options } = this.props;
    const tableRows = this.buildRows();

    return (
      <TableBody>
        {tableRows.length ? (
          tableRows
        ) : (
          <TableRow>
            <MUIDataTableBodyCell classes={getStyle(options, "table.body.cell")} colSpan={columns.length}>
              <Typography type="subheading" className={classes.emptyTitle}>
                Sorry, no matching records found
              </Typography>
            </MUIDataTableBodyCell>
          </TableRow>
        )}
      </TableBody>
    );
  }
}

export default withDataStyles(bodyStyles)(MUIDataTableBody);
