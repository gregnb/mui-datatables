import React from 'react';
import PropTypes from 'prop-types';
import TableBodyRows from './TableBodyRows';
import { withStyles } from '@material-ui/core/styles';
import cloneDeep from 'lodash.clonedeep';
import { getPageValue } from '../utils';
import clsx from 'clsx';

const defaultBodyStyles = theme => ({
  root: {},
});

function TableBodyGroupDataRow(props) {
  const { row } = props;
  console.dir(props);
  return (
    <TableBodyRows
      tableRows={row.data.data}
      data={props.data}
      count={props.count}
      columns={props.columns}
      page={props.page}
      rowsPerPage={props.rowsPerPage}
      selectedRows={props.selectedRows}
      selectRowUpdate={props.selectRowUpdate}
      previousSelectedRow={props.previousSelectedRow}
      expandedRows={props.expandedRows}
      toggleExpandRow={props.toggleExpandRow}
      options={props.options}
      columnOrder={props.columnOrder}
      filterList={props.filterList}
      components={props.components}
      tableId={props.tableId}
    />
  );
}

export default TableBodyGroupDataRow;
