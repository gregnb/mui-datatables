import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import TableRow from '@material-ui/core/TableRow';
import { withStyles } from '@material-ui/core/styles';

const defaultBodyRowStyles = theme => ({
  root: {},
  hover: {},
  hoverCursor: { cursor: 'pointer' },
  responsiveStacked: {
    [theme.breakpoints.down('sm')]: {
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
    const { classes, options, rowSelected, onClick, className, ...rest } = this.props;

    return (
      <TableRow
        hover={options.rowHover ? true : false}
        onClick={onClick}
        className={classNames(
          {
            [classes.root]: true,
            [classes.hover]: options.rowHover,
            [classes.hoverCursor]: options.selectableRowsOnClick || options.expandableRowsOnClick,
            [classes.responsiveStacked]: options.responsive === 'stacked' || options.responsive === 'stackedFullWidth',
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
