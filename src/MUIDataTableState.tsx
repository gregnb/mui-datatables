import { MUIDataTableColumnOptions } from './MUIDataTableProps';

export interface MUIDataTableState {
  //curSelectedRows(curSelectedRows: any, data: string[]);
  data: any[];
  displayData: any[];
  count: number;
  columns: MUIDataTableColumnOptions[];
  curSelectedRows?: any[];
  filterData: any[];
  announceText: string | null;
  activeColumn: string | null;
  page: number;
  rowsPerPage: number;
  filterList: string[][];
  selectedRows: MUIDataTableStateRows;
  expandedRows: MUIDataTableStateRows;
  showResponsive: boolean;
  searchText: string | null;
  rowsPerPageOptions?: number[];
}

interface MUIDataTableStateRows {
  data: { dataIndex: number }[];
  lookup: any;
}
