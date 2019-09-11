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
      fontSize: '16px',
      width: '50%',
      whiteSpace: 'nowrap',
      boxSizing: 'border-box',
      height: '32px',
      '&:nth-last-child(2)': {
        borderBottom: 'none'
      },
    },
  },
  responsiveStacked: {
    [theme.breakpoints.down('sm')]: {
      display: 'inline-block',
      fontSize: '16px',
      width: '50%',
      whiteSpace: 'nowrap',
      boxSizing: 'border-box',
      height: '32px',
      '&:last-child': {
        borderBottom: 'none'
      },
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
      print,
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
            'datatables-noprint': !print,
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
            'datatables-noprint': !print,
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
