import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  theme => ({
    root: {
      // material v4
      '&.Mui-selected': {
        backgroundColor: theme.palette.action.selected,
      },
      // material v3 workaround
      '&.mui-row-selected': {
        backgroundColor: theme.palette.action.selected,
      },
    },
    hoverCursor: { cursor: 'pointer' },
    responsiveStacked: {
      [theme.breakpoints.down('sm')]: {
        borderTop: 'solid 2px rgba(0, 0, 0, 0.15)',
        borderBottom: 'solid 2px rgba(0, 0, 0, 0.15)',
        padding: 0,
        margin: 0,
      },
    },
    responsiveSimple: {
      [theme.breakpoints.down('xs')]: {
        borderTop: 'solid 2px rgba(0, 0, 0, 0.15)',
        borderBottom: 'solid 2px rgba(0, 0, 0, 0.15)',
        padding: 0,
        margin: 0,
      },
    },
  }),
  { name: 'MUIDataTableBodyRow' },
);

const TableBodyRow = ({ children, className, isRowSelectable, onClick, options, rowSelected, ...otherProps }) => {
  const classes = useStyles();
  const methods = {};

  if (onClick) {
    methods.onClick = onClick;
  }

  return (
    <TableRow
      hover={options.rowHover === true}
      {...methods}
      className={classNames(
        {
          [classes.root]: true,
          [classes.hover]: options.rowHover,
          [classes.hoverCursor]: (options.selectableRowsOnClick && isRowSelectable) || options.expandableRowsOnClick,
          [classes.responsiveSimple]: options.responsive === 'simple',
          [classes.responsiveStacked]:
            options.responsive === 'vertical' ||
            options.responsive === 'stacked' ||
            options.responsive === 'stackedFullWidth',
          'mui-row-selected': rowSelected,
        },
        className,
      )}
      selected={rowSelected}
      {...otherProps}>
      {children}
    </TableRow>
  );
};

TableBodyRow.propTypes = {
  /** Options used to describe table */
  options: PropTypes.object.isRequired,
  /** Callback to execute when row is clicked */
  onClick: PropTypes.func,
  /** Current row selected or not */
  rowSelected: PropTypes.bool,
  /** Table Row */
  children: PropTypes.node,
};

export default TableBodyRow;
