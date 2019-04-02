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
  emptyCell: {
    '@media screen and (max-width: 960px)': {
      display: 'none',
    },
    width: '56px',
    maxWidth: '56px',
    backgroundColor: '#F4F7FA',
    position: 'sticky',
    top: 0,
    zIndex: 3,
  },
  sticky: {
    position: 'sticky',
    top: 0,
    zIndex: 3,
  },
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

  handleGroupHeader = () => {
    const { columns } = this.props;
    let groupHeader = null;
    let lastGroup = '';
    let lastIndex = -1;

    if (columns.filter(column => column.display === 'true' && column.group).length > 0) {
      groupHeader = {};

      columns.forEach((column, index) => {
        if (column.display === 'true') {
          if (column.group === lastGroup) {
            groupHeader[lastIndex].colspan += 1;
          } else {
            groupHeader[index] = { name: column.group, colspan: 1 };
            lastIndex = index;
          }

          lastGroup = column.group;
        }
      });
    }

    return groupHeader;
  };

  render() {
    const { classes, columns, count, options, data, page, setCellRef, selectedRows } = this.props;

    const numSelected = (selectedRows && selectedRows.data.length) || 0;
    const isDeterminate = numSelected > 0 && numSelected < count;
    const isChecked = numSelected === count ? true : false;
    const groupHeader = this.handleGroupHeader();

    return (
      <MuiTableHead
        className={classNames({ [classes.responsiveStacked]: options.responsive === 'stacked', [classes.main]: true })}>
        {groupHeader && (
          <TableHeadRow>
            {options.selectableRows && (
              <TableHeadCell className={classes.emptyCell} options={options} toggleSort={() => {}} sort={false} />
            )}
            {Object.keys(groupHeader).map((key, index) => {
              return (
                <TableHeadCell
                  colSpan={groupHeader[key].colspan}
                  key={index}
                  index={index}
                  type={'cell'}
                  ref={el => setCellRef(index + 1, findDOMNode(el))}
                  options={{}}
                  toggleSort={() => {}}
                  sort={false}>
                  {groupHeader[key].name}
                </TableHeadCell>
              );
            })}
          </TableHeadRow>
        )}
        <TableHeadRow>
          {options.selectableRows &&
            (options.radio ? (
              <TableHeadCell className={classes.emptyCell} options={options} />
            ) : (
              <TableSelectCell
                ref={el => setCellRef(0, findDOMNode(el))}
                onChange={this.handleRowSelect.bind(null)}
                indeterminate={isDeterminate}
                checked={isChecked}
                isHeaderCell={true}
                isExpandable={options.expandableRows}
                fixedHeader={options.fixedHeader}
                isRowSelectable={true}
              />
            ))}
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
                  {column.name}
                </TableHeadCell>
              )),
          )}
        </TableHeadRow>
      </MuiTableHead>
    );
  }
}

export default withStyles(defaultHeadStyles, { name: 'MUIDataTableHead' })(TableHead);
