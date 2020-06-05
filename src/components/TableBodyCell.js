import React from 'react';
import classNames from 'classnames';
import TableCell from '@material-ui/core/TableCell';
import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';

const ConditionalWrapper = ({ condition, wrapper, children }) => (condition ? wrapper(children) : children);

const defaultBodyCellStyles = theme => ({
  root: {},
  cellHide: {
    display: 'none',
  },
  simpleHeader: {
    [theme.breakpoints.down('xs')]: {
      display: 'inline-block',
      fontWeight: 'bold',
      width: '100%',
    },
  },
  simpleCell: {
    [theme.breakpoints.down('xs')]: {
      display: 'inline-block',
      width: '100%',
    },
  },
  stackedHeader: {
    verticalAlign:'top',
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
    },
  },
  responsiveStackedSmall: {
    [theme.breakpoints.down('sm')]: {
      width: '50%',
    },
  },
  responsiveStackedSmallParent: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
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
      tmp,
      ...otherProps
    } = this.props;

    let cells = [
      <div
        key={1}
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
        key={2}
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
        {children}
      </div>,
    ];

    var innerCells;
    if (
      ['standard', 'scrollMaxHeight', 'scrollFullHeight', 'scrollFullHeightFullWidth'].indexOf(options.responsive) !==
      -1
    ) {
      innerCells = cells.slice(1, 2);
    } else {
      innerCells = cells;
    }

    return (
      <TableCell
        onClick={this.handleClick}
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
  }
}

export default withWidth()(withStyles(defaultBodyCellStyles, { name: 'MUIDataTableBodyCell' })(TableBodyCell));
