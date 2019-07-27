import React from 'react';
import MuiTableRow from '@material-ui/core/TableRow';
import MuiTableFooter from '@material-ui/core/TableFooter';
import MuiTablePagination from '@material-ui/core/TablePagination';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';

const defaultPaginationStyles = createStyles({
  root: {
    '&:last-child': {
      padding: '0px 24px 0px 24px',
    },
  },
  toolbar: {},
  selectRoot: {},
  '@media screen and (max-width: 400px)': {
    toolbar: {
      '& span:nth-child(2)': {
        display: 'none',
      },
    },
    selectRoot: {
      marginRight: '8px',
    },
  },
  caption: {},
});

interface TablePaginationProps extends WithStyles<typeof defaultPaginationStyles> {
  /** Total number of table rows */
  count: number;
  /** Options used to describe table */
  options: any;
  /** Current page index */
  page: number;
  /** Total number allowed of rows per page */
  rowsPerPage: number;
  /** Callback to trigger rows per page change */
  changeRowsPerPage: (arg1: any) => void;
  changePage: (page: number) => void;
}

class TablePagination extends React.Component<TablePaginationProps> {
  handleRowChange = event => {
    this.props.changeRowsPerPage(event.target.value);
  };

  handlePageChange = (_, page) => {
    const { options } = this.props;
    this.props.changePage(page);
  };

  render() {
    const { count, classes, options, rowsPerPage, page } = this.props;
    const textLabels = options.textLabels.pagination;

    return (
      <MuiTableFooter>
        <MuiTableRow>
          <MuiTablePagination
            className={classes.root}
            classes={{
              caption: classes.caption,
              toolbar: classes.toolbar,
              selectRoot: classes.selectRoot,
            }}
            count={count}
            rowsPerPage={rowsPerPage}
            page={page}
            labelRowsPerPage={textLabels.rowsPerPage}
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} ${textLabels.displayRows} ${count}`}
            backIconButtonProps={{
              id: 'pagination-back',
              'aria-label': textLabels.previous,
            }}
            nextIconButtonProps={{
              id: 'pagination-next',
              'aria-label': textLabels.next,
            }}
            SelectProps={{
              id: 'pagination-input',
              SelectDisplayProps: { id: 'pagination-rows' },
              MenuProps: {
                id: 'pagination-menu',
                MenuListProps: { id: 'pagination-menu-list' },
              },
            }}
            rowsPerPageOptions={options.rowsPerPageOptions}
            onChangePage={this.handlePageChange}
            onChangeRowsPerPage={this.handleRowChange}
          />
        </MuiTableRow>
      </MuiTableFooter>
    );
  }
}

export default withStyles(defaultPaginationStyles, { name: 'MUIDataTablePagination' })(TablePagination);
