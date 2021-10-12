import React from 'react';
import MuiTable from '@material-ui/core/Table';
import TablePagination from './TablePagination';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles(
  () => ({
    root: {
      '@media print': {
        display: 'none',
      },
    },
  }),
  { name: 'MUIDataTableFooter' },
);

const TableFooter = ({ options, rowCount, page, rowsPerPage, changeRowsPerPage, changePage, toolbar }) => {
  const classes = useStyles();
  const { customFooter, pagination = true } = options;

  if (customFooter) {
    return (
      <MuiTable className={classes.root}>
        {options.customFooter(
          rowCount,
          page,
          rowsPerPage,
          changeRowsPerPage,
          changePage,
          options.textLabels.pagination,
        )}
      </MuiTable>
    );
  }

  if (pagination) {
    return (
      <MuiTable className={classes.root}>
        <TablePagination
          count={rowCount}
          page={page}
          rowsPerPage={rowsPerPage}
          changeRowsPerPage={changeRowsPerPage}
          changePage={changePage}
          component={'div'}
          options={options}
          toolbar={toolbar}
        />
      </MuiTable>
    );
  }

  return null;
};

TableFooter.propTypes = {
  /** Total number of table rows */
  rowCount: PropTypes.number.isRequired,
  /** Options used to describe table */
  options: PropTypes.shape({
    customFooter: PropTypes.func,
    pagination: PropTypes.bool,
    textLabels: PropTypes.shape({
      pagination: PropTypes.object,
    }),
  }),
  /** Current page index */
  page: PropTypes.number.isRequired,
  /** Total number allowed of rows per page */
  rowsPerPage: PropTypes.number.isRequired,
  /** Callback to trigger rows per page change */
  changeRowsPerPage: PropTypes.func.isRequired,
  /** Callback to trigger page change */
  changePage: PropTypes.func.isRequired,
};

export default TableFooter;
