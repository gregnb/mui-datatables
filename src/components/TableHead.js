import { withStyles } from '@material-ui/core/styles';
import MuiTableHead from '@material-ui/core/TableHead';
import classNames from 'classnames';
import React from 'react';
import { findDOMNode } from 'react-dom';
import TableHeadCell from './TableHeadCell';
import TableHeadRow from './TableHeadRow';
import TableSelectCell from './TableSelectCell';

const defaultHeadStyles = theme => ({
  main: {},
  responsiveStacked: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  responsiveSimple: {
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
});

class TableHead extends React.Component {
  componentDidMount() {
    this.props.handleHeadUpdateRef(this.handleUpdateCheck);
  }

  handleToggleColumn = index => {
    this.props.toggleSort(index);
  };

  handleRowSelect = () => {
    this.props.selectRowUpdate('head', null);
  };

  render() {
    const {
      classes,
      columns,
      count,
      options,
      data,
      setCellRef,
      selectedRows,
      expandedRows,
      sortOrder = {},
      components = {},
    } = this.props;

    const numSelected = (selectedRows && selectedRows.data.length) || 0;
    let isIndeterminate = numSelected > 0 && numSelected < count;
    let isChecked = numSelected > 0 && numSelected >= count;

    // When the disableToolbarSelect option is true, there can be
    // selected items that aren't visible, so we need to be more
    // precise when determining if the head checkbox should be checked.
    if (
      options.disableToolbarSelect === true ||
      options.selectToolbarPlacement === 'none' ||
      options.selectToolbarPlacement === 'above'
    ) {
      if (isChecked) {
        for (let ii = 0; ii < data.length; ii++) {
          if (!selectedRows.lookup[data[ii].dataIndex]) {
            isChecked = false;
            isIndeterminate = true;
            break;
          }
        }
      } else {
        if (numSelected > count) {
          isIndeterminate = true;
        }
      }
    }

    return (
      <MuiTableHead
        className={classNames({
          [classes.responsiveStacked]:
            options.responsive === 'vertical' ||
            options.responsive === 'stacked' ||
            options.responsive === 'stackedFullWidth',
          [classes.responsiveSimple]: options.responsive === 'simple',
          [classes.main]: true,
        })}>
        <TableHeadRow>
          <TableSelectCell
            ref={el => setCellRef(0, findDOMNode(el))}
            onChange={this.handleRowSelect.bind(null)}
            indeterminate={isIndeterminate}
            checked={isChecked}
            isHeaderCell={true}
            expandedRows={expandedRows}
            expandableRowsHeader={options.expandableRowsHeader}
            expandableOn={options.expandableRows}
            selectableOn={options.selectableRows}
            fixedHeader={options.fixedHeader}
            fixedSelectColumn={options.fixedSelectColumn}
            selectableRowsHeader={options.selectableRowsHeader}
            onExpand={this.props.toggleAllExpandableRows}
            isRowSelectable={true}
          />
          {columns.map(
            (column, index) =>
              column.display === 'true' &&
              (column.customHeadRender ? (
                column.customHeadRender({ index, ...column }, this.handleToggleColumn, sortOrder)
              ) : (
                <TableHeadCell
                  cellHeaderProps={
                    columns[index].setCellHeaderProps ? columns[index].setCellHeaderProps({ index, ...column }) : {}
                  }
                  key={index}
                  index={index}
                  type={'cell'}
                  ref={el => setCellRef(index + 1, findDOMNode(el))}
                  sort={column.sort}
                  sortDirection={column.name === sortOrder.name ? sortOrder.direction : 'none'}
                  toggleSort={this.handleToggleColumn}
                  hint={column.hint}
                  print={column.print}
                  options={options}
                  column={column}
                  components={components}>
                  {column.label}
                </TableHeadCell>
              )),
          )}
        </TableHeadRow>
      </MuiTableHead>
    );
  }
}

export default withStyles(defaultHeadStyles, { name: 'MUIDataTableHead' })(TableHead);
