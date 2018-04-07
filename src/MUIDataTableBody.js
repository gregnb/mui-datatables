import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Table from "material-ui/Table";
import Typography from "material-ui/Typography";
import Checkbox from "material-ui/Checkbox";
import { TableBody, TableCell, TableRow } from "material-ui/Table";
import MUIDataTableBodyCell from "./MUIDataTableBodyCell";
import MUIDataTableBodyRow from "./MUIDataTableBodyRow";
import MUIDataTableSelectCell from "./MUIDataTableSelectCell";
import { withStyles } from "material-ui/styles";

const defaultBodyStyles = {
  root: {},
  emptyTitle: {
    textAlign: "center",
  },
};

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
    /** Table rows selected */
    selectedRows: PropTypes.array,
    /** Callback to trigger table row select */
    selectRowUpdate: PropTypes.func,
    /** Data used to search table against */
    searchText: PropTypes.string,
    /** Extend the style applied to components */
    classes: PropTypes.object,
  };

  buildRows() {
    const { data, page, rowsPerPage } = this.props;

    let rows = [];
    const fromIndex = page === 0 ? 0 : page * rowsPerPage;
    const toIndex = Math.min(data.length, (page + 1) * rowsPerPage);

    for (let rowIndex = fromIndex; rowIndex < data.length && rowIndex < toIndex; rowIndex++) {
      rows.push(data[rowIndex]);
    }

    return rows.length ? rows : null;
  }

  getRowIndex(index) {
    const { page, rowsPerPage } = this.props;
    const startIndex = page === 0 ? 0 : page * rowsPerPage;

    return startIndex + index;
  }

  isRowSelected(index) {
    const { selectedRows } = this.props;
    return selectedRows.indexOf(this.getRowIndex(index)) >= 0 ? true : false;
  }

  handleRowSelect = index => {
    this.props.selectRowUpdate("cell", this.getRowIndex(index));
  };

  render() {
    const { classes, columns, data, options, page, rowsPerPage } = this.props;
    const tableRows = this.buildRows();

    return (
      <TableBody>
        {tableRows ? (
          tableRows.map((row, rowIndex) => (
            <MUIDataTableBodyRow
              options={options}
              rowSelected={options.selectableRows ? this.isRowSelected(rowIndex) : false}
              key={rowIndex}>
              {options.selectableRows ? (
                <MUIDataTableSelectCell
                  onChange={this.handleRowSelect.bind(null, rowIndex)}
                  checked={this.isRowSelected(rowIndex)}
                />
              ) : (
                false
              )}
              {row.map(
                (column, index) =>
                  columns[index].display ? (
                    <MUIDataTableBodyCell columnHeader={columns[index].name} options={options} key={index}>
                      {column}
                    </MUIDataTableBodyCell>
                  ) : (
                    false
                  ),
              )}
            </MUIDataTableBodyRow>
          ))
        ) : (
          <MUIDataTableBodyRow options={options}>
            <MUIDataTableBodyCell colSpan={columns.length} options={options}>
              <Typography variant="subheading" className={classes.emptyTitle}>
                Sorry, no matching records found
              </Typography>
            </MUIDataTableBodyCell>
          </MUIDataTableBodyRow>
        )}
      </TableBody>
    );
  }
}

export default withStyles(defaultBodyStyles, { name: "MUIDataTableBody" })(MUIDataTableBody);
