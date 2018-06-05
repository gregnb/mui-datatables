import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import TableBody from "@material-ui/core/TableBody";
import MUIDataTableBodyCell from "./MUIDataTableBodyCell";
import MUIDataTableBodyRow from "./MUIDataTableBodyRow";
import MUIDataTableSelectCell from "./MUIDataTableSelectCell";
import { withStyles } from "@material-ui/core/styles";

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
    selectedRows: PropTypes.object,
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
    const totalPages = Math.floor(data.length / rowsPerPage);
    const fromIndex = page === 0 ? 0 : page * rowsPerPage;
    const toIndex = Math.min(data.length, (page + 1) * rowsPerPage);

    if (page > totalPages && totalPages !== 0) {
      throw new Error(
        "Provided options.page of `" +
          page +
          "` is greater than the total available page length of `" +
          totalPages +
          "`",
      );
    }

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
    return selectedRows.lookup && selectedRows.lookup[index] ? true : false;
  }

  handleRowSelect = data => {
    this.props.selectRowUpdate("cell", data);
  };

  render() {
    const { classes, columns, options } = this.props;
    const tableRows = this.buildRows();

    return (
      <TableBody>
        {tableRows ? (
          tableRows.map(({ data: row, dataIndex }, rowIndex) => (
            <MUIDataTableBodyRow
              options={options}
              rowSelected={options.selectableRows ? this.isRowSelected(rowIndex) : false}
              key={rowIndex}>
              {options.selectableRows ? (
                <MUIDataTableSelectCell
                  onChange={this.handleRowSelect.bind(null, {
                    index: this.getRowIndex(rowIndex),
                    dataIndex: dataIndex,
                  })}
                  checked={this.isRowSelected(this.getRowIndex(rowIndex))}
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
            <MUIDataTableBodyCell
              colSpan={options.selectableRows ? columns.length + 1 : columns.length}
              options={options}>
              <Typography variant="subheading" className={classes.emptyTitle}>
                {options.textLabels.body.noMatch}
              </Typography>
            </MUIDataTableBodyCell>
          </MUIDataTableBodyRow>
        )}
      </TableBody>
    );
  }
}

export default withStyles(defaultBodyStyles, { name: "MUIDataTableBody" })(MUIDataTableBody);
