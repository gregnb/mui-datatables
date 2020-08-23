import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import MuiTableBody from '@material-ui/core/TableBody';
import TableBodyCell from './TableBodyCell';
import TableBodyRow from './TableBodyRow';
import TableSelectCell from './TableSelectCell';
import TableBodyGroupHeaderRow from './TableBodyGroupHeaderRow';
import TableBodyGroupDataRow from './TableBodyGroupDataRow';
import { withStyles } from '@material-ui/core/styles';
import cloneDeep from 'lodash.clonedeep';
import { getPageValue } from '../utils';
import clsx from 'clsx';

const defaultBodyStyles = theme => ({
  root: {},
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

  flattenGroups(rows, rootGroup, columns, grouping, isGroupExpanded) {
    for (let prop in rootGroup.groups) {
      let group = rootGroup.groups[prop];
      if (group.data) {
        let isExpanded = isGroupExpanded(grouping, group.group);
        rows.push({
          rowType: 'group',
          level: rootGroup.level,
          id: group.group.join('___GROUPJOIN___'),
          columnIndex: rootGroup.groupColumnIndex,
          columnName: columns[rootGroup.groupColumnIndex].name,
          columnLabel: columns[rootGroup.groupColumnIndex].label || columns[rootGroup.groupColumnIndex].name,
          columnValue: prop,
          expanded: isExpanded,
          onExpansionChange: group.onExpansionChange,
        });

        if (isExpanded) {
          rows.push({
            rowType: 'data',
            id: group.group.join('___GROUPJOIN___') + '_data',
            data: group,
          });
        }
      } else {
        let isExpanded = isGroupExpanded(grouping, group.group);
        rows.push({
          rowType: 'group',
          level: rootGroup.level,
          id: group.group.join('___GROUPJOIN___'),
          columnIndex: rootGroup.groupColumnIndex,
          columnName: columns[rootGroup.groupColumnIndex].name,
          columnLabel: columns[rootGroup.groupColumnIndex].label || columns[rootGroup.groupColumnIndex].name,
          columnValue: prop,
          expanded: isExpanded,
          onExpansionChange: group.onExpansionChange,
        });

        if (isExpanded) {
          this.flattenGroups(rows, rootGroup.groups[prop], columns, grouping, isGroupExpanded);
        }
      }
    }

    return rows;
  }

  buildRows(groupingData, columns, grouping, isGroupExpanded) {
    let rows = this.flattenGroups([], groupingData, columns, grouping, isGroupExpanded);
    return rows;
  }

  render() {
    const { grouping, isGroupExpanded, classes, columns, groupingData } = this.props;
    let tableData = this.props.data;

    let rows = this.buildRows(groupingData, columns, grouping, isGroupExpanded);

    console.log('rows');
    console.dir(rows);

    return (
      <MuiTableBody>
        {rows.map((data, rowIndex) => {
          let RowComponent = data.rowType === 'group' ? TableBodyGroupHeaderRow : TableBodyGroupDataRow;
          return (
            <RowComponent
              row={data}
              data={tableData}
              columns={columns}
              count={this.props.count}
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
              key={data.id}
            />
          );
        })}
      </MuiTableBody>
    );
  }
}

export default withStyles(defaultBodyStyles, { name: 'MUIDataTableBody' })(TableBody);
