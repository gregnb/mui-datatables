import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import TableBodyCell from './TableBodyCell';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableSelectCell from './TableSelectCell';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

const useStyles = makeStyles(
  theme => ({
    root: {},
    columnName: {
      fontWeight: 'bold',
      display: 'inline-block',
    },
    columnValue: {
      marginLeft: '6px',
      display: 'inline-block',
    },
    icon: {
      cursor: 'pointer',
      transition: 'transform 0.25s',
    },
    expanded: {
      transform: 'rotate(90deg)',
    },
    tableRow: {
      padding: '4px 8px 8px 4px',
    },
    expandButton: {
      marginRight: '10px',
    },
  }),
  { name: 'MUIDataTableBodyGroupHeaderRow' },
);

function TableBodyGroupHeaderRow(props) {
  const { columns, options, components = {}, tableId, row, grouping, aggData } = props;

  const classes = useStyles();

  const onExpand = () => {};

  const iconClass = clsx({
    [classes.icon]: true,
    [classes.expanded]: row.expanded,
  });

  const getLevelOffset = level => {
    return (level - 1) * 32 + 'px';
  };

  let bodyClasses = options.setRowProps ? options.setRowProps(row, null, null) || {} : {};
  return (
    <TableRow
      {...bodyClasses}
      className={clsx({
        [bodyClasses.className]: bodyClasses.className,
        [classes.tableRow]: true,
      })}>
      <TableCell className={classes.tableRow}>
        <IconButton
          className={classes.expandButton}
          style={{
            marginLeft: getLevelOffset(row.level),
          }}
          onClick={row.onExpansionChange}>
          <KeyboardArrowRight id="expandable-button" className={iconClass} />
        </IconButton>
        {grouping && grouping.rowHeaderVisible && <div className={classes.columnName}>{row.columnLabel}:</div>}
        <div className={classes.columnValue}>{row.columnValue}</div>
      </TableCell>

      {columns.map(col => {
        if (col.type !== 'prim-group' && col.display !== 'false') {
          return (
            <TableCell className={classes.tableRow}>
              <div>{aggData[row.id] ? aggData[row.id][col.name] : ''}</div>
            </TableCell>
          );
        }
      })}
    </TableRow>
  );
}

export default TableBodyGroupHeaderRow;
