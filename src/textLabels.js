/*
 * Default text labels.
 */
const getTextLabels = () => ({
  body: {
    noMatch: 'Sorry, no matching records found',
    toolTip: 'Sort',
  },
  pagination: {
    next: 'Next Page',
    previous: 'Previous Page',
    rowsPerPage: 'Rows per page:',
    displayRows: 'of',
  },
  toolbar: {
    search: 'Search',
    downloadCsv: 'Download CSV',
    print: 'Print',
    viewColumns: 'View Columns',
    filterTable: 'Filter Table',
  },
  filter: {
    all: 'All',
    title: 'FILTERS',
    reset: 'RESET',
  },
  viewColumns: {
    title: 'Show Columns',
    titleAria: 'Show/Hide Table Columns',
  },
  selectedRows: {
    text: 'row(s) selected',
    delete: 'Delete',
    deleteAria: 'Delete Selected Rows',
  },
  stats: {
    title: 'Select Statistics',
    toolTip: 'Select statistics to show for column',
    types: {
      sum: 'Sum',
      mean: 'Mean',
      median: 'Median',
      sd: 'Standard Deviation',
      qty: 'Quantity',
      min: 'Min',
      max: 'Max',
      mode: 'Mode'
    }
  },
});

export default getTextLabels;
