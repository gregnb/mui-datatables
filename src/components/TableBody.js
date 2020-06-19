import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import MuiTableBody from '@material-ui/core/TableBody';
import TableBodyCell from './TableBodyCell';
import TableBodyRow from './TableBodyRow';
import TableSelectCell from './TableSelectCell';
import { makeStyles } from '@material-ui/core/styles';
import cloneDeep from 'lodash.clonedeep';
import { getPageValue } from '../utils';
import classNames from 'classnames';

const useStyles = makeStyles(
  theme => ({
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
  }),
  { name: "'MUIDataTableBody'" },
);

const TableBody = ({
  columns,
  count,
  data,
  expandedRows,
  options,
  page,
  previousSelectedRow,
  rowsPerPage,
  selectableRows,
  selectableRowsOnClick,
  selectedRows,
  selectRowUpdate,
  toggleExpandRow = () => {},
}) => {
  const classes = useStyles();

  const buildRows = () => {
    if (options.serverSide) return data.length ? data : null;

    const rows = [];
    const highestPageInRange = getPageValue(count, rowsPerPage, page);
    const fromIndex = highestPageInRange === 0 ? 0 : highestPageInRange * rowsPerPage;
    const toIndex = Math.min(count, (highestPageInRange + 1) * rowsPerPage);

    if (page > highestPageInRange) {
      console.warn('Current page is out of range, using the highest page that is in range instead.');
    }

    for (let rowIndex = fromIndex; rowIndex < count && rowIndex < toIndex; rowIndex++) {
      if (data[rowIndex] !== undefined) rows.push(data[rowIndex]);
    }

    return rows.length ? rows : null;
  };

  const getRowIndex = index => {
    if (options.serverSide) {
      return index;
    }

    const startIndex = page === 0 ? 0 : page * rowsPerPage;

    return startIndex + index;
  };

  const isRowSelected = dataIndex => {
    return !!(selectedRows.lookup && selectedRows.lookup[dataIndex]);
  };

  const isRowExpanded = dataIndex => {
    return !!(expandedRows.lookup && expandedRows.lookup[dataIndex]);
  };

  const isRowSelectable = (dataIndex, currentSelectedRows) => {
    const selected = currentSelectedRows || selectedRows;

    if (options.isRowSelectable) {
      return options.isRowSelectable(dataIndex, selected);
    }

    return true;
  };

  const isRowExpandable = dataIndex => {
    if (options.isRowExpandable) {
      return options.isRowExpandable(dataIndex, expandedRows);
    }

    return true;
  };

  const handleRowSelect = (data, event) => {
    const shiftKey = event && event.nativeEvent ? event.nativeEvent.shiftKey : false;
    const shiftAdjacentRows = [];
    // If the user is pressing shift and has previously clicked another row.
    if (shiftKey && previousSelectedRow && previousSelectedRow.index < data.length) {
      let curIndex = previousSelectedRow.index;

      // Create a copy of the selectedRows object. This will be used and modified
      // below when we see if we can add adjacent rows.
      const selectedRows = cloneDeep(selectedRows);

      // Add the clicked on row to our copy of selectedRows (if it isn't already present).
      const clickedDataIndex = data[data.index].dataIndex;
      if (selectedRows.data.filter(d => d.dataIndex === clickedDataIndex).length === 0) {
        selectedRows.data.push({
          index: data.index,
          dataIndex: clickedDataIndex,
        });
        selectedRows.lookup[clickedDataIndex] = true;
      }

      while (curIndex !== data.index) {
        const dataIndex = data[curIndex].dataIndex;

        if (isRowSelectable(dataIndex, selectedRows)) {
          const lookup = {
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
    selectRowUpdate('cell', data, shiftAdjacentRows);
  };

  const handleRowClick = (row, data, event) => {
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
    if (selectableRowsOnClick && selectableRows !== 'none' && isRowSelectable(data.dataIndex, selectedRows)) {
      const selectRow = { index: data.rowIndex, dataIndex: data.dataIndex };
      handleRowSelect(selectRow, event);
    }
    // Check if we should trigger row expand when row is clicked anywhere
    if (options.expandableRowsOnClick && options.expandableRows && isRowExpandable(data.dataIndex, expandedRows)) {
      const expandRow = { index: data.rowIndex, dataIndex: data.dataIndex };
      toggleExpandRow(expandRow);
    }

    // Don't trigger onRowClick if the event was actually a row selection via click
    if (options.selectableRowsOnClick) {
      return;
    }

    options.onRowClick && options.onRowClick(row, data, event);
  };

  const createRow = (row, columnOrder) => {
    return row.map((value, idx) => {
      return {
        value,
        index: columnOrder[idx],
      };
    });
  };

  const tableRows = buildRows();
  const visibleColCnt = columns.filter(c => c.display === 'true').length;

  if (tableRows && tableRows.length > 0) {
    return (
      <MuiTableBody>
        {tableRows.map((data, rowIndex) => {
          const columnOrder = columns.map((item, idx) => idx);
          const { data: row, dataIndex } = data;

          if (options.customRowRender) {
            return options.customRowRender(row, dataIndex, rowIndex);
          }

          const bodyClasses = options.setRowProps ? options.setRowProps(row, dataIndex, rowIndex) : {};
          const processedRows = createRow(row, columnOrder);

          return (
            <React.Fragment key={rowIndex}>
              <TableBodyRow
                {...bodyClasses}
                options={options}
                rowSelected={options.selectableRows !== 'none' ? isRowSelected(dataIndex) : false}
                isRowSelectable={isRowSelectable(dataIndex)}
                onClick={event => handleRowClick(row, { rowIndex, dataIndex }, event)}
                className={classNames({
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
                  onChange={event =>
                    handleRowSelect(
                      {
                        index: getRowIndex(rowIndex),
                        dataIndex: dataIndex,
                      },
                      event,
                    )
                  }
                  onExpand={() =>
                    toggleExpandRow({
                      index: getRowIndex(rowIndex),
                      dataIndex: dataIndex,
                    })
                  }
                  fixedHeader={options.fixedHeader}
                  fixedSelectColumn={options.fixedSelectColumn}
                  checked={options.selectableRows !== 'none' ? isRowSelected(dataIndex) : false}
                  expandableOn={options.expandableRows}
                  // When rows are expandable, but this particular row isn't expandable, set this to true.
                  // This will add a new class to the toggle button, MUIDataTableSelectCell-expandDisabled.
                  hideExpandButton={!isRowExpandable(dataIndex) && options.expandableRows}
                  selectableOn={options.selectableRows}
                  selectableRowsHideCheckboxes={options.selectableRowsHideCheckboxes}
                  isRowExpanded={() => isRowExpanded(dataIndex)}
                  isRowSelectable={isRowSelectable(dataIndex)}
                  id={'MUIDataTableSelectCell-' + dataIndex}
                />
                {processedRows.map(
                  (column, columnIndex) =>
                    columns[columnIndex].display === 'true' && (
                      <TableBodyCell
                        {...(columns[columnIndex].setCellProps
                          ? columns[columnIndex].setCellProps(column, dataIndex, columnIndex)
                          : {})}
                        data-testid={`MuiDataTableBodyCell-${columnIndex}-${rowIndex}`}
                        dataIndex={dataIndex}
                        rowIndex={rowIndex}
                        colIndex={columnIndex}
                        columnHeader={columns[columnIndex].label}
                        print={columns[columnIndex].print}
                        options={options}
                        key={columnIndex}>
                        {column.value}
                      </TableBodyCell>
                    ),
                )}
              </TableBodyRow>
              {isRowExpanded(dataIndex) && options.renderExpandableRow(row, { rowIndex, dataIndex })}
            </React.Fragment>
          );
        })}
      </MuiTableBody>
    );
  }

  return (
    <MuiTableBody>
      <TableBodyRow options={options}>
        <TableBodyCell
          colSpan={options.selectableRows !== 'none' || options.expandableRows ? visibleColCnt + 1 : visibleColCnt}
          options={options}
          colIndex={0}
          rowIndex={0}>
          <Typography variant="body1" className={classes.emptyTitle}>
            {options.textLabels.body.noMatch}
          </Typography>
        </TableBodyCell>
      </TableBodyRow>
    </MuiTableBody>
  );
};

TableBody.propTypes = {
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
};

export default TableBody;
