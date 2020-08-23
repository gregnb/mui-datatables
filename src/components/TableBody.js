import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import MuiTableBody from '@material-ui/core/TableBody';
import TableBodyCell from './TableBodyCell';
import TableBodyRow from './TableBodyRow';
import TableSelectCell from './TableSelectCell';
import TableBodyRows from './TableBodyRows';
import { withStyles } from '@material-ui/core/styles';
import cloneDeep from 'lodash.clonedeep';
import { getPageValue } from '../utils';
import clsx from 'clsx';

const defaultBodyStyles = theme => ({
  root: {},
  emptyTitle: {
    textAlign: 'center',
  },
  lastStackedCell: {
    [theme.breakpoints.down('sm')]: {
      '& td:last-child': {
        borderBottom: 'none',
      },
    },
  },
  lastSimpleCell: {
    [theme.breakpoints.down('xs')]: {
      '& td:last-child': {
        borderBottom: 'none',
      },
    },
  },
});

class TableBody extends React.Component {
  static propTypes = {
    /** Data used to describe table */
    data: PropTypes.array.isRequired,
    /** Total number of data rows */
    count: PropTypes.number.isRequired,
    /** Columns used to describe table */
    columns: PropTypes.array.isRequired,
    /** Options used to describe table */
    options: PropTypes.object.isRequired,
    /** Data used to filter table against */
    filterList: PropTypes.array,
    /** Callback to execute when row is clicked */
    onRowClick: PropTypes.func,
    /** Table rows expanded */
    expandedRows: PropTypes.object,
    /** Table rows selected */
    selectedRows: PropTypes.object,
    /** Callback to trigger table row select */
    selectRowUpdate: PropTypes.func,
    /** The most recent row to have been selected/unselected */
    previousSelectedRow: PropTypes.object,
    /** Data used to search table against */
    searchText: PropTypes.string,
    /** Toggle row expandable */
    toggleExpandRow: PropTypes.func,
    /** Extend the style applied to components */
    classes: PropTypes.object,
  };

  static defaultProps = {
    toggleExpandRow: () => {},
  };

  buildRows() {
    const { data, page, rowsPerPage, count } = this.props;

    if (this.props.options.serverSide) return data.length ? data : null;

    let rows = [];
    const highestPageInRange = getPageValue(count, rowsPerPage, page);
    const fromIndex = highestPageInRange === 0 ? 0 : highestPageInRange * rowsPerPage;
    const toIndex = Math.min(count, (highestPageInRange + 1) * rowsPerPage);

    if (page > highestPageInRange) {
      console.warn('Current page is out of range, using the highest page that is in range instead.');
    }

    for (let rowIndex = fromIndex; rowIndex < count && rowIndex < toIndex; rowIndex++) {
      if (data[rowIndex] !== undefined) rows.push(data[rowIndex]);
    }

    return rows.length ? rows : null;
  }

  render() {
    const {
      classes,
      columns,
      toggleExpandRow,
      options,
      columnOrder = this.props.columns.map((item, idx) => idx),
      components = {},
      tableId,
    } = this.props;
    const tableRows = this.buildRows();

    return (
      <MuiTableBody>
        <TableBodyRows
          tableRows={tableRows}
          data={this.props.data}
          count={this.props.count}
          columns={this.props.columns}
          page={this.props.page}
          rowsPerPage={this.props.rowsPerPage}
          selectedRows={this.props.selectedRows}
          selectRowUpdate={this.props.selectRowUpdate}
          previousSelectedRow={this.props.previousSelectedRow}
          expandedRows={this.props.expandedRows}
          toggleExpandRow={this.props.toggleExpandRow}
          options={this.props.options}
          columnOrder={this.props.columnOrder}
          filterList={this.props.filterList}
          components={this.props.components}
          tableId={this.props.tableId}
        />
      </MuiTableBody>
    );
  }
}

export default withStyles(defaultBodyStyles, { name: 'MUIDataTableBody' })(TableBody);
