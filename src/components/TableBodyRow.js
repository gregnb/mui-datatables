import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import TableRow from '@material-ui/core/TableRow';
import { withStyles } from '@material-ui/core/styles';

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
    [theme.breakpoints.down('sm')]: {
      border: 'solid 2px rgba(0, 0, 0, 0.15)',
    },
  },
  responsiveSimple: {
    [theme.breakpoints.down('xs')]: {
      border: 'solid 2px rgba(0, 0, 0, 0.15)',
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

    return (
      <TableRow
        hover={options.rowHover ? true : false}
        onClick={onClick}
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
        {...rest}>
        {this.props.children}
      </TableRow>
    );
  }
}

export default withStyles(defaultBodyRowStyles, { name: 'MUIDataTableBodyRow' })(TableBodyRow);
