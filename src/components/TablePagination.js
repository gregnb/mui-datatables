import React from 'react';
import PropTypes from 'prop-types';
import MuiTableRow from '@material-ui/core/TableRow';
import MuiTableFooter from '@material-ui/core/TableFooter';
import MuiTablePagination from '@material-ui/core/TablePagination';
import { makeStyles } from '@material-ui/core/styles';
import { getPageValue } from '../utils';

const useStyles = makeStyles(
  () => ({
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
  }),
  { name: 'MUIDataTablePagination' },
);

const TablePagination = ({ count, options, rowsPerPage, page, changeRowsPerPage, changePage }) => {
  const classes = useStyles();
  const handleRowChange = event => {
    changeRowsPerPage(event.target.value);
  };

  const handlePageChange = (event, page) => {
    changePage(page);
  };

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
          page={getPageValue(count, rowsPerPage, page)}
          labelRowsPerPage={textLabels.rowsPerPage}
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} ${textLabels.displayRows} ${count}`}
          backIconButtonProps={{
            id: 'pagination-back',
            'data-testid': 'pagination-back',
            'aria-label': textLabels.previous,
          }}
          nextIconButtonProps={{
            id: 'pagination-next',
            'data-testid': 'pagination-next',
            'aria-label': textLabels.next,
          }}
          SelectProps={{
            id: 'pagination-input',
            SelectDisplayProps: { id: 'pagination-rows', 'data-testid': 'pagination-rows' },
            MenuProps: {
              id: 'pagination-menu',
              'data-testid': 'pagination-menu',
              MenuListProps: { id: 'pagination-menu-list', 'data-testid': 'pagination-menu-list' },
            },
          }}
          rowsPerPageOptions={options.rowsPerPageOptions}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleRowChange}
        />
      </MuiTableRow>
    </MuiTableFooter>
  );
};

TablePagination.propTypes = {
  /** Total number of table rows */
  count: PropTypes.number.isRequired,
  /** Options used to describe table */
  options: PropTypes.object.isRequired,
  /** Current page index */
  page: PropTypes.number.isRequired,
  /** Total number allowed of rows per page */
  rowsPerPage: PropTypes.number.isRequired,
  /** Callback to trigger rows per page change */
  changeRowsPerPage: PropTypes.func.isRequired,
};

export default TablePagination;
