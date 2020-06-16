import React from 'react';
import MuiTable from '@material-ui/core/Table';
import TablePagination from './TablePagination';
import { makeStyles } from '@material-ui/core/styles';

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

const TableFooter = ({ options, rowCount, page, rowsPerPage, changeRowsPerPage, changePage }) => {
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
        />
      </MuiTable>
    );
  }

  return <MuiTable className={classes.root} />;
};

export default TableFooter;
