import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import TableRow from '@material-ui/core/TableRow';
import { withStyles, WithStyles, Theme, createStyles } from '@material-ui/core/styles';

const defaultBodyRowStyles = (theme: Theme) =>
  createStyles({
    root: {},
    hover: {},
    hoverCursor: { cursor: 'pointer' },
    responsiveStacked: {
      [theme.breakpoints.down('sm')]: {
        border: 'solid 2px rgba(0, 0, 0, 0.15)',
      },
    },
  });

interface TableBodyRowProps extends WithStyles<typeof defaultBodyRowStyles> {
  /** Options used to describe table */
  options: any;
  /** Callback to execute when row is clicked */
  onClick?: () => void;
  /** Current row selected or not */
  rowSelected?: boolean;
  className?: string;
}

class TableBodyRow extends React.Component<TableBodyRowProps> {
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
            [classes.responsiveStacked]: options.responsive === 'stacked',
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
