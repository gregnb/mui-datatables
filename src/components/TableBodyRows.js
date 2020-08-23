import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import MuiTableBody from '@material-ui/core/TableBody';
import TableBodyCell from './TableBodyCell';
import TableBodyRow from './TableBodyRow';
import TableSelectCell from './TableSelectCell';
import { withStyles } from '@material-ui/core/styles';
import cloneDeep from 'lodash.clonedeep';
import { getPageValue } from '../utils';
import clsx from 'clsx';

const defaultBodyStyles = theme => ({
  root: {},
  emptyTitle: {
    textAlign: 'center',
  },
  lastStackedCell: {
    [theme.breakpoints.down('sm')]: {
      '& td:last-child': {
        borderBottom: 'none',
      },
    },
  },
  lastSimpleCell: {
    [theme.breakpoints.down('xs')]: {
      '& td:last-child': {
        borderBottom: 'none',
      },
    },
  },
});

class TableBodyRows extends React.Component {
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
    /** Table rows expanded */
    expandedRows: PropTypes.object,
    /** Table rows selected */
    selectedRows: PropTypes.object,
    /** Callback to trigger table row select */
    selectRowUpdate: PropTypes.func,
    /** The most recent row to have been selected/unselected */
    previousSelectedRow: PropTypes.object,
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

  isRowSelectable(dataIndex, selectedRows) {
    const { options } = this.props;
    selectedRows = selectedRows || this.props.selectedRows;

    if (options.isRowSelectable) {
      return options.isRowSelectable(dataIndex, selectedRows);
    } else {
      return true;
    }
  }

  isRowExpandable(dataIndex) {
    const { options, expandedRows } = this.props;
    if (options.isRowExpandable) {
      return options.isRowExpandable(dataIndex, expandedRows);
    } else {
      return true;
    }
  }

  handleRowSelect = (data, event) => {
    let shiftKey = event && event.nativeEvent ? event.nativeEvent.shiftKey : false;
    let shiftAdjacentRows = [];
    let previousSelectedRow = this.props.previousSelectedRow;

    // If the user is pressing shift and has previously clicked another row.
    if (shiftKey && previousSelectedRow && previousSelectedRow.index < this.props.data.length) {
      let curIndex = previousSelectedRow.index;

      // Create a copy of the selectedRows object. This will be used and modified
      // below when we see if we can add adjacent rows.
      let selectedRows = cloneDeep(this.props.selectedRows);

      // Add the clicked on row to our copy of selectedRows (if it isn't already present).
      let clickedDataIndex = this.props.data[data.index].dataIndex;
      if (selectedRows.data.filter(d => d.dataIndex === clickedDataIndex).length === 0) {
        selectedRows.data.push({
          index: data.index,
          dataIndex: clickedDataIndex,
        });
        selectedRows.lookup[clickedDataIndex] = true;
      }

      while (curIndex !== data.index) {
        let dataIndex = this.props.data[curIndex].dataIndex;

        if (this.isRowSelectable(dataIndex, selectedRows)) {
          let lookup = {
            index: curIndex,
            dataIndex: dataIndex,
          };

          // Add adjacent row to temp selectedRow object if it isn't present.
          if (selectedRows.data.filter(d => d.dataIndex === dataIndex).length === 0) {
            selectedRows.data.push(lookup);
            selectedRows.lookup[dataIndex] = true;
          }

          shiftAdjacentRows.push(lookup);
        }
        curIndex = data.index > curIndex ? curIndex + 1 : curIndex - 1;
      }
    }
    this.props.selectRowUpdate('cell', data, shiftAdjacentRows);
  };

  handleRowClick = (row, data, event) => {
    // Don't trigger onRowClick if the event was actually the expandable icon.
    if (
      event.target.id === 'expandable-button' ||
      (event.target.nodeName === 'path' && event.target.parentNode.id === 'expandable-button')
    ) {
      return;
    }

    // Don't trigger onRowClick if the event was actually a row selection via checkbox
    if (event.target.id && event.target.id.startsWith('MUIDataTableSelectCell')) return;

    // Check if we should toggle row select when row is clicked anywhere
    if (
      this.props.options.selectableRowsOnClick &&
      this.props.options.selectableRows !== 'none' &&
      this.isRowSelectable(data.dataIndex, this.props.selectedRows)
    ) {
      const selectRow = { index: data.rowIndex, dataIndex: data.dataIndex };
      this.handleRowSelect(selectRow, event);
    }
    // Check if we should trigger row expand when row is clicked anywhere
    if (
      this.props.options.expandableRowsOnClick &&
      this.props.options.expandableRows &&
      this.isRowExpandable(data.dataIndex, this.props.expandedRows)
    ) {
      const expandRow = { index: data.rowIndex, dataIndex: data.dataIndex };
      this.props.toggleExpandRow(expandRow);
    }

    // Don't trigger onRowClick if the event was actually a row selection via click
    if (this.props.options.selectableRowsOnClick) return;

    this.props.options.onRowClick && this.props.options.onRowClick(row, data, event);
  };

  processRow = (row, columnOrder) => {
    let ret = [];
    for (let ii = 0; ii < row.length; ii++) {
      ret.push({
        value: row[columnOrder[ii]],
        index: columnOrder[ii],
      });
    }
    return ret;
  };

  render() {
    const {
      classes,
      columns,
      toggleExpandRow,
      options,
      columnOrder = this.props.columns.map((item, idx) => idx),
      components = {},
      tableId,
      tableRows,
    } = this.props;
    const visibleColCnt = columns.filter(c => c.display === 'true').length;

    return (
      <React.Fragment>
        {tableRows && tableRows.length > 0 ? (
          tableRows.map((data, rowIndex) => {
            const { data: row, dataIndex } = data;

            if (options.customRowRender) {
              return options.customRowRender(row, dataIndex, rowIndex);
            }

            let isRowSelected = options.selectableRows !== 'none' ? this.isRowSelected(dataIndex) : false;
            let isRowSelectable = this.isRowSelectable(dataIndex);
            let bodyClasses = options.setRowProps ? options.setRowProps(row, dataIndex, rowIndex) || {} : {};

            const processedRow = this.processRow(row, columnOrder);

            return (
              <React.Fragment key={rowIndex}>
                <TableBodyRow
                  {...bodyClasses}
                  options={options}
                  rowSelected={isRowSelected}
                  isRowSelectable={isRowSelectable}
                  onClick={this.handleRowClick.bind(null, row, { rowIndex, dataIndex })}
                  className={clsx({
                    [classes.lastStackedCell]:
                      options.responsive === 'vertical' ||
                      options.responsive === 'stacked' ||
                      options.responsive === 'stackedFullWidth',
                    [classes.lastSimpleCell]: options.responsive === 'simple',
                    [bodyClasses.className]: bodyClasses.className,
                  })}
                  data-testid={'MUIDataTableBodyRow-' + dataIndex}
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
                    fixedSelectColumn={options.fixedSelectColumn}
                    checked={isRowSelected}
                    expandableOn={options.expandableRows}
                    // When rows are expandable, but this particular row isn't expandable, set this to true.
                    // This will add a new class to the toggle button, MUIDataTableSelectCell-expandDisabled.
                    hideExpandButton={!this.isRowExpandable(dataIndex) && options.expandableRows}
                    selectableOn={options.selectableRows}
                    selectableRowsHideCheckboxes={options.selectableRowsHideCheckboxes}
                    isRowExpanded={this.isRowExpanded(dataIndex)}
                    isRowSelectable={isRowSelectable}
                    dataIndex={dataIndex}
                    id={'MUIDataTableSelectCell-' + dataIndex}
                    components={components}
                  />
                  {processedRow.map(
                    column =>
                      columns[column.index].display === 'true' && (
                        <TableBodyCell
                          {...(columns[column.index].setCellProps
                            ? columns[column.index].setCellProps(column.value, dataIndex, column.index) || {}
                            : {})}
                          data-testid={`MuiDataTableBodyCell-${column.index}-${rowIndex}`}
                          dataIndex={dataIndex}
                          rowIndex={rowIndex}
                          colIndex={column.index}
                          columnHeader={columns[column.index].label}
                          print={columns[column.index].print}
                          options={options}
                          tableId={tableId}
                          key={column.index}>
                          {column.value}
                        </TableBodyCell>
                      ),
                  )}
                </TableBodyRow>
                {this.isRowExpanded(dataIndex) && options.renderExpandableRow(row, { rowIndex, dataIndex })}
              </React.Fragment>
            );
          })
        ) : (
          <TableBodyRow options={options}>
            <TableBodyCell
              colSpan={options.selectableRows !== 'none' || options.expandableRows ? visibleColCnt + 1 : visibleColCnt}
              options={options}
              colIndex={0}
              rowIndex={0}>
              <Typography variant="body1" className={classes.emptyTitle} component={'div'}>
                {options.textLabels ? options.textLabels.body.noMatch : ""}
              </Typography>
            </TableBodyCell>
          </TableBodyRow>
        )}
      </React.Fragment>
    );
  }
}

export default withStyles(defaultBodyStyles, { name: 'MUIDataTableBodyRows' })(TableBodyRows);
