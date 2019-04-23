import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import MuiTable from '@material-ui/core/Table';
import TableHead from './TableHead';
import TablePagination from './TablePagination';
import { withStyles } from '@material-ui/core/styles';

export const defaultFooterStyles = {};

class TableFooter extends React.Component {
  static propTypes = {};

  getPagination = () => {
    const { options, rowCount, page, rowsPerPage, changeRowsPerPage, changePage } = this.props;

    return (
      <TablePagination
        count={rowCount}
        page={page}
        rowsPerPage={rowsPerPage}
        changeRowsPerPage={changeRowsPerPage}
        changePage={changePage}
        component={'div'}
        options={options}
      />
    );
  };

  render() {
    const { options, rowCount, page, rowsPerPage, changeRowsPerPage, changePage } = this.props;

    if (options.portalPagination) {
      return ReactDOM.createPortal(
        options.pagination && <MuiTable>{this.getPagination()}</MuiTable>,
        options.portalPagination,
      );
    }

    return (
      <MuiTable>
        {options.customFooter
          ? options.customFooter(rowCount, page, rowsPerPage, changeRowsPerPage, changePage)
          : options.pagination && this.getPagination()}
      </MuiTable>
    );
  }
}

export default TableFooter;
