import React from 'react';
import { MUIDataTableOptions } from './MUIDataTableOptions';
import { MUIDataTableState } from './MUIDataTableState';
import { WithStyles, Theme, createStyles } from '@material-ui/core';

export const defaultTableStyles = (theme: Theme) =>
  createStyles({
    root: {},
    paper: {},
    tableRoot: {
      outline: 'none',
    },
    responsiveScroll: {
      overflowX: 'auto',
      overflow: 'auto',
      height: '100%',
      maxHeight: '499px',
    },
    responsiveStacked: {
      overflowX: 'auto',
      overflow: 'auto',
      [theme.breakpoints.down('sm')]: {
        overflowX: 'hidden',
        overflow: 'hidden',
      },
    },
    caption: {
      position: 'absolute',
      left: '-3000px',
    },
    liveAnnounce: {
      border: '0',
      clip: 'rect(0 0 0 0)',
      height: '1px',
      margin: '-1px',
      overflow: 'hidden',
      padding: '0',
      position: 'absolute',
      width: '1px',
    },
    '@global': {
      '@media print': {
        '.datatables-noprint': {
          display: 'none',
        },
      },
    },
  });

export interface MUIDataTableProps extends WithStyles<typeof defaultTableStyles> {
  title: string | React.ReactNode;
  columns: MUIDataTableColumnDef[];
  data: Array<object | number[] | string[]>;
  options?: MUIDataTableOptions;
  className?: string;
}

export type MUIDataTableColumnDef = string | MUIDataTableColumn;

export interface MUIDataTableColumn {
  name: string;
  label?: string;
  options?: MUIDataTableColumnOptions;
}

export interface MUIDataTableColumnOptions {
  // TODO not sure if name and label are genuinely set on this object or not.
  name?: string;
  label?: string;
  display?: Display;
  empty?: boolean;
  filter?: boolean;
  filterList?: string[];
  filterOptions?: string[] | { names: any[], logic?: any, display?: any };
  filterType?: FilterType;
  sort?: boolean;
  searchable?: boolean;
  sortDirection?: SortDirection | null;
  print?: boolean;
  download?: boolean;
  viewColumns?: boolean;
  hint?: string;
  customHeadRender?: (
    columnMeta: MUIDataTableCustomHeadRenderer,
    updateDirection: (params: any) => any,
  ) => string | React.ReactNode;
  customBodyRender?: (
    value: any,
    tableMeta: MUIDataTableMeta,
    // TODO is this really supplied or not?...
    // updateValue: (s: any, c: any, p: any) => any,
  ) => string | React.ReactNode;
  customFilterListRender?: (arg: any) => string | false;
  setCellProps?: (cellValue: string, rowIndex: number, columnIndex: number) => object;
}

type Display = 'true' | 'false' | 'excluded';
type SortDirection = 'asc' | 'desc';
export type FilterType = 'dropdown' | 'checkbox' | 'multiselect' | 'textField' | 'custom';

interface MUIDataTableCustomHeadRenderer extends MUIDataTableColumn {
  index: number;
}

interface MUIDataTableData {
  index: number;
  data: Array<object | number[] | string[]>;
}

interface MUIDataTableMeta {
  rowIndex: number;
  columnIndex: number;
  columnData: MUIDataTableColumnOptions[];
  rowData: any[];
  tableData: MUIDataTableData[];
  tableState: MUIDataTableState;
}
