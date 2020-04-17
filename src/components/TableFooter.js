import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import MuiTable from '@material-ui/core/Table';
import TableHead from './TableHead';
import TablePagination from './TablePagination';
import { withStyles } from '@material-ui/core/styles';

export const defaultFooterStyles = {};

const TableFooter = ({ options, rowCount, page, rowsPerPage, changeRowsPerPage, changePage, tableState, cellRefs }) => {

  return (
    <MuiTable>
      {options.customFooter
        ? options.customFooter(
          rowCount,
          page,
          rowsPerPage,
          changeRowsPerPage,
          changePage,
          options,
          tableState,
          cellRefs
        )
        : options.pagination && (
          <TablePagination
            count={rowCount}
            page={page}
            rowsPerPage={rowsPerPage}
            changeRowsPerPage={changeRowsPerPage}
            changePage={changePage}
            component={'div'}
            options={options}
          />
        )}
    </MuiTable>
  );
};

export default TableFooter;
