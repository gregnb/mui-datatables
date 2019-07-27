export interface MUIDataTableTextLabels {
  body: MUIDataTableTextLabelsBody;
  pagination: MUIDataTableTextLabelsPagination;
  toolbar: MUIDataTableTextLabelsToolbar;
  filter: MUIDataTableTextLabelsFilter;
  viewColumns: MUIDataTableTextLabelsViewColumns;
  selectedRows: MUIDataTableTextLabelsSelectedRows;
}

export interface MUIDataTableTextLabelsBody {
  noMatch: string;
  toolTip: string;
}

export interface MUIDataTableTextLabelsPagination {
  next: string;
  previous: string;
  rowsPerPage: string;
  displayRows: string;
}

export interface MUIDataTableTextLabelsToolbar {
  search: string;
  downloadCsv: string;
  print: string;
  viewColumns: string;
  filterTable: string;
}

export interface MUIDataTableTextLabelsFilter {
  all: string;
  title: string;
  reset: string;
}

export interface MUIDataTableTextLabelsViewColumns {
  title: string;
  titleAria: string;
}

export interface MUIDataTableTextLabelsSelectedRows {
  text: string;
  delete: string;
  deleteAria: string;
}
