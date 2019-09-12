import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import MuiTable from '@material-ui/core/Table';
import classnames from 'classnames';
import assignwith from 'lodash.assignwith';
import cloneDeep from 'lodash.clonedeep';
import find from 'lodash.find';
import isUndefined from 'lodash.isundefined';
import merge from 'lodash.merge';
import PropTypes from 'prop-types';
import React from 'react';
import TableBody from './components/TableBody';
import TableFilterList from './components/TableFilterList';
import TableFooter from './components/TableFooter';
import TableHead from './components/TableHead';
import TableResize from './components/TableResize';
import TableToolbar from './components/TableToolbar';
import TableToolbarSelect from './components/TableToolbarSelect';
import textLabels from './textLabels';
import { buildMap, getCollatorComparator, sortCompare } from './utils';

const defaultTableStyles = theme => ({
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
  responsiveScrollMaxHeight: {
    overflowX: 'auto',
    overflow: 'auto',
    height: '100%',
    maxHeight: '499px',
  },
  responsiveScrollFullHeight: {
    overflowX: 'auto',
    overflow: 'auto',
    height: '100%',
    maxHeight: 'none',
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

const TABLE_LOAD = {
  INITIAL: 1,
  UPDATE: 2,
};

// Populate this list with anything that might render in the toolbar to determine if we hide the toolbar
const TOOLBAR_ITEMS = ['title', 'filter', 'search', 'print', 'download', 'viewColumns', 'customToolbar'];

const hasToolbarItem = (options, title) => {
  options.title = title;

  return !isUndefined(find(TOOLBAR_ITEMS, i => options[i]));
};

class MUIDataTable extends React.Component {
  static propTypes = {
    /** Title of the table */
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
    /** Data used to describe table */
    data: PropTypes.array.isRequired,
    /** Columns used to describe table */
    columns: PropTypes.PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          label: PropTypes.string,
          name: PropTypes.string.isRequired,
          options: PropTypes.shape({
            display: PropTypes.oneOf(['true', 'false', 'excluded']),
            empty: PropTypes.bool,
            filter: PropTypes.bool,
            sort: PropTypes.bool,
            print: PropTypes.bool,
            searchable: PropTypes.bool,
            download: PropTypes.bool,
            viewColumns: PropTypes.bool,
            filterList: PropTypes.array,
            sortDirection: PropTypes.oneOf(['asc', 'desc', 'none']),
            filterOptions: PropTypes.oneOfType([
              PropTypes.array,
              PropTypes.shape({
                names: PropTypes.array,
                logic: PropTypes.func,
                display: PropTypes.func,
              }),
            ]),
            filterType: PropTypes.oneOf(['dropdown', 'checkbox', 'multiselect', 'textField', 'custom']),
            customHeadRender: PropTypes.func,
            customBodyRender: PropTypes.func,
            customFilterListRender: PropTypes.func,
          }),
        }),
      ]),
    ).isRequired,
    /** Options used to describe table */
    options: PropTypes.shape({
      responsive: PropTypes.oneOf(['stacked', 'scrollMaxHeight', 'scrollFullHeight']),
      filterType: PropTypes.oneOf(['dropdown', 'checkbox', 'multiselect', 'textField', 'custom']),
      textLabels: PropTypes.object,
      pagination: PropTypes.bool,
      expandableRows: PropTypes.bool,
      expandableRowsOnClick: PropTypes.bool,
      renderExpandableRow: PropTypes.func,
      customToolbar: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
      customToolbarSelect: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
      customFooter: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
      customSearchRender: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
      customRowRender: PropTypes.func,
      onRowClick: PropTypes.func,
      onRowsSelect: PropTypes.func,
      resizableColumns: PropTypes.bool,
      selectableRows: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(['none', 'single', 'multiple'])]),
      selectableRowsOnClick: PropTypes.bool,
      isRowSelectable: PropTypes.func,
      selectableRowsHeader: PropTypes.bool,
      serverSide: PropTypes.bool,
      onTableChange: PropTypes.func,
      onTableInit: PropTypes.func,
      caseSensitive: PropTypes.bool,
      rowHover: PropTypes.bool,
      fixedHeader: PropTypes.bool,
      page: PropTypes.number,
      count: PropTypes.number,
      rowsSelected: PropTypes.array,
      rowsExpanded: PropTypes.array,
      rowsPerPage: PropTypes.number,
      rowsPerPageOptions: PropTypes.array,
      filter: PropTypes.bool,
      sort: PropTypes.bool,
      customSort: PropTypes.func,
      customSearch: PropTypes.func,
      search: PropTypes.bool,
      searchText: PropTypes.string,
      searchPlaceholder: PropTypes.string,
      print: PropTypes.bool,
      viewColumns: PropTypes.bool,
      download: PropTypes.bool,
      downloadOptions: PropTypes.shape({
        filename: PropTypes.string,
        separator: PropTypes.string,
        filterOptions: PropTypes.shape({
          useDisplayedColumnsOnly: PropTypes.bool,
          useDisplayedRowsOnly: PropTypes.bool,
        }),
      }),
      onDownload: PropTypes.func,
    }),
    /** Pass and use className to style MUIDataTable as desired */
    className: PropTypes.string,
  };

  static defaultProps = {
    title: '',
    options: {},
    data: [],
    columns: [],
  };

  state = {
    announceText: null,
    activeColumn: null,
    data: [],
    displayData: [],
    page: 0,
    rowsPerPage: 0,
    count: 0,
    columns: [],
    filterData: [],
    filterList: [],
    selectedRows: {
      data: [],
      lookup: {},
    },
    previousSelectedRow: null,
    expandedRows: {
      data: [],
      lookup: {},
    },
    showResponsive: false,
    searchText: null,
  };

  constructor() {
    super();
    this.tableRef = false;
    this.tableContent = React.createRef();
    this.headCellRefs = {};
    this.setHeadResizeable = () => {};
    this.updateDividers = () => {};
  }

  UNSAFE_componentWillMount() {
    this.initializeTable(this.props);
  }

  componentDidMount() {
    this.setHeadResizeable(this.headCellRefs, this.tableRef);

    // When we have a search, we must reset page to view it unless on serverSide since paging is handled by the user.
    if (this.props.options.searchText && !this.props.options.serverSide) this.setState({ page: 0 });
  }

  componentDidUpdate(prevProps) {
    if (this.props.data !== prevProps.data || this.props.columns !== prevProps.columns) {
      this.updateOptions(this.options, this.props);
      this.setTableData(this.props, TABLE_LOAD.INITIAL, () => {
        this.setTableAction('propsUpdate');
      });
    }

    if (this.props.options.searchText !== prevProps.options.searchText && !this.props.options.serverSide) {
      // When we have a search, we must reset page to view it unless on serverSide since paging is handled by the user.
      this.setState({ page: 0 });
    }

    if (this.options.resizableColumns) {
      this.setHeadResizeable(this.headCellRefs, this.tableRef);
      this.updateDividers();
    }
  }

  updateOptions(options, props) {
    this.options = assignwith(options, props.options, (objValue, srcValue, key) => {
      // Merge any default options that are objects, as they will be overwritten otherwise
      if (key === 'textLabels' || key === 'downloadOptions') return merge(objValue, srcValue);
      return;
    });

    this.handleOptionDeprecation(props);
  }

  initializeTable(props) {
    this.mergeDefaultOptions(props);
    this.setTableOptions();
    this.setTableData(props, TABLE_LOAD.INITIAL, () => {
      this.setTableInit('tableInitialized');
    });
  }

  getDefaultOptions = () => ({
    responsive: 'stacked',
    filterType: 'dropdown',
    pagination: true,
    textLabels,
    expandableRows: false,
    expandableRowsOnClick: false,
    resizableColumns: false,
    selectableRows: 'multiple',
    selectableRowsOnClick: false,
    selectableRowsHeader: true,
    caseSensitive: false,
    serverSide: false,
    rowHover: true,
    fixedHeader: true,
    elevation: 4,
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 15, 100],
    filter: true,
    sortFilterList: true,
    sort: true,
    search: true,
    print: true,
    viewColumns: true,
    download: true,
    downloadOptions: {
      filename: 'tableDownload.csv',
      separator: ',',
    },
  });

  handleOptionDeprecation = props => {
    if (typeof props.options.selectableRows === 'boolean') {
      console.error(
        'Using a boolean for selectableRows has been deprecated. Please use string option: multiple | single | none',
      );
      this.options.selectableRows = props.options.selectableRows ? 'multiple' : 'none';
    }
    if (['scrollMaxHeight', 'scrollFullHeight', 'stacked'].indexOf(props.options.responsive) === -1) {
      console.error(
        'Invalid option value for responsive. Please use string option: scrollMaxHeight | scrollFullHeight | stacked',
      );
    }
    if (props.options.responsive === 'scroll') {
      console.error('This option has been deprecated. It is being replaced by scrollMaxHeight');
    }
  };

  /*
   * React currently does not support deep merge for defaultProps. Objects are overwritten
   */
  mergeDefaultOptions(props) {
    const defaultOptions = this.getDefaultOptions();

    this.updateOptions(defaultOptions, this.props);
  }

  validateOptions(options) {
    if (options.serverSide && options.onTableChange === undefined) {
      throw Error('onTableChange callback must be provided when using serverSide option');
    }
    if (options.expandableRows && options.renderExpandableRow === undefined) {
      throw Error('renderExpandableRow must be provided when using expandableRows option');
    }
    if (this.props.options.filterList) {
      console.error(
        'Deprecated: filterList must now be provided under each column option. see https://github.com/gregnb/mui-datatables/tree/master/examples/column-filters example',
      );
    }
  }

  setTableAction = action => {
    if (typeof this.options.onTableChange === 'function') {
      this.options.onTableChange(action, this.state);
    }
  };

  setTableInit = action => {
    if (typeof this.options.onTableInit === 'function') {
      this.options.onTableInit(action, this.state);
    }
  };

  setTableOptions() {
    const optionNames = ['rowsPerPage', 'page', 'rowsSelected', 'rowsPerPageOptions'];
    const optState = optionNames.reduce((acc, cur) => {
      if (this.options[cur] !== undefined) {
        acc[cur] = this.options[cur];
      }
      return acc;
    }, {});

    this.validateOptions(optState);
    this.setState(optState);
  }

  setHeadCellRef = (index, el) => {
    this.headCellRefs[index] = el;
  };

  // must be arrow function on local field to refer to the correct instance when passed around
  // assigning it as arrow function in the JSX would cause hard to track re-render errors
  getTableContentRef = () => this.tableContent.current;

  /*
   *  Build the source table data
   */

  buildColumns = newColumns => {
    let columnData = [];
    let filterData = [];
    let filterList = [];
    let sortDirectionSet = false;

    newColumns.forEach((column, colIndex) => {
      let columnOptions = {
        display: 'true',
        empty: false,
        filter: true,
        sort: true,
        print: true,
        searchable: true,
        download: true,
        viewColumns: true,
        sortDirection: 'none',
      };

      if (typeof column === 'object') {
        if (column.options) {
          if (column.options.display !== undefined) {
            column.options.display = column.options.display.toString();
          }

          if (column.options.sortDirection === null) {
            console.error(
              'The "null" option for sortDirection is deprecated. sortDirection is an enum, use "asc" | "desc" | "none"',
            );
            column.options.sortDirection = 'none';
          }

          if (column.options.sortDirection !== undefined) {
            if (sortDirectionSet) {
              console.error('sortDirection is set for more than one column. Only the first column will be considered.');
              column.options.sortDirection = 'none';
            } else {
              sortDirectionSet = true;
            }
          }
        }

        columnOptions = {
          name: column.name,
          label: column.label ? column.label : column.name,
          ...columnOptions,
          ...(column.options ? column.options : {}),
        };
      } else {
        columnOptions = { ...columnOptions, name: column, label: column };
      }

      columnData.push(columnOptions);

      filterData[colIndex] = [];
      filterList[colIndex] = [];
    });

    return { columns: columnData, filterData, filterList };
  };

  transformData = (columns, data) => {
    const leaf = (obj, path) => path.split('.').reduce((value, el) => (value ? value[el] : undefined), obj);

    return Array.isArray(data[0])
      ? data.map(row => {
          let i = -1;

          return columns.map(col => {
            if (!col.empty) i++;
            return col.empty ? undefined : row[i];
          });
        })
      : data.map(row => columns.map(col => leaf(row, col.name)));
  };

  setTableData(props, status, callback = () => {}) {
    let tableData = [];
    let { columns, filterData, filterList } = this.buildColumns(props.columns);
    let sortIndex = null;
    let sortDirection = 'none';
    let tableMeta;

    const data = status === TABLE_LOAD.INITIAL ? this.transformData(columns, props.data) : props.data;
    const searchText = status === TABLE_LOAD.INITIAL ? this.options.searchText : null;

    columns.forEach((column, colIndex) => {
      for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
        let value = status === TABLE_LOAD.INITIAL ? data[rowIndex][colIndex] : data[rowIndex].data[colIndex];

        if (typeof tableData[rowIndex] === 'undefined') {
          tableData.push({
            index: status === TABLE_LOAD.INITIAL ? rowIndex : data[rowIndex].index,
            data: status === TABLE_LOAD.INITIAL ? data[rowIndex] : data[rowIndex].data,
          });
        }

        if (typeof column.customBodyRender === 'function') {
          const rowData = tableData[rowIndex].data;
          tableMeta = this.getTableMeta(rowIndex, colIndex, rowData, column, data, this.state);
          const funcResult = column.customBodyRender(value, tableMeta);

          if (React.isValidElement(funcResult) && funcResult.props.value) {
            value = funcResult.props.value;
          } else if (typeof funcResult === 'string') {
            value = funcResult;
          }
        }

        if (filterData[colIndex].indexOf(value) < 0 && !Array.isArray(value)) {
          filterData[colIndex].push(value);
        } else if (Array.isArray(value)) {
          value.forEach(element => {
            if (filterData[colIndex].indexOf(element) < 0) {
              filterData[colIndex].push(element);
            }
          });
        }
      }

      if (column.filterOptions) {
        if (Array.isArray(column.filterOptions)) {
          filterData[colIndex] = cloneDeep(column.filterOptions);
          console.error(
            'Deprecated: filterOptions must now be an object. see https://github.com/gregnb/mui-datatables/tree/master/examples/customize-filter example',
          );
        } else if (Array.isArray(column.filterOptions.names)) {
          filterData[colIndex] = cloneDeep(column.filterOptions.names);
        }
      }

      if (column.filterList) {
        filterList[colIndex] = cloneDeep(column.filterList);
      }

      if (this.options.sortFilterList) {
        const comparator = getCollatorComparator();
        filterData[colIndex].sort(comparator);
      }

      if (column.sortDirection !== 'none') {
        sortIndex = colIndex;
        sortDirection = column.sortDirection;
      }
    });

    let selectedRowsData = {
      data: [],
      lookup: {},
    };

    let expandedRowsData = {
      data: [],
      lookup: {},
    };

    if (TABLE_LOAD.INITIAL) {
      // Multiple row selection customization
      if (this.options.rowsSelected && this.options.rowsSelected.length && this.options.selectableRows === 'multiple') {
        this.options.rowsSelected.forEach(row => {
          let rowPos = row;

          for (let cIndex = 0; cIndex < this.state.displayData.length; cIndex++) {
            if (this.state.displayData[cIndex].dataIndex === row) {
              rowPos = cIndex;
              break;
            }
          }

          selectedRowsData.data.push({ index: rowPos, dataIndex: row });
          selectedRowsData.lookup[row] = true;
        });
      }

      // Single row selection customization
      if (
        this.options.rowsSelected &&
        this.options.rowsSelected.length === 1 &&
        this.options.selectableRows === 'single'
      ) {
        let rowPos = this.options.rowsSelected[0];

        for (let cIndex = 0; cIndex < this.state.displayData.length; cIndex++) {
          if (this.state.displayData[cIndex].dataIndex === this.options.rowsSelected[0]) {
            rowPos = cIndex;
            break;
          }
        }

        selectedRowsData.data.push({ index: rowPos, dataIndex: this.options.rowsSelected[0] });
        selectedRowsData.lookup[this.options.rowsSelected[0]] = true;
      } else if (
        this.options.rowsSelected &&
        this.options.rowsSelected.length > 1 &&
        this.options.selectableRows === 'single'
      ) {
        console.error(
          'Multiple values provided for selectableRows, but selectableRows set to "single". Either supply only a single value or use "multiple".',
        );
      }

      if (this.options.rowsExpanded && this.options.rowsExpanded.length && this.options.expandableRows) {
        this.options.rowsExpanded.forEach(row => {
          let rowPos = row;

          for (let cIndex = 0; cIndex < this.state.displayData.length; cIndex++) {
            if (this.state.displayData[cIndex].dataIndex === row) {
              rowPos = cIndex;
              break;
            }
          }

          expandedRowsData.data.push({ index: rowPos, dataIndex: row });
          expandedRowsData.lookup[row] = true;
        });
      }
    }

    if (!this.options.serverSide && sortIndex !== null) {
      const sortedData = this.sortTable(tableData, sortIndex, sortDirection);
      tableData = sortedData.data;
    }

    /* set source data and display Data set source set */
    this.setState(
      {
        columns: columns,
        filterData: filterData,
        filterList: filterList,
        searchText: searchText,
        selectedRows: selectedRowsData,
        expandedRows: expandedRowsData,
        count: this.options.count,
        data: tableData,
        displayData: this.getDisplayData(columns, tableData, filterList, searchText, tableMeta),
        previousSelectedRow: null,
      },
      callback,
    );
  }

  /*
   *  Build the table data used to display to the user (ie: after filter/search applied)
   */
  computeDisplayRow(columns, row, rowIndex, filterList, searchText, dataForTableMeta) {
    let isFiltered = false;
    let isSearchFound = false;
    let displayRow = [];
    const data = this.state.data.length ? this.state.data : this.props.data;
    for (let index = 0; index < row.length; index++) {
      let columnDisplay = row[index];
      let columnValue = row[index];
      let column = columns[index];

      if (column.customBodyRender) {
        const tableMeta = this.getTableMeta(rowIndex, index, row, column, dataForTableMeta, {
          ...this.state,
          filterList: filterList,
          searchText: searchText,
        });

        const funcResult = column.customBodyRender(
          columnValue,
          tableMeta,
          this.updateDataCol.bind(null, rowIndex, index),
        );
        columnDisplay = funcResult;

        /* drill down to get the value of a cell */
        columnValue =
          typeof funcResult === 'string' || !funcResult
            ? funcResult
            : funcResult.props && funcResult.props.value
            ? funcResult.props.value
            : columnValue;
      }

      displayRow.push(columnDisplay);

      const columnVal = columnValue === null || columnValue === undefined ? '' : columnValue.toString();

      const filterVal = filterList[index];
      const caseSensitive = this.options.caseSensitive;
      const filterType = column.filterType || this.options.filterType;
      if (filterVal.length || filterType === 'custom') {
        if (column.filterOptions && column.filterOptions.logic) {
          if (column.filterOptions.logic(columnValue, filterVal)) isFiltered = true;
        } else if (filterType === 'textField' && !this.hasSearchText(columnVal, filterVal, caseSensitive)) {
          isFiltered = true;
        } else if (
          filterType !== 'textField' &&
          Array.isArray(columnValue) === false &&
          filterVal.indexOf(columnValue) < 0
        ) {
          isFiltered = true;
        } else if (filterType !== 'textField' && Array.isArray(columnValue)) {
          //true if every filterVal exists in columnVal, false otherwise
          const isFullMatch = filterVal.every(el => {
            return columnValue.indexOf(el) >= 0;
          });
          //if it is not a fullMatch, filter row out
          if (!isFullMatch) {
            isFiltered = true;
          }
        }
      }

      if (
        searchText &&
        this.hasSearchText(columnVal, searchText, caseSensitive) &&
        column.display !== 'false' &&
        column.searchable
      ) {
        isSearchFound = true;
      }
    }

    const { customSearch } = this.props.options;

    if (searchText && customSearch) {
      const customSearchResult = customSearch(searchText, row, columns);
      if (typeof customSearchResult !== 'boolean') {
        console.error('customSearch must return a boolean');
      } else {
        isSearchFound = customSearchResult;
      }
    }

    if (this.options.serverSide) {
      if (customSearch) {
        console.warn('Server-side filtering is enabled, hence custom search will be ignored.');
      }

      return displayRow;
    }

    if (isFiltered || (searchText && !isSearchFound)) return null;
    else return displayRow;
  }

  hasSearchText = (toSearch, toFind, caseSensitive) => {
    let stack = toSearch.toString();
    let needle = toFind.toString();

    if (!caseSensitive) {
      needle = needle.toLowerCase();
      stack = stack.toLowerCase();
    }

    return stack.indexOf(needle) >= 0;
  };

  updateDataCol = (row, index, value) => {
    this.setState(prevState => {
      let changedData = cloneDeep(prevState.data);
      let filterData = cloneDeep(prevState.filterData);

      const tableMeta = this.getTableMeta(row, index, row, prevState.columns[index], prevState.data, prevState);
      const funcResult = prevState.columns[index].customBodyRender(value, tableMeta);

      const filterValue =
        React.isValidElement(funcResult) && funcResult.props.value
          ? funcResult.props.value
          : prevState['data'][row][index];

      const prevFilterIndex = filterData[index].indexOf(filterValue);
      filterData[index].splice(prevFilterIndex, 1, filterValue);

      changedData[row].data[index] = value;

      if (this.options.sortFilterList) {
        const comparator = getCollatorComparator();
        filterData[index].sort(comparator);
      }

      return {
        data: changedData,
        filterData: filterData,
        displayData: this.getDisplayData(prevState.columns, changedData, prevState.filterList, prevState.searchText),
      };
    });
  };

  getTableMeta = (rowIndex, colIndex, rowData, columnData, tableData, curState) => {
    const { columns, data, displayData, filterData, ...tableState } = curState;

    return {
      rowIndex: rowIndex,
      columnIndex: colIndex,
      columnData: columnData,
      rowData: rowData,
      tableData: tableData,
      tableState: tableState,
    };
  };

  getDisplayData(columns, data, filterList, searchText, tableMeta) {
    let newRows = [];
    const dataForTableMeta = tableMeta ? tableMeta.tableData : this.props.data;

    for (let index = 0; index < data.length; index++) {
      const value = data[index].data;
      const displayRow = this.computeDisplayRow(columns, value, index, filterList, searchText, dataForTableMeta);

      if (displayRow) {
        newRows.push({
          data: displayRow,
          dataIndex: data[index].index,
        });
      }
    }
    return newRows;
  }

  toggleViewColumn = index => {
    this.setState(
      prevState => {
        const columns = cloneDeep(prevState.columns);
        columns[index].display = columns[index].display === 'true' ? 'false' : 'true';
        return {
          columns: columns,
        };
      },
      () => {
        this.setTableAction('columnViewChange');
        if (this.options.onColumnViewChange) {
          this.options.onColumnViewChange(
            this.state.columns[index].name,
            this.state.columns[index].display === 'true' ? 'add' : 'remove',
          );
        }
      },
    );
  };

  getSortDirection(column) {
    return column.sortDirection === 'asc' ? 'ascending' : 'descending';
  }

  toggleSortColumn = index => {
    this.setState(
      prevState => {
        let columns = cloneDeep(prevState.columns);
        let data = prevState.data;
        const newOrder = columns[index].sortDirection === 'desc' ? 'asc' : 'desc';

        for (let pos = 0; pos < columns.length; pos++) {
          if (index !== pos) {
            columns[pos].sortDirection = 'none';
          } else {
            columns[pos].sortDirection = newOrder;
          }
        }

        const orderLabel = this.getSortDirection(columns[index]);
        const announceText = `Table now sorted by ${columns[index].name} : ${orderLabel}`;

        let newState = {
          columns: columns,
          announceText: announceText,
          activeColumn: index,
        };

        if (this.options.serverSide) {
          newState = {
            ...newState,
            data: prevState.data,
            displayData: prevState.displayData,
            selectedRows: prevState.selectedRows,
          };
        } else {
          const sortedData = this.sortTable(data, index, newOrder);

          newState = {
            ...newState,
            data: sortedData.data,
            displayData: this.getDisplayData(columns, sortedData.data, prevState.filterList, prevState.searchText),
            selectedRows: sortedData.selectedRows,
            previousSelectedRow: null,
          };
        }

        return newState;
      },
      () => {
        this.setTableAction('sort');
        if (this.options.onColumnSortChange) {
          this.options.onColumnSortChange(
            this.state.columns[index].name,
            this.getSortDirection(this.state.columns[index]),
          );
        }
      },
    );
  };

  changeRowsPerPage = rows => {
    /**
     * After changing rows per page recalculate totalPages and checks its if current page not higher.
     * Otherwise sets current page the value of nextTotalPages
     */
    const rowCount = this.options.count || this.state.displayData.length;
    const nextTotalPages = Math.floor(rowCount / rows);

    this.setState(
      () => ({
        rowsPerPage: rows,
        page: this.state.page > nextTotalPages ? nextTotalPages : this.state.page,
      }),
      () => {
        this.setTableAction('changeRowsPerPage');
        if (this.options.onChangeRowsPerPage) {
          this.options.onChangeRowsPerPage(this.state.rowsPerPage);
        }
      },
    );
  };

  changePage = page => {
    this.setState(
      () => ({
        page: page,
      }),
      () => {
        this.setTableAction('changePage');
        if (this.options.onChangePage) {
          this.options.onChangePage(this.state.page);
        }
      },
    );
  };

  searchTextUpdate = text => {
    this.setState(
      prevState => ({
        searchText: text && text.length ? text : null,
        page: 0,
        displayData: this.options.serverSide
          ? prevState.displayData
          : this.getDisplayData(prevState.columns, prevState.data, prevState.filterList, text),
      }),
      () => {
        this.setTableAction('search');
        if (this.options.onSearchChange) {
          this.options.onSearchChange(this.state.searchText);
        }
      },
    );
  };

  resetFilters = () => {
    this.setState(
      prevState => {
        const filterList = prevState.columns.map(() => []);

        return {
          filterList: filterList,
          displayData: this.options.serverSide
            ? prevState.displayData
            : this.getDisplayData(prevState.columns, prevState.data, filterList, prevState.searchText),
        };
      },
      () => {
        this.setTableAction('resetFilters');
        if (this.options.onFilterChange) {
          this.options.onFilterChange(null, this.state.filterList);
        }
      },
    );
  };

  filterUpdate = (index, value, column, type) => {
    this.setState(
      prevState => {
        const filterList = prevState.filterList.slice(0);
        const filterPos = filterList[index].indexOf(value);

        switch (type) {
          case 'checkbox':
            filterPos >= 0 ? filterList[index].splice(filterPos, 1) : filterList[index].push(value);
            break;
          case 'multiselect':
            filterList[index] = value === '' ? [] : value;
            break;
          case 'dropdown':
            filterList[index] = value;
            break;
          case 'custom':
            filterList[index] = value;
            break;
          default:
            filterList[index] = filterPos >= 0 || value === '' ? [] : [value];
        }

        return {
          page: 0,
          filterList: filterList,
          displayData: this.options.serverSide
            ? prevState.displayData
            : this.getDisplayData(prevState.columns, prevState.data, filterList, prevState.searchText),
          previousSelectedRow: null,
        };
      },
      () => {
        this.setTableAction('filterChange');
        if (this.options.onFilterChange) {
          this.options.onFilterChange(column, this.state.filterList);
        }
      },
    );
  };

  selectRowDelete = () => {
    const { selectedRows, data, filterList } = this.state;

    const selectedMap = buildMap(selectedRows.data);
    const cleanRows = data.filter(({ index }) => !selectedMap[index]);

    if (this.options.onRowsDelete) {
      if (this.options.onRowsDelete(selectedRows) === false) return;
    }

    this.setTableData(
      {
        columns: this.props.columns,
        data: cleanRows,
        options: {
          filterList: filterList,
        },
      },
      TABLE_LOAD.UPDATE,
      () => {
        this.setTableAction('rowDelete');
      },
    );
  };

  toggleExpandRow = row => {
    const { dataIndex } = row;
    let expandedRows = [...this.state.expandedRows.data];
    let rowPos = -1;

    for (let cIndex = 0; cIndex < expandedRows.length; cIndex++) {
      if (expandedRows[cIndex].dataIndex === dataIndex) {
        rowPos = cIndex;
        break;
      }
    }

    if (rowPos >= 0) {
      expandedRows.splice(rowPos, 1);
    } else {
      expandedRows.push(row);
    }

    this.setState(
      {
        expandedRows: {
          lookup: buildMap(expandedRows),
          data: expandedRows,
        },
      },
      () => {
        this.setTableAction('expandRow');
      },
    );
  };

  selectRowUpdate = (type, value, shiftAdjacentRows = []) => {
    // safety check
    const { selectableRows } = this.options;
    if (selectableRows === 'none') {
      return;
    }

    if (type === 'head') {
      const { isRowSelectable } = this.options;
      this.setState(
        prevState => {
          const { displayData, selectedRows: prevSelectedRows } = prevState;
          const selectedRowsLen = prevState.selectedRows.data.length;
          const isDeselect =
            selectedRowsLen === displayData.length || (selectedRowsLen < displayData.length && selectedRowsLen > 0);

          let selectedRows = displayData.reduce((arr, d, i) => {
            const selected = isRowSelectable ? isRowSelectable(displayData[i].dataIndex, prevSelectedRows) : true;
            selected && arr.push({ index: i, dataIndex: displayData[i].dataIndex });
            return arr;
          }, []);

          let newRows = [...prevState.selectedRows, ...selectedRows];
          let selectedMap = buildMap(newRows);

          if (isDeselect) {
            newRows = prevState.selectedRows.data.filter(({ dataIndex }) => !selectedMap[dataIndex]);
            selectedMap = buildMap(newRows);
          }

          return {
            curSelectedRows: newRows,
            selectedRows: {
              data: newRows,
              lookup: selectedMap,
            },
            previousSelectedRow: null,
          };
        },
        () => {
          this.setTableAction('rowsSelect');
          if (this.options.onRowsSelect) {
            this.options.onRowsSelect(this.state.curSelectedRows, this.state.selectedRows.data);
          }
        },
      );
    } else if (type === 'cell') {
      this.setState(
        prevState => {
          const { dataIndex } = value;
          let selectedRows = [...prevState.selectedRows.data];
          let rowPos = -1;

          for (let cIndex = 0; cIndex < selectedRows.length; cIndex++) {
            if (selectedRows[cIndex].dataIndex === dataIndex) {
              rowPos = cIndex;
              break;
            }
          }

          if (rowPos >= 0) {
            selectedRows.splice(rowPos, 1);

            // handle rows affected by shift+click
            if (shiftAdjacentRows.length > 0) {
              let shiftAdjacentMap = buildMap(shiftAdjacentRows);
              for (let cIndex = selectedRows.length - 1; cIndex >= 0; cIndex--) {
                if (shiftAdjacentMap[selectedRows[cIndex].dataIndex]) {
                  selectedRows.splice(cIndex, 1);
                }
              }
            }
          } else if (selectableRows === 'single') {
            selectedRows = [value];
          } else {
            // multiple
            selectedRows.push(value);

            // handle rows affected by shift+click
            if (shiftAdjacentRows.length > 0) {
              let selectedMap = buildMap(selectedRows);
              shiftAdjacentRows.forEach(aRow => {
                if (!selectedMap[aRow.dataIndex]) {
                  selectedRows.push(aRow);
                }
              });
            }
          }

          return {
            selectedRows: {
              lookup: buildMap(selectedRows),
              data: selectedRows,
            },
            previousSelectedRow: value,
          };
        },
        () => {
          this.setTableAction('rowsSelect');
          if (this.options.onRowsSelect) {
            this.options.onRowsSelect([value], this.state.selectedRows.data);
          }
        },
      );
    } else if (type === 'custom') {
      const { displayData } = this.state;

      const data = value.map(row => ({ index: row, dataIndex: displayData[row].dataIndex }));
      const lookup = buildMap(data);

      this.setState(
        {
          selectedRows: { data, lookup },
          previousSelectedRow: null,
        },
        () => {
          this.setTableAction('rowsSelect');
          if (this.options.onRowsSelect) {
            this.options.onRowsSelect(this.state.selectedRows.data, this.state.selectedRows.data);
          }
        },
      );
    }
  };

  sortTable(data, col, order) {
    let dataSrc = this.options.customSort ? this.options.customSort(data, col, order || 'desc') : data;

    let sortedData = dataSrc.map((row, sIndex) => ({
      data: row.data[col],
      rowData: row.data,
      position: sIndex,
      rowSelected: this.state.selectedRows.lookup[row.index] ? true : false,
    }));

    if (!this.options.customSort) {
      sortedData.sort(sortCompare(order));
    }

    let tableData = [];
    let selectedRows = [];

    for (let i = 0; i < sortedData.length; i++) {
      const row = sortedData[i];
      tableData.push(dataSrc[row.position]);
      if (row.rowSelected) {
        selectedRows.push({ index: i, dataIndex: dataSrc[row.position].index });
      }
    }

    return {
      data: tableData,
      selectedRows: {
        lookup: buildMap(selectedRows),
        data: selectedRows,
      },
    };
  }

  render() {
    const { classes, className, title } = this.props;
    const {
      announceText,
      activeColumn,
      data,
      displayData,
      columns,
      page,
      filterData,
      filterList,
      selectedRows,
      previousSelectedRow,
      expandedRows,
      searchText,
    } = this.state;

    const rowCount = this.state.count || displayData.length;
    const rowsPerPage = this.options.pagination ? this.state.rowsPerPage : displayData.length;
    const showToolbar = hasToolbarItem(this.options, title);
    const columnNames = columns.map(column => ({ name: column.name, filterType: column.filterType }));
    let responsiveClass;

    switch (this.options.responsive) {
      // DEPRECATED: This options is beign transitioned to `responsiveScrollMaxHeight`
      case 'scroll':
        responsiveClass = classes.responsiveScroll;
        break;
      case 'scrollMaxHeight':
        responsiveClass = classes.responsiveScrollMaxHeight;
        break;
      case 'scrollFullHeight':
        responsiveClass = classes.responsiveScrollFullHeight;
        break;
      case 'stacked':
        responsiveClass = classes.responsiveStacked;
        break;
    }

    return (
      <Paper
        elevation={this.options.elevation}
        ref={this.tableContent}
        className={classnames(classes.paper, className)}>
        {selectedRows.data.length ? (
          <TableToolbarSelect
            options={this.options}
            selectedRows={selectedRows}
            onRowsDelete={this.selectRowDelete}
            displayData={displayData}
            selectRowUpdate={this.selectRowUpdate}
          />
        ) : (
          showToolbar && (
            <TableToolbar
              columns={columns}
              displayData={displayData}
              data={data}
              filterData={filterData}
              filterList={filterList}
              filterUpdate={this.filterUpdate}
              options={this.options}
              resetFilters={this.resetFilters}
              searchText={searchText}
              searchTextUpdate={this.searchTextUpdate}
              tableRef={this.getTableContentRef}
              title={title}
              toggleViewColumn={this.toggleViewColumn}
              setTableAction={this.setTableAction}
            />
          )
        )}
        <TableFilterList
          options={this.options}
          filterListRenderers={columns.map(c => {
            return c.customFilterListRender ? c.customFilterListRender : f => f;
          })}
          filterList={filterList}
          filterUpdate={this.filterUpdate}
          columnNames={columnNames}
        />
        <div style={{ position: 'relative' }} className={responsiveClass}>
          {this.options.resizableColumns && (
            <TableResize
              key={rowCount}
              updateDividers={fn => (this.updateDividers = fn)}
              setResizeable={fn => (this.setHeadResizeable = fn)}
            />
          )}
          <MuiTable ref={el => (this.tableRef = el)} tabIndex={'0'} role={'grid'} className={classes.tableRoot}>
            <caption className={classes.caption}>{title}</caption>
            <TableHead
              columns={columns}
              activeColumn={activeColumn}
              data={displayData}
              count={rowCount}
              page={page}
              rowsPerPage={rowsPerPage}
              handleHeadUpdateRef={fn => (this.updateToolbarSelect = fn)}
              selectedRows={selectedRows}
              selectRowUpdate={this.selectRowUpdate}
              toggleSort={this.toggleSortColumn}
              setCellRef={this.setHeadCellRef}
              options={this.options}
            />
            <TableBody
              data={displayData}
              count={rowCount}
              columns={columns}
              page={page}
              rowsPerPage={rowsPerPage}
              selectedRows={selectedRows}
              selectRowUpdate={this.selectRowUpdate}
              previousSelectedRow={previousSelectedRow}
              expandedRows={expandedRows}
              toggleExpandRow={this.toggleExpandRow}
              options={this.options}
              filterList={filterList}
            />
          </MuiTable>
        </div>
        <TableFooter
          options={this.options}
          page={page}
          rowCount={rowCount}
          rowsPerPageOptions={this.options.rowsPerPageOptions}
          rowsPerPage={rowsPerPage}
          changeRowsPerPage={this.changeRowsPerPage}
          changePage={this.changePage}
        />
        <div className={classes.liveAnnounce} aria-live={'polite'}>
          {announceText}
        </div>
      </Paper>
    );
  }
}

export default withStyles(defaultTableStyles, { name: 'MUIDataTable' })(MUIDataTable);
