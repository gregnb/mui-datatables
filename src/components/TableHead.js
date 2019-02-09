import React from 'react';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import MuiTableHead from '@material-ui/core/TableHead';
import TableHeadRow from './TableHeadRow';
import TableHeadCell from './TableHeadCell';
import TableSelectCell from './TableSelectCell';
import { withStyles } from '@material-ui/core/styles';

const defaultHeadStyles = theme => ({
  main: {},
  responsiveStacked: {
    [theme.breakpoints.down('sm')]: {
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
    const { classes, columns, count, options, data, page, setCellRef, selectedRows } = this.props;

    const numSelected = (selectedRows && selectedRows.data.length) || 0;
    const isDeterminate = numSelected > 0 && numSelected < count;
    const isChecked = numSelected === count ? true : false;

    return (
      <MuiTableHead
        className={classNames({ [classes.responsiveStacked]: options.responsive === 'stacked', [classes.main]: true })}>
        <TableHeadRow>
          <TableSelectCell
            ref={el => setCellRef(0, findDOMNode(el))}
            onChange={this.handleRowSelect.bind(null)}
            indeterminate={isDeterminate}
            checked={isChecked}
            isHeaderCell={true}
            expandableOn={options.expandableRows}
            selectableOn={options.selectableRows}
            fixedHeader={options.fixedHeader}
            isRowSelectable={true}
          />
          {columns.map(
            (column, index) =>
              column.display === 'true' &&
              (column.customHeadRender ? (
                column.customHeadRender({ index, ...column }, this.handleToggleColumn)
              ) : (
                <TableHeadCell
                  key={index}
                  index={index}
                  type={'cell'}
                  ref={el => setCellRef(index + 1, findDOMNode(el))}
                  sort={column.sort}
                  sortDirection={column.sortDirection}
                  toggleSort={this.handleToggleColumn}
                  hint={column.hint}
                  options={options}>
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
