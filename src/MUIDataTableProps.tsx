import React from 'react';
import { MUIDataTableOptions } from './MUIDataTableOptions';
import { MUIDataTableState } from './MUIDataTableState';

export interface MUIDataTableProps {
  title: string | React.ReactNode;
  columns: MUIDataTableColumnDef[];
  data: Array<object | number[] | string[]>;
  options?: MUIDataTableOptions;
}

type MUIDataTableColumnDef = string | MUIDataTableColumn;

interface MUIDataTableColumn {
  name: string;
  label?: string;
  options?: MUIDataTableColumnOptions;
}

interface MUIDataTableColumnOptions {
  display?: Display;
  empty?: boolean;
  filter?: boolean;
  filterList?: string[];
  filterOptions?: string[];
  filterType?: FilterType;
  sort?: boolean;
  searchable?: boolean;
  sortDirection?: SortDirection;
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
    updateValue: (s: any, c: any, p: any) => any,
  ) => string | React.ReactNode;
  setCellProps?: (cellValue: string, rowIndex: number, columnIndex: number) => object;
}

type Display = 'true' | 'false' | 'excluded';
type SortDirection = 'asc' | 'desc';
export type FilterType = 'dropdown' | 'checkbox' | 'multiselect' | 'textField';

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
