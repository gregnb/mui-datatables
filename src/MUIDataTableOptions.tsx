import React from 'react';
import { MUIDataTableTextLabels } from './MUIDataTableTextLabels';
import { MUIDataTableState } from './MUIDataTableState';
import { FilterType } from './MUIDataTableProps';

export interface MUIDataTableOptions {
  caseSensitive?: boolean;
  count?: number;
  customRowRender?: (data: any[], dataIndex: number, rowIndex: number) => React.ReactNode;
  customFooter?: (
    rowCount: number,
    page: number,
    rowsPerPage: number,
    changeRowsPerPage: () => any,
    changePage: number,
  ) => React.ReactNode;
  customSearch?: (searchQuery: string, currentRow: any[], columns: any[]) => boolean;
  customSort?: (data: any[], colIndex: number, order: string) => any[];
  customToolbar?: () => React.ReactNode;
  customToolbarSelect?: (
    selectedRows: {
      data: Array<{
        index: number,
        dataIndex: number,
      }>,
      lookup: {
        [key: number]: boolean,
      },
    },
    displayData: Array<{
      data: any[],
      dataIndex: number,
    }>,
    setSelectedRows: (rows: number[]) => void,
  ) => React.ReactNode;
  download?: boolean;
  downloadOptions?: {
    filename: string,
    separator: string,
  };
  elevation?: number;
  expandableRows?: boolean;
  expandableRowsOnClick?: boolean;
  filter?: boolean;
  filterList?: any;
  filterType?: FilterType;
  fixedHeader?: boolean;
  isRowSelectable?: (dataIndex: number) => boolean;
  onCellClick?: (
    colData: any,
    cellMeta: {
      colIndex: number,
      rowIndex: number,
      dataIndex: number,
      event: React.MouseEvent,
    },
  ) => void;
  onChangePage?: (currentPage: number) => void;
  onChangeRowsPerPage?: (numberOfRows: number) => void;
  onColumnSortChange?: (changedColumn: string | null, direction: string) => void;
  onColumnViewChange?: (changedColumn: string | null, action: string) => void;
  onDownload?: (
    buildHead: (columns: any) => string,
    buildBody: (data: any) => string,
    columns: any,
    data: any,
  ) => string;
  onFilterChange?: (changedColumn: string | null, filterList: any[]) => void;
  onRowClick?: (
    rowData: string[],
    rowMeta: {
      dataIndex: number,
      rowIndex: number,
    },
  ) => void;
  onRowsDelete?: (rowsDeleted: any[]) => void;
  onRowsSelect?: (currentRowsSelected: any[], rowsSelected: any[]) => void;
  onSearchChange?: (searchText: string) => void;
  onTableChange?: (action: string, tableState: MUIDataTableState) => void;
  onTableInit?: (action: any, state: MUIDataTableState) => void;
  page?: number;
  pagination?: boolean;
  print?: boolean;
  renderExpandableRow?: (
    rowData: string[],
    rowMeta: {
      dataIndex: number,
      rowIndex: number,
    },
  ) => React.ReactNode;
  resizableColumns?: boolean;
  responsive?: Responsive;
  rowHover?: boolean;
  rowsPerPage?: number;
  rowsPerPageOptions?: number[];
  rowsSelected?: any[];
  search?: boolean;
  searchText?: string;
  selectableRows?: SelectableRows;
  selectableRowsOnClick?: boolean;
  serverSide?: boolean;
  setRowProps?: (row: any[], rowIndex: number) => object;
  sort?: boolean;
  sortFilterList?: boolean;
  textLabels?: MUIDataTableTextLabels;
  viewColumns?: boolean;
}

type SelectableRows = 'multiple' | 'single' | 'none';

type Responsive = 'stacked' | 'scroll';
