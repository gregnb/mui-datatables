import React from 'react';
import PropTypes from 'prop-types';
import TableHead from './TableHead';
import TablePagination from './TablePagination';
import { Table as MuiTable, withStyles } from '@material-ui/core';

export const defaultFooterStyles = {};

class TableFooter extends React.Component {
  static propTypes = {};

  render() {
    const { options, rowCount, page, rowsPerPage, changeRowsPerPage, changePage } = this.props;

    return (
      <MuiTable>
        {options.customFooter
          ? options.customFooter(
              rowCount,
              page,
              rowsPerPage,
              changeRowsPerPage,
              changePage,
              options.textLabels.pagination,
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
  }
}

export default TableFooter;
