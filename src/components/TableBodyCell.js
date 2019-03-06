import React from 'react';
import classNames from 'classnames';
import TableCell from '@material-ui/core/TableCell';
import { withStyles } from '@material-ui/core/styles';

const defaultBodyCellStyles = theme => ({
  root: {},
  cellHide: {
    display: 'none',
  },
  cellStacked: {
    [theme.breakpoints.down('sm')]: {
      display: 'inline-block',
      backgroundColor: theme.palette.background.paper,
      fontSize: '16px',
      height: '24px',
      width: 'calc(50% - 80px)',
      whiteSpace: 'nowrap',
    },
  },
  responsiveStacked: {
    [theme.breakpoints.down('sm')]: {
      display: 'inline-block',
      fontSize: '16px',
      width: 'calc(50% - 80px)',
      whiteSpace: 'nowrap',
      height: '24px',
    },
  },
});

class TableBodyCell extends React.Component {
  handleClick = event => {
    const { colIndex, options, children, dataIndex, rowIndex } = this.props;
    if (options.onCellClick) {
      options.onCellClick(children, { colIndex, rowIndex, dataIndex, event });
    }
  };

  render() {
    const {
      children,
      classes,
      colIndex,
      columnHeader,
      options,
      dataIndex,
      rowIndex,
      className,
      ...otherProps
    } = this.props;

    return [
      <TableCell
        key={1}
        className={classNames(
          {
            [classes.root]: true,
            [classes.cellHide]: true,
            [classes.cellStacked]: options.responsive === 'stacked',
          },
          className,
        )}>
        {columnHeader}
      </TableCell>,
      <TableCell
        key={2}
        onClick={this.handleClick}
        className={classNames(
          {
            [classes.root]: true,
            [classes.responsiveStacked]: options.responsive === 'stacked',
          },
          className,
        )}
        {...otherProps}>
        {children}
      </TableCell>,
    ];
  }
}

export default withStyles(defaultBodyCellStyles, { name: 'MUIDataTableBodyCell' })(TableBodyCell);
