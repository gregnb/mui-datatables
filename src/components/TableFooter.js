import React from 'react';
import MuiTable from '@material-ui/core/Table';
import TablePagination from './TablePagination';

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
