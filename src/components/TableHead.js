import { makeStyles } from '@material-ui/core/styles';
import MuiTableHead from '@material-ui/core/TableHead';
import classNames from 'classnames';
import React, {useState} from 'react';
import { findDOMNode } from 'react-dom';
import TableHeadCell from './TableHeadCell';
import TableHeadRow from './TableHeadRow';
import TableSelectCell from './TableSelectCell';

const useStyles = makeStyles(theme => ({
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
}), {name: 'MUIDataTableHead'});

function TableHead(props) {
  
  const[dragging, setDragging] = useState(false);

  const {
    columns,
    count,
    options,
    data,
    setCellRef,
    selectedRows,
    expandedRows,
    updateColumnOrder,
    columnOrder = props.columns ? props.columns.map((item,idx) => idx) : [],
    headCellRefs,
    timers,
    toggleSort,
    tableRef,
    sortOrder = {},
    components = {},
  } = props;
  const classes = useStyles();

  const handleToggleColumn = index => {
    toggleSort(index);
  };

  const handleRowSelect = () => {
    props.selectRowUpdate('head', null);
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

  let orderedColumns = columnOrder.map( colIndex => {
    return {
      column: columns[colIndex],
      index: colIndex,
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
          ref={el => setCellRef(0, findDOMNode(el))}
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
          onExpand={props.toggleAllExpandableRows}
          isRowSelectable={true}
        />
        {orderedColumns.map(
          ({column, index}) =>
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
                headCellRefs={headCellRefs}
                tableRef={tableRef}
                components={components}>
                {column.label}
              </TableHeadCell>
            )),
        )}
      </TableHeadRow>
    </MuiTableHead>
  );
}

export default TableHead;
