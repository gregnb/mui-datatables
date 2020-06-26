import { makeStyles } from '@material-ui/core/styles';
import MuiTableHead from '@material-ui/core/TableHead';
import classNames from 'classnames';
import React, { useState } from 'react';
import TableHeadCell from './TableHeadCell';
import TableHeadRow from './TableHeadRow';
import TableSelectCell from './TableSelectCell';

const useStyles = makeStyles(
  theme => ({
    main: {},
    responsiveStacked: {
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
    responsiveSimple: {
      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },
  }),
  { name: 'MUIDataTableHead' },
);

const TableHead = ({
  columnOrder = null,
  columns,
  components = {},
  count,
  data,
  draggableHeadCellRefs,
  expandedRows,
  options,
  selectedRows,
  selectRowUpdate,
  setCellRef,
  sortOrder = {},
  tableRef,
  timers,
  toggleAllExpandableRows,
  toggleSort,
  updateColumnOrder,
}) => {
  const classes = useStyles();

  if (columnOrder === null) {
    columnOrder = columns ? columns.map((item, idx) => idx) : [];
  }

  const [dragging, setDragging] = useState(false);

  const handleToggleColumn = index => {
    toggleSort(index);
  };

  const handleRowSelect = () => {
    selectRowUpdate('head', null);
  };

  const numSelected = (selectedRows && selectedRows.data.length) || 0;
  let isIndeterminate = numSelected > 0 && numSelected < count;
  let isChecked = numSelected > 0 && numSelected >= count;

  // When the disableToolbarSelect option is true, there can be
  // selected items that aren't visible, so we need to be more
  // precise when determining if the head checkbox should be checked.
  if (
    options.disableToolbarSelect === true ||
    options.selectToolbarPlacement === 'none' ||
    options.selectToolbarPlacement === 'above'
  ) {
    if (isChecked) {
      for (let ii = 0; ii < data.length; ii++) {
        if (!selectedRows.lookup[data[ii].dataIndex]) {
          isChecked = false;
          isIndeterminate = true;
          break;
        }
      }
    } else {
      if (numSelected > count) {
        isIndeterminate = true;
      }
    }
  }

  let orderedColumns = columnOrder.map((colIndex, idx) => {
    return {
      column: columns[colIndex],
      index: colIndex,
      colPos: idx,
    };
  });

  return (
    <MuiTableHead
      className={classNames({
        [classes.responsiveStacked]:
          options.responsive === 'vertical' ||
          options.responsive === 'stacked' ||
          options.responsive === 'stackedFullWidth',
        [classes.responsiveSimple]: options.responsive === 'simple',
        [classes.main]: true,
      })}>
      <TableHeadRow>
        <TableSelectCell
          setHeadCellRef={setCellRef}
          onChange={handleRowSelect.bind(null)}
          indeterminate={isIndeterminate}
          checked={isChecked}
          isHeaderCell={true}
          expandedRows={expandedRows}
          expandableRowsHeader={options.expandableRowsHeader}
          expandableOn={options.expandableRows}
          selectableOn={options.selectableRows}
          fixedHeader={options.fixedHeader}
          fixedSelectColumn={options.fixedSelectColumn}
          selectableRowsHeader={options.selectableRowsHeader}
          onExpand={toggleAllExpandableRows}
          isRowSelectable={true}
        />
        {orderedColumns.map(
          ({ column, index, colPos }) =>
            column.display === 'true' &&
            (column.customHeadRender ? (
              column.customHeadRender({ index, ...column }, handleToggleColumn, sortOrder)
            ) : (
              <TableHeadCell
                cellHeaderProps={
                  columns[index].setCellHeaderProps ? columns[index].setCellHeaderProps({ index, ...column }) : {}
                }
                key={index}
                index={index}
                colPosition={colPos}
                type={'cell'}
                setCellRef={setCellRef}
                sort={column.sort}
                sortDirection={column.name === sortOrder.name ? sortOrder.direction : 'none'}
                toggleSort={handleToggleColumn}
                hint={column.hint}
                print={column.print}
                options={options}
                column={column}
                updateColumnOrder={updateColumnOrder}
                columnOrder={columnOrder}
                timers={timers}
                draggingHook={[dragging, setDragging]}
                draggableHeadCellRefs={draggableHeadCellRefs}
                tableRef={tableRef}
                components={components}>
                {column.label}
              </TableHeadCell>
            )),
        )}
      </TableHeadRow>
    </MuiTableHead>
  );
};

export default TableHead;
