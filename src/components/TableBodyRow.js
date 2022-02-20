import React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import TableRow from '@mui/material/TableRow';
const PREFIX = 'MUIDataTableBodyRow';

const classes = {
  root: `${PREFIX}-root`,
  hoverCursor: `${PREFIX}-hoverCursor`,
  responsiveStacked: `${PREFIX}-responsiveStacked`,
  responsiveSimple: `${PREFIX}-responsiveSimple`
};

const StyledTableRow = styled(TableRow)((
  {
    theme
  }
) => ({
  [`&.${classes.root}`]: {
    // material v4
    '&.Mui-selected': {
      backgroundColor: theme.palette.action.selected,
    },

    // material v3 workaround
    '&.mui-row-selected': {
      backgroundColor: theme.palette.action.selected,
    },
  },

  [`&.${classes.hoverCursor}`]: { cursor: 'pointer' },

  [`&.${classes.responsiveStacked}`]: {
    [theme.breakpoints.down('md')]: {
      borderTop: 'solid 2px rgba(0, 0, 0, 0.15)',
      borderBottom: 'solid 2px rgba(0, 0, 0, 0.15)',
      padding: 0,
      margin: 0,
    },
  },

  [`&.${classes.responsiveSimple}`]: {
    [theme.breakpoints.down('sm')]: {
      borderTop: 'solid 2px rgba(0, 0, 0, 0.15)',
      borderBottom: 'solid 2px rgba(0, 0, 0, 0.15)',
      padding: 0,
      margin: 0,
    },
  }
}));

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
    const {  options, rowSelected, onClick, className, isRowSelectable, ...rest } = this.props;

    var methods = {};
    if (onClick) {
      methods.onClick = onClick;
    }

    return (
      <StyledTableRow
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
      </StyledTableRow>
    );
  }
}

export default (TableBodyRow);
