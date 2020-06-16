import { makeStyles } from '@material-ui/core/styles';
import MuiTableHead from '@material-ui/core/TableHead';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
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
  columns,
  count,
  options,
  data = [],
  setCellRef = () => {},
  selectedRows,
  expandedRows,
  sortOrder = {},
  components = {},
  toggleSort,
  selectRowUpdate,
  toggleAllExpandableRows,
}) => {
  const classes = useStyles();
  const numSelected = (selectedRows && selectedRows.data.length) || 0;
  const [isChecked, checked] = useState(numSelected > 0 && numSelected === count);
  const [isIndeterminate, indeterminate] = useState(numSelected > 0 && numSelected < count);
  const handleToggleColumn = index => {
    toggleSort(index);
  };

  const handleRowSelect = () => {
    selectRowUpdate('head', null);
  };

  useEffect(() => {
    // When the disableToolbarSelect option is true, there can be
    // selected items that aren't visible, so we need to be more
    // precise when determining if the head checkbox should be checked.
    if (options.disableToolbarSelect === true) {
      if (isChecked) {
        data.forEach(item => {
          if (!selectedRows.lookup[item.dataIndex]) {
            checked(false);
            indeterminate(true);
          }
        });
      } else {
        if (numSelected > count) {
          indeterminate(true);
        }
      }
    }
  }, [count, data, isChecked, numSelected, options.disableToolbarSelect, selectedRows.lookup]);

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
          setCellRef={setCellRef}
          onChange={handleRowSelect}
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
        {columns.map(
          (column, index) =>
            column.display === 'true' &&
            (column.customHeadRender ? (
              column.customHeadRender({ index, ...column }, handleToggleColumn, sortOrder)
            ) : (
              <TableHeadCell
                setCellRef={setCellRef}
                type={'cell'}
                cellHeaderProps={
                  columns[index].setCellHeaderProps ? columns[index].setCellHeaderProps({ index, ...column }) : {}
                }
                key={index}
                index={index}
                sort={column.sort}
                sortDirection={column.name === sortOrder.name ? sortOrder.direction : 'none'}
                toggleSort={handleToggleColumn}
                hint={column.hint}
                print={column.print}
                findDOMNode
                options={options}
                column={column}
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
