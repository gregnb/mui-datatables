export interface MUIDataTableState {
  //curSelectedRows(curSelectedRows: any, data: string[]);
  data: any[];
  displayData: any[];
  count: number;
  columns: any[];
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
  data: string[];
  lookup: any;
}
