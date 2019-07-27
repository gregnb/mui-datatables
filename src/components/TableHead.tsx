import React from 'react';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import MuiTableHead from '@material-ui/core/TableHead';
import TableHeadRow from './TableHeadRow';
import TableHeadCell from './TableHeadCell';
import TableSelectCell from './TableSelectCell';
import { withStyles, WithStyles } from '@material-ui/core/styles';

const defaultHeadStyles = theme => ({
  main: {},
  responsiveStacked: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
});

interface TableHeadProps extends WithStyles<typeof defaultHeadStyles> {
  activeColumn: string | null;
  data: any[];
  handleHeadUpdateRef: (handleUpdateCheck: any) => void;
  toggleSort: (index: any) => void;
  selectRowUpdate: (arg1: string, arg2: any | null) => void;
  columns: any[];
  count: number;
  options: any;
  page: any;
  rowsPerPage: any;
  setCellRef: (arg1: number, arg2: Element | Text | null) => void;
  selectedRows: any;
}

class TableHead extends React.Component<TableHeadProps> {

  private handleUpdateCheck: any;

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
    const { classes, columns, count, options, setCellRef, selectedRows } = this.props;

    const numSelected = (selectedRows && selectedRows.data.length) || 0;
    const isDeterminate = numSelected > 0 && numSelected < count;
    const isChecked = numSelected === count ? true : false;

    return (
      <MuiTableHead
        className={classNames({ [classes.responsiveStacked]: options.responsive === 'stacked', [classes.main]: true })}>
        <TableHeadRow>
          // @ts-ignore
          <TableSelectCell
            // TODO fix me            
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
                // @ts-ignore
                <TableHeadCell
                  key={index}
                  index={index}
                  // TODO fixme
                  type={'cell'}
                  ref={el => setCellRef(index + 1, findDOMNode(el))}
                  sort={column.sort}
                  sortDirection={column.sortDirection}
                  toggleSort={this.handleToggleColumn}
                  hint={column.hint}
                  print={column.print}
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
