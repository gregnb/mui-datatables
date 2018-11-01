import PropTypes from "prop-types";

export const OptionPropTypes = PropTypes.shape({
  responsive: PropTypes.oneOf(["stacked", "scroll"]),
  filterType: PropTypes.oneOf(["dropdown", "checkbox", "multiselect"]),
  textLabels: PropTypes.object,
  pagination: PropTypes.bool,
  customToolbar: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  customToolbarSelect: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  customFooter: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  onRowClick: PropTypes.func,
  resizableColumns: PropTypes.bool,
  selectableRows: PropTypes.bool,
  serverSide: PropTypes.bool,
  onTableChange: PropTypes.func,
  caseSensitive: PropTypes.bool,
  rowHover: PropTypes.bool,
  fixedHeader: PropTypes.bool,
  fixedToolbar: PropTypes.bool,
  page: PropTypes.number,
  count: PropTypes.number,
  filterList: PropTypes.array,
  rowsSelected: PropTypes.array,
  rowsPerPage: PropTypes.number,
  rowsPerPageOptions: PropTypes.array,
  filter: PropTypes.bool,
  sort: PropTypes.bool,
  customSort: PropTypes.func,
  search: PropTypes.bool,
  print: PropTypes.bool,
  viewColumns: PropTypes.bool,
  download: PropTypes.bool,
  downloadOptions: PropTypes.shape({
    filename: PropTypes.string,
    separator: PropTypes.string,
  }),
});

export const MUIDataTablePropTypes = {
  /** Title of the table */
  title: PropTypes.string.isRequired,
  /** Data used to describe table */
  data: PropTypes.array.isRequired,
  /** Columns used to describe table */
  columns: PropTypes.PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        options: PropTypes.shape({
          display: PropTypes.string, // enum('true', 'false', 'excluded')
          filter: PropTypes.bool,
          sort: PropTypes.bool,
          download: PropTypes.bool,
          customHeadRender: PropTypes.func,
          customBodyRender: PropTypes.func,
        }),
      }),
    ]),
  ).isRequired,
  /** Options used to describe table */
  options: OptionPropTypes,
  /** Pass and use className to style MUIDataTable as desired */
  className: PropTypes.string,
};
