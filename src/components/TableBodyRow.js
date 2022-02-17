import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import TableRow from '@mui/material/TableRow';
import { withStyles } from 'tss-react/mui';

const defaultBodyRowStyles = theme => ({
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
    [theme.breakpoints.down('md')]: {
      borderTop: 'solid 2px rgba(0, 0, 0, 0.15)',
      borderBottom: 'solid 2px rgba(0, 0, 0, 0.15)',
      padding: 0,
      margin: 0,
    },
  },
  responsiveSimple: {
    [theme.breakpoints.down('sm')]: {
      borderTop: 'solid 2px rgba(0, 0, 0, 0.15)',
      borderBottom: 'solid 2px rgba(0, 0, 0, 0.15)',
      padding: 0,
      margin: 0,
    },
  },
});

class TableBodyRow extends React.Component {
  static propTypes = {
    /** Options used to describe table */
    options: PropTypes.object.isRequired,
    /** Callback to execute when row is clicked */
    onClick: PropTypes.func,
    /** Current row selected or not */
    rowSelected: PropTypes.bool,
    /** Extend the style applied to components */
    classes: PropTypes.object,
  };

  render() {
    const { classes, options, rowSelected, onClick, className, isRowSelectable, ...rest } = this.props;

    var methods = {};
    if (onClick) {
      methods.onClick = onClick;
    }

    return (
      <TableRow
        hover={options.rowHover ? true : false}
        {...methods}
        className={clsx(
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
        {...rest}>
        {this.props.children}
      </TableRow>
    );
  }
}

export default withStyles(TableBodyRow, defaultBodyRowStyles, { name: 'MUIDataTableBodyRow' });
