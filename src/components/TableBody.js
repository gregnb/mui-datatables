import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import MuiTableBody from '@material-ui/core/TableBody';
import TableBodyCell from './TableBodyCell';
import TableBodyRow from './TableBodyRow';
import TableSelectCell from './TableSelectCell';
import { withStyles } from '@material-ui/core/styles';

const defaultBodyStyles = {
  root: {},
  emptyTitle: {
    textAlign: 'center',
  },
};

class TableBody extends React.Component {
  static propTypes = {
    /** Data used to describe table */
    data: PropTypes.array.isRequired,
    /** Total number of data rows */
    count: PropTypes.number.isRequired,
    /** Columns used to describe table */
    columns: PropTypes.array.isRequired,
    /** Options used to describe table */
    options: PropTypes.object.isRequired,
    /** Data used to filter table against */
    filterList: PropTypes.array,
    /** Callback to execute when row is clicked */
    onRowClick: PropTypes.func,
    /** Table rows selected */
    selectedRows: PropTypes.object,
    /** Callback to trigger table row select */
    selectRowUpdate: PropTypes.func,
    /** Data used to search table against */
    searchText: PropTypes.string,
    /** Toggle row expandable */
    toggleExpandRow: PropTypes.func,
    /** Extend the style applied to components */
    classes: PropTypes.object,
  };

  static defaultProps = {
    toggleExpandRow: () => {},
  };

  buildRows() {
    const { data, page, rowsPerPage, count } = this.props;

    if (this.props.options.serverSide) return data.length ? data : null;

    let rows = [];
    const totalPages = Math.floor(count / rowsPerPage);
    const fromIndex = page === 0 ? 0 : page * rowsPerPage;
    const toIndex = Math.min(count, (page + 1) * rowsPerPage);

    if (page > totalPages && totalPages !== 0) {
      throw new Error(
        'Provided options.page of `' +
          page +
          '` is greater than the total available page length of `' +
          totalPages +
          '`',
      );
    }

    for (let rowIndex = fromIndex; rowIndex < count && rowIndex < toIndex; rowIndex++) {
      if (data[rowIndex] !== undefined) rows.push(data[rowIndex]);
    }

    return rows.length ? rows : null;
  }

  getRowIndex(index) {
    const { page, rowsPerPage, options } = this.props;

    if (options.serverSide) {
      return index;
    }

    const startIndex = page === 0 ? 0 : page * rowsPerPage;
    return startIndex + index;
  }

  isRowSelected(dataIndex) {
    const { selectedRows } = this.props;
    return selectedRows.lookup && selectedRows.lookup[dataIndex] ? true : false;
  }

  isRowExpanded(dataIndex) {
    const { expandedRows } = this.props;
    return expandedRows.lookup && expandedRows.lookup[dataIndex] ? true : false;
  }

  isRowSelectable(dataIndex) {
    const { options } = this.props;
    if (options.isRowSelectable) {
      return options.isRowSelectable(dataIndex);
    }
    return true;
  }

  handleRowSelect = data => {
    this.props.selectRowUpdate('cell', data);
  };

  handleRowClick = (row, data, event) => {
    // don't trigger onRowClick if the event was actually a row selection
    if (event.target.id && event.target.id.startsWith('MUIDataTableSelectCell')) {
      return;
    }
    this.props.options.onRowClick && this.props.options.onRowClick(row, data, event);
  };

  render() {
    const { classes, columns, toggleExpandRow, options } = this.props;
    const tableRows = this.buildRows();
    const visibleColCnt = columns.filter(c => c.display === 'true').length;

    return (
      <MuiTableBody>
        {tableRows && tableRows.length > 0 ? (
          tableRows.map(({ data: row, dataIndex }, rowIndex) => (
            <React.Fragment key={rowIndex}>
              <TableBodyRow
                {...(options.setRowProps ? options.setRowProps(row, dataIndex) : {})}
                options={options}
                rowSelected={options.selectableRows ? this.isRowSelected(dataIndex) : false}
                onClick={this.handleRowClick.bind(null, row, { rowIndex, dataIndex })}
                id={'MUIDataTableBodyRow-' + dataIndex}>
                <TableSelectCell
                  onChange={this.handleRowSelect.bind(null, {
                    index: this.getRowIndex(rowIndex),
                    dataIndex: dataIndex,
                  })}
                  onExpand={toggleExpandRow.bind(null, {
                    index: this.getRowIndex(rowIndex),
                    dataIndex: dataIndex,
                  })}
                  fixedHeader={options.fixedHeader}
                  checked={this.isRowSelected(dataIndex)}
                  expandableOn={options.expandableRows}
                  selectableOn={options.selectableRows}
                  isRowExpanded={this.isRowExpanded(dataIndex)}
                  isRowSelectable={this.isRowSelectable(dataIndex)}
                  id={'MUIDataTableSelectCell-' + dataIndex}
                />
                {row.map(
                  (column, columnIndex) =>
                    columns[columnIndex].display === 'true' && (
                      <TableBodyCell
                        {...(columns[columnIndex].setCellProps
                          ? columns[columnIndex].setCellProps(column, dataIndex, columnIndex)
                          : {})}
                        dataIndex={dataIndex}
                        rowIndex={rowIndex}
                        colIndex={columnIndex}
                        columnHeader={columns[columnIndex].label}
                        options={options}
                        key={columnIndex}>
                        {column}
                      </TableBodyCell>
                    ),
                )}
              </TableBodyRow>
              {this.isRowExpanded(dataIndex) && options.renderExpandableRow(row, { rowIndex, dataIndex })}
            </React.Fragment>
          ))
        ) : (
          <TableBodyRow options={options}>
            <TableBodyCell
              colSpan={options.selectableRows ? visibleColCnt + 1 : visibleColCnt}
              options={options}
              colIndex={0}
              rowIndex={0}>
              <Typography variant="subtitle1" className={classes.emptyTitle}>
                {options.textLabels.body.noMatch}
              </Typography>
            </TableBodyCell>
          </TableBodyRow>
        )}
      </MuiTableBody>
    );
  }
}

export default withStyles(defaultBodyStyles, { name: 'MUIDataTableBody' })(TableBody);
