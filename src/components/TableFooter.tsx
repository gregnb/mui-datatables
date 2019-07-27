import React from 'react';
import PropTypes from 'prop-types';
import MuiTable from '@material-ui/core/Table';
import TableHead from './TableHead';
import TablePagination from './TablePagination';
import { withStyles } from '@material-ui/core/styles';

export const defaultFooterStyles = {};

interface TableFooterProps {
  options: any;
  rowCount: any;
  page: any;
  rowsPerPage: any;
  changeRowsPerPage: any;
  changePage: any;
}

class TableFooter extends React.Component<TableFooterProps> {
  static propTypes = {};

  render() {
    const { options, rowCount, page, rowsPerPage, changeRowsPerPage, changePage } = this.props;

    return (
      <MuiTable>
        {options.customFooter
          ? options.customFooter(rowCount, page, rowsPerPage, changeRowsPerPage, changePage)
          : options.pagination && (
              <TablePagination
                count={rowCount}
                page={page}
                rowsPerPage={rowsPerPage}
                changeRowsPerPage={changeRowsPerPage}
                changePage={changePage}
                // TODO fix this error
                //component={'div'}
                options={options}
              />
            )}
      </MuiTable>
    );
  }
}

export default TableFooter;
