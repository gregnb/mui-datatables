import React, { useCallback } from 'react';
import classNames from 'classnames';
import TableCell from '@material-ui/core/TableCell';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles(
  theme => ({
    root: {},
    cellHide: {
      display: 'none',
    },
    simpleHeader: {
      [theme.breakpoints.down('xs')]: {
        display: 'inline-block',
        fontWeight: 'bold',
        width: '100%',
        boxSizing: 'border-box',
      },
    },
    simpleCell: {
      [theme.breakpoints.down('xs')]: {
        display: 'inline-block',
        width: '100%',
        boxSizing: 'border-box',
      },
    },
    stackedHeader: {
      verticalAlign: 'top',
    },
    stackedCommon: {
      [theme.breakpoints.down('sm')]: {
        display: 'inline-block',
        fontSize: '16px',
        height: 'auto',
        width: 'calc(50%)',
        boxSizing: 'border-box',
        '&:last-child': {
          borderBottom: 'none',
        },
        '&:nth-last-child(2)': {
          borderBottom: 'none',
        },
      },
    },
    stackedParent: {
      [theme.breakpoints.down('sm')]: {
        display: 'inline-block',
        fontSize: '16px',
        height: 'auto',
        width: 'calc(100%)',
        boxSizing: 'border-box',
      },
    },
    cellStackedSmall: {
      [theme.breakpoints.down('sm')]: {
        width: '50%',
        boxSizing: 'border-box',
      },
    },
    responsiveStackedSmall: {
      [theme.breakpoints.down('sm')]: {
        width: '50%',
        boxSizing: 'border-box',
      },
    },
    responsiveStackedSmallParent: {
      [theme.breakpoints.down('sm')]: {
        width: '100%',
        boxSizing: 'border-box',
      },
    },
  }),
  { name: 'MUIDataTableBodyCell' },
);

const TableBodyCell = ({
  children,
  className,
  colIndex,
  columnHeader,
  dataIndex,
  options,
  print,
  rowIndex,
  ...otherProps
}) => {
  const classes = useStyles();
  const onCellClick = options.onCellClick;

  const handleClick = useCallback(
    event => {
      onCellClick(children, { colIndex, rowIndex, dataIndex, event });
    },
    [onCellClick, children, colIndex, rowIndex, dataIndex],
  );

  const handleOnClick = event => {
    // Event listeners. Avoid attaching them if they're not necessary.
    if (onCellClick) {
      handleClick(event);
    }
  };

  const getCells = () => {
    return [
      <div
        key="TableBodyCell-1"
        className={classNames(
          {
            lastColumn: colIndex === 2,
            [classes.root]: true,
            [classes.cellHide]: true,
            [classes.stackedHeader]: true,
            [classes.stackedCommon]:
              options.responsive === 'vertical' ||
              options.responsive === 'stacked' ||
              options.responsive === 'stackedFullWidth',
            [classes.cellStackedSmall]:
              options.responsive === 'stacked' ||
              (options.responsive === 'stackedFullWidth' &&
                (options.setTableProps().padding === 'none' || options.setTableProps().size === 'small')),
            [classes.simpleHeader]: options.responsive === 'simple',
            'datatables-noprint': !print,
          },
          className,
        )}>
        {columnHeader}
      </div>,
      <div
        key="TableBodyCell-2"
        className={classNames(
          {
            [classes.root]: true,
            [classes.stackedCommon]:
              options.responsive === 'vertical' ||
              options.responsive === 'stacked' ||
              options.responsive === 'stackedFullWidth',
            [classes.responsiveStackedSmall]:
              options.responsive === 'stacked' ||
              (options.responsive === 'stackedFullWidth' &&
                (options.setTableProps().padding === 'none' || options.setTableProps().size === 'small')),
            [classes.simpleCell]: options.responsive === 'simple',
            'datatables-noprint': !print,
          },
          className,
        )}
        {...otherProps}>
        {typeof children === 'function' ? children(dataIndex, rowIndex) : children}
      </div>,
    ];
  };

  let innerCells;
  if (['standard', 'scrollMaxHeight', 'scrollFullHeight', 'scrollFullHeightFullWidth'].includes(options.responsive)) {
    innerCells = getCells().slice(1, 2);
  } else {
    innerCells = getCells();
  }

  return (
    <TableCell
      onClick={handleOnClick}
      data-colindex={colIndex}
      className={classNames(
        {
          [classes.root]: true,
          [classes.stackedParent]:
            options.responsive === 'vertical' ||
            options.responsive === 'stacked' ||
            options.responsive === 'stackedFullWidth',
          [classes.responsiveStackedSmallParent]:
            options.responsive === 'vertical' ||
            options.responsive === 'stacked' ||
            (options.responsive === 'stackedFullWidth' &&
              (options.setTableProps().padding === 'none' || options.setTableProps().size === 'small')),
          [classes.simpleCell]: options.responsive === 'simple',
          'datatables-noprint': !print,
        },
        className,
      )}
      {...otherProps}>
      {innerCells}
    </TableCell>
  );
};

TableBodyCell.propTypes = {
  /** Table Row */
  children: PropTypes.node,
  /** Pass and use className to style MUIDataTable as desired */
  className: PropTypes.string,
  /** column Index */
  colIndex: PropTypes.number.isRequired,
  /** Name of column */
  columnHeader: PropTypes.string,
  /** Data Row Index */
  dataIndex: PropTypes.number,
  /** Options used to describe table */
  options: PropTypes.object.isRequired,
  /** Display column when printing. */
  print: PropTypes.bool,
  /** Table Row Index */
  rowIndex: PropTypes.number.isRequired,
};

export default TableBodyCell;
