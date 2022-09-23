import React from 'react';
import PropTypes from 'prop-types';
import TableBodyCell from './TableBodyCell';
import TableBodyRow from './TableBodyRow';
import TableSelectCell from './TableSelectCell';
import { withStyles } from 'tss-react/mui';
import cloneDeep from 'lodash.clonedeep';
import clsx from 'clsx';

const defaultBodyStyles = theme => ({
  root: {},
  emptyTitle: {
    textAlign: 'center',
  },
  lastStackedCell: {
    [theme.breakpoints.down('md')]: {
      '& td:last-child': {
        borderBottom: 'none',
      },
    },
  },
  lastSimpleCell: {
    [theme.breakpoints.down('sm')]: {
      '& td:last-child': {
        borderBottom: 'none',
      },
    },
  },
});

class MemoizedTableBodyRow extends React.Component {
  static propTypes = {
    /** Data used to describe table */
    data: PropTypes.array.isRequired,
    /** Row index */
    rowIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    /** Columns used to describe table */
    columns: PropTypes.array.isRequired,
    /** Options used to describe table */
    options: PropTypes.object.isRequired,
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
    /** Toggle row expandable */
    toggleExpandRow: PropTypes.func,
    /** Extend the style applied to components */
    classes: PropTypes.object,
  };

  render() {
    const {
      data,
      rowIndex,
      classes,
      columns,
      toggleExpandRow,
      options,
      columnOrder,
      components,
      tableId,
      getRowIndexFunc,
      isRowSelectedFunc,
      isRowExpandedFunc,
      isRowSelectableFunc,
      isRowExpandableFunc,
      handleRowSelectFunc,
      handleRowClickFunc,
      processRow,
    } = this.props;

    const { data: row, dataIndex } = data;

    if (options.customRowRender) {
      return options.customRowRender(row, dataIndex, rowIndex);
    }

    let isRowSelected = options.selectableRows !== 'none' ? isRowSelectedFunc(dataIndex) : false;
    let isRowSelectable = isRowSelectableFunc(dataIndex);
    let bodyClasses = options.setRowProps ? options.setRowProps(row, dataIndex, rowIndex) || {} : {};

    const processedRow = processRow(row, columnOrder);

    return (
      <React.Fragment key={data.id ?? rowIndex}>
        <TableBodyRow
          {...bodyClasses}
          options={options}
          rowSelected={isRowSelected}
          isRowSelectable={isRowSelectable}
          onClick={handleRowClickFunc(null, row, { rowIndex, dataIndex })}
          className={clsx({
            [classes.lastStackedCell]:
              options.responsive === 'vertical' ||
              options.responsive === 'stacked' ||
              options.responsive === 'stackedFullWidth',
            [classes.lastSimpleCell]: options.responsive === 'simple',
            [bodyClasses.className]: bodyClasses.className,
          })}
          data-testid={'MUIDataTableBodyRow-' + dataIndex}
          id={`MUIDataTableBodyRow-${tableId}-${dataIndex}`}>
          <TableSelectCell
            onChange={handleRowSelectFunc(null, {
              index: getRowIndexFunc(rowIndex),
              dataIndex: dataIndex,
            })}
            onExpand={toggleExpandRow.bind(null, {
              index: getRowIndexFunc(rowIndex),
              dataIndex: dataIndex,
            })}
            fixedHeader={options.fixedHeader}
            fixedSelectColumn={options.fixedSelectColumn}
            checked={isRowSelected}
            expandableOn={options.expandableRows}
            // When rows are expandable, but this particular row isn't expandable, set this to true.
            // This will add a new class to the toggle button, MUIDataTableSelectCell-expandDisabled.
            hideExpandButton={!isRowExpandableFunc(dataIndex) && options.expandableRows}
            selectableOn={options.selectableRows}
            selectableRowsHideCheckboxes={options.selectableRowsHideCheckboxes}
            isRowExpanded={isRowExpandedFunc(dataIndex)}
            isRowSelectable={isRowSelectable}
            dataIndex={dataIndex}
            id={`MUIDataTableSelectCell-${tableId}-${dataIndex}`}
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
        {isRowExpandedFunc(dataIndex) && options.renderExpandableRow(row, { rowIndex, dataIndex })}
      </React.Fragment>
    );
  }
}

export default withStyles(MemoizedTableBodyRow, defaultBodyStyles, { name: 'MUIDataTableBody' });
