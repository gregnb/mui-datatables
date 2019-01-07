import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import MuiTable from '@material-ui/core/Table';
import TableToolbar from './components/TableToolbar';
import TableToolbarSelect from './components/TableToolbarSelect';
import TableFilterList from './components/TableFilterList';
import TableBody from './components/TableBody';
import TableResize from './components/TableResize';
import TableHead from './components/TableHead';
import TableFooter from './components/TableFooter';
import TablePagination from './components/TablePagination';
import cloneDeep from 'lodash.clonedeep';
import merge from 'lodash.merge';
import isEqual from 'lodash.isequal';
import textLabels from './textLabels';
import {withStyles} from '@material-ui/core/styles';
import {buildMap, getCollatorComparator, sortCompare} from './utils';

const defaultTableStyles = {
  root: {},
  responsiveScroll: {
    overflowX: 'auto',
    overflow: 'auto',
    height: '100%',
    maxHeight: '499px',
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
};

const TABLE_LOAD = {
  INITIAL: 1,
  UPDATE: 2,
};

// Wrapper Component to keep the rawValue
function FilterValue(props) {
  return props.children;
}

class MUIDataTable extends React.Component {
  static propTypes = {
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
            viewColumns: PropTypes.bool,
            filterList: PropTypes.array,
            filterOptions: PropTypes.array,
            customHeadRender: PropTypes.func,
            customBodyRender: PropTypes.func,
          }),
        }),
      ]),
    ).isRequired,
    /** Options used to describe table */
    options: PropTypes.shape({
      responsive: PropTypes.oneOf(['stacked', 'scroll']),
      filterType: PropTypes.oneOf(['dropdown', 'checkbox', 'multiselect', 'textField']),
      textLabels: PropTypes.object,
      pagination: PropTypes.bool,
      expandableRows: PropTypes.bool,
      renderExpandableRow: PropTypes.func,
      customToolbar: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
      customToolbarSelect: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
      customFooter: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
      onRowClick: PropTypes.func,
      resizableColumns: PropTypes.bool,
      selectableRows: PropTypes.bool,
      isRowSelectable: PropTypes.func,
      serverSide: PropTypes.bool,
      onTableChange: PropTypes.func,
      caseSensitive: PropTypes.bool,
      rowHover: PropTypes.bool,
      fixedHeader: PropTypes.bool,
      page: PropTypes.number,
      count: PropTypes.number,
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
    columns: [],
    filterData: [],
    filterList: [],
    selectedRows: {
      data: [],
      lookup: {},
    },
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
    this.setHeadResizeable = () => {
    };
    this.updateDividers = () => {
    };
  }

  componentWillMount() {
    this.initializeTable(this.props);
  }

  componentDidMount() {
    this.setHeadResizeable(this.headCellRefs, this.tableRef);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data || this.props.columns !== nextProps.columns) {
      this.initializeTable(nextProps);
    }
  }

  componentDidUpdate() {
    if (this.options.resizableColumns) {
      this.setHeadResizeable(this.headCellRefs, this.tableRef);
      this.updateDividers();
    }
  }

  initializeTable(props) {
    this.getDefaultOptions(props);
    this.setTableOptions(props);
    this.setTableData(props, TABLE_LOAD.INITIAL);
  }

  /*
   * React currently does not support deep merge for defaultProps. Objects are overwritten
   */
  getDefaultOptions(props) {
    const defaultOptions = {
      responsive: 'stacked',
      filterType: 'dropdown',
      pagination: true,
      textLabels,
      expandableRows: false,
      resizableColumns: false,
      selectableRows: true,
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
    };

    this.options = merge(defaultOptions, props.options);
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
        'Deprecated: filterList must now be provided under each column option. see https://github.com/gregnb/mui-datatables/tree/master/examples/serverside-options example',
      );
    }
  }

  setTableAction = action => {
    if (typeof this.options.onTableChange === 'function') {
      this.options.onTableChange(action, this.state);
    }
  };

  setTableOptions(props) {
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

  getTableContentRef = () => {
    return this.tableContent.current;
  };

  rawColumns = cols => {
    return cols.map(item => {
      if (typeof item !== "object") {
        return item;
      }
      ;

      let otherOptions = {};
      const {options, ...otherProps} = item;

      if (options) {
        const {customHeadRender, customBodyRender, setCellProps, ...nonFnOpts} = options;
        otherOptions = nonFnOpts;
      }

      return {...otherOptions, ...otherProps};
    });
  };

  /*
   *  Build the source table data
   */

  buildColumns = newColumns => {
    let columnData = [];
    let filterData = [];
    let filterList = [];

    if (this.state.columns.length && isEqual(this.rawColumns(newColumns), this.rawColumns(this.props.columns))) {
      const {columns, filterList, filterData} = this.state;
      return {columns, filterList, filterData};
    }

    newColumns.forEach((column, colIndex) => {
      let columnOptions = {
        display: 'true',
        filter: true,
        sort: true,
        download: true,
        viewColumns: true,
        sortDirection: null,
      };

      if (typeof column === 'object') {
        if (column.options && column.options.display !== undefined) {
          column.options.display = column.options.display.toString();
        }

        columnOptions = {
          name: column.name,
          ...columnOptions,
          ...(column.options ? column.options : {}),
        };
      } else {
        columnOptions = {...columnOptions, name: column};
      }

      columnData.push(columnOptions);

      filterData[colIndex] = [];
      filterList[colIndex] = [];
    });

    return {columns: columnData, filterData, filterList};
  };

  setTableData(props, status, callback = () => {
  }) {
    const {data, options} = props;

    let tableData = [];
    let {columns, filterData, filterList} = this.buildColumns(props.columns);
    let sortIndex = null;
    let sortDirection = null;

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
          const tableMeta = this.getTableMeta(rowIndex, colIndex, value, [], column, this.state);
          const funcResult = column.customBodyRender(value, tableMeta);

          if (React.isValidElement(funcResult) && funcResult.props.value) {
            value = funcResult.props.value;
          } else if (typeof funcResult === 'string') {
            value = funcResult;
          }
        }

        if (filterData[colIndex].indexOf(value) < 0) {
          filterData[colIndex].push(value);
        }
      }

      if (column.filterOptions) {
        filterData[colIndex] = cloneDeep(column.filterOptions);
      }

      if (column.filterList) {
        filterList[colIndex] = cloneDeep(column.filterList);
      }

      if (this.options.sortFilterList) {
        const comparator = getCollatorComparator();
        filterData[colIndex].sort(comparator);
      }

      if (column.sortDirection !== null) {
        sortIndex = colIndex;
        sortDirection = column.sortDirection === 'asc' ? 'desc' : 'asc';
      }
    });

    if (options.filterList) {
      filterList = options.filterList;
    }

    if (filterList.length !== columns.length) {
      throw new Error("Provided options.filterList does not match the column length");
    }

    let selectedRowsData = {
      data: [],
      lookup: {},
    };

    if (TABLE_LOAD.INITIAL) {
      if (options.rowsSelected && options.rowsSelected.length) {
        options.rowsSelected.forEach(row => {
          selectedRowsData.data.push({index: row, dataIndex: row});
          selectedRowsData.lookup[row] = true;
        });
      }
    }

    if (sortIndex !== null) {
      const sortedData = this.sortTable(tableData, sortIndex, sortDirection);
      tableData = sortedData.data;
    }

    /* set source data and display Data set source set */
    this.setState(
      prevState => ({
        columns: columns,
        filterData: filterData,
        filterList: filterList,
        selectedRows: selectedRowsData,
        data: tableData,
        displayData: this.getDisplayData(columns, tableData, filterList, prevState.searchText),
      }),
      callback,
    );
  }

  /*
   *  Build the table data used to display to the user (ie: after filter/search applied)
   */
  computeDisplayRow(columns, row, rowIndex, filterList, searchText) {
    let isFiltered = false;
    let isSearchFound = false;
    let displayRow = [];

    for (let index = 0; index < row.length; index++) {
      let columnDisplay = row[index];
      let columnValue = row[index];

      if (columns[index].customBodyRender) {
        const tableMeta = this.getTableMeta(rowIndex, index, row, columns[index], this.state.data, {
          ...this.state,
          filterList: filterList,
          searchText: searchText,
        });

        const funcResult = columns[index].customBodyRender(
          columnValue,
          tableMeta,
          this.updateDataCol.bind(null, rowIndex, index),
        );
        columnDisplay = funcResult;

        /* drill down to get the value of a cell */
        columnValue =
          typeof funcResult === 'string'
          ? funcResult
          : funcResult.props && funcResult.props.value
            ? funcResult.props.value
            : columnValue;
      }

      displayRow.push(columnDisplay);

      const filterValues = filterList[index].map(x => (x ? x.props.rawValue : undefined));

      if (this.filterValue(filterValues, columnValue, columns[index])) {
        isFiltered = true;
      }
    }

    if (isFiltered || (!this.options.serverSide && searchText && !isSearchFound)) {
      return null;
    } else {
      return displayRow;
    }
  }

  filterValue(filterValues, columnValue, columnOptions) {
    if (columnOptions.customFilterFn) {
      return columnOptions.customFilterFn(filterValues, columnValue);
    }

    if (filterValues.length) {
      const {filterType, caseSensitive} = this.options;
      if (filterType === 'textField' && !this.hasSearchText(columnValue, filterValues, caseSensitive)) {
        return true;
      }
    }

    return filterValues.length && filterValues.indexOf(columnValue) < 0;
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
    const {columns, data, displayData, filterData, ...tableState} = curState;

    return {
      rowIndex: rowIndex,
      columnIndex: colIndex,
      columnData: columnData,
      rowData: rowData,
      tableData: tableData,
      tableState: tableState,
    };
  };

  getDisplayData(columns, data, filterList, searchText) {
    let newRows = [];

    for (let index = 0; index < data.length; index++) {
      const value = data[index].data;
      const displayRow = this.computeDisplayRow(columns, value, index, filterList, searchText);

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
        const order = prevState.columns[index].sortDirection;

        for (let pos = 0; pos < columns.length; pos++) {
          if (index !== pos) {
            columns[pos].sortDirection = null;
          } else {
            columns[pos].sortDirection = columns[pos].sortDirection === 'asc' ? 'desc' : 'asc';
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
          const sortedData = this.sortTable(data, index, order);

          newState = {
            ...newState,
            data: sortedData.data,
            displayData: this.getDisplayData(columns, sortedData.data, prevState.filterList, prevState.searchText),
            selectedRows: sortedData.selectedRows,
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
      },
    );
  };

  resetFilters = () => {
    this.setState(
      prevState => {
        const filterList = prevState.columns.map((column, index) => []);

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

  filterUpdate = (index, filterValue, type) => {
    this.setState(
      prevState => {
        const filterList = cloneDeep(prevState.filterList);
        const filterPos = filterList[index].findIndex(x => x && x.props.rawValue === filterValue);

        const columnOptions = this.props.columns[index].options;

        const renderFilterValue = value =>
          columnOptions.customFilterValueRender ? columnOptions.customFilterValueRender(value) : value;
        const isFilterEmpty = !filterValue;

        switch (type) {
          case "checkbox":
            {
              const wrappedValue = React.createElement(FilterValue, {
                children: renderFilterValue(filterValue),
                // attach the raw input value, so we can retrieve it later
                rawValue: filterValue,
              });
              filterPos >= 0 ? filterList[index].splice(filterPos, 1) : filterList[index].push(wrappedValue);
            }
            break;
          case "multiselect": {
            const wrappedValue = filterValue.map(x =>
              React.createElement(FilterValue, {
                children: renderFilterValue(x),
                // attach the raw input value, so we can retrieve it later
                rawValue: x,
              }),
            );
            filterList[index] = isFilterEmpty ? [] : wrappedValue;
            break;
          }
          default: {
            const wrappedValue = React.createElement(FilterValue, {
              children: renderFilterValue(filterValue),
              // attach the raw input value, so we can retrieve it later
              rawValue: filterValue,
            });
            filterList[index] = filterPos >= 0 || isFilterEmpty ? [] : [wrappedValue];
          }
        }

        return {
          filterList: filterList,
          displayData: this.options.serverSide
                       ? prevState.displayData
                       : this.getDisplayData(prevState.columns, prevState.data, filterList, prevState.searchText),
        };
      },
      () => {
        this.setTableAction('filterChange');
        if (this.options.onFilterChange) {
          this.options.onFilterChange(filterValue, this.state.filterList);
        }
      },
    );
  };

  selectRowDelete = () => {
    const {selectedRows, data, filterList} = this.state;

    const selectedMap = buildMap(selectedRows.data);
    const cleanRows = data.filter(({index}) => !selectedMap[index]);

    if (this.options.onRowsDelete) {
      this.options.onRowsDelete(selectedRows);
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
    const {index, dataIndex} = row;
    let expandedRows = [...this.state.expandedRows.data];
    let rowPos = -1;

    for (let cIndex = 0; cIndex < expandedRows.length; cIndex++) {
      if (expandedRows[cIndex].index === index) {
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

  selectRowUpdate = (type, value) => {
    if (type === 'head') {
      const {isRowSelectable} = this.options;
      this.setState(
        prevState => {
          const {displayData} = prevState;
          const selectedRowsLen = prevState.selectedRows.data.length;
          const isDeselect =
                  selectedRowsLen === displayData.length || (selectedRowsLen < displayData.length && selectedRowsLen > 0)
                  ? true
                  : false;

          let selectedRows = displayData.reduce((arr, d, i) => {
            const selected = isRowSelectable ? isRowSelectable(displayData[i].dataIndex) : true;
            selected && arr.push({index: i, dataIndex: displayData[i].dataIndex});
            return arr;
          }, []);

          let newRows = [...prevState.selectedRows, ...selectedRows];
          let selectedMap = buildMap(newRows);

          if (isDeselect) {
            newRows = prevState.selectedRows.data.filter(({dataIndex}) => !selectedMap[dataIndex]);
            selectedMap = buildMap(newRows);
          }

          return {
            curSelectedRows: newRows,
            selectedRows: {
              data: newRows,
              lookup: selectedMap,
            },
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
          const {index, dataIndex} = value;
          let selectedRows = [...prevState.selectedRows.data];
          let rowPos = -1;

          for (let cIndex = 0; cIndex < selectedRows.length; cIndex++) {
            if (selectedRows[cIndex].index === index) {
              rowPos = cIndex;
              break;
            }
          }

          if (rowPos >= 0) {
            selectedRows.splice(rowPos, 1);
          } else {
            selectedRows.push(value);
          }

          return {
            selectedRows: {
              lookup: buildMap(selectedRows),
              data: selectedRows,
            },
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
      const {displayData} = this.state;

      const data = value.map(row => ({index: row, dataIndex: displayData[row].dataIndex}));
      const lookup = buildMap(data);

      this.setState(
        {
          selectedRows: {data, lookup},
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

  sortCompare(order) {
    return (a, b) => {
      if (a.data === null) {
        a.data = "";
      }
      if (b.data === null) {
        b.data = "";
      }
      return (
        (typeof a.data.localeCompare === "function" ? a.data.localeCompare(b.data) : a.data - b.data) *
        (order === "asc" ? -1 : 1)
      );
    };
  }

  sortTable(data, col, order) {
    let dataSrc = this.options.customSort ? this.options.customSort(data, col, order || 'desc') : data;

    let sortedData = dataSrc.map((row, sIndex) => ({
      data: row.data[col],
      rowData: row.data,
      position: sIndex,
      rowSelected: this.state.selectedRows.lookup[sIndex] ? true : false,
    }));

    if (!this.options.customSort) {
      sortedData.sort(sortCompare(order));
    }

    let tableData = [];
    let selectedRows = [];

    for (let i = 0; i < sortedData.length; i++) {
      const row = sortedData[i];
      tableData.push({index: row.position, data: row.rowData});
      if (row.rowSelected) {
        selectedRows.push({index: i, dataIndex: sortedData[row.position].index});
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

  // must be arrow function on local field to refer to the correct instance when passed around
  // assigning it as arrow function in the JSX would cause hard to track re-render errors
  getTableContentRef = () => {
    return this.tableContent.current;
  };

  render() {
    const {classes, title} = this.props;
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
            expandedRows,
            searchText,
          } = this.state;

    const rowCount = this.options.count || displayData.length;
    const rowsPerPage = this.options.pagination ? this.state.rowsPerPage : displayData.length;

    return (
      <Paper elevation={this.options.elevation} ref={this.tableContent} className={classes.paper}>
        {selectedRows.data.length ? (
          <TableToolbarSelect
            options={this.options}
            selectedRows={selectedRows}
            onRowsDelete={this.selectRowDelete}
            displayData={displayData}
            selectRowUpdate={this.selectRowUpdate}
          />
        ) : (
           <TableToolbar
             columns={columns}
             displayData={displayData}
             data={data}
             filterData={filterData}
             filterList={filterList}
             filterUpdate={this.filterUpdate}
             options={this.options}
             resetFilters={this.resetFilters}
             searchTextUpdate={this.searchTextUpdate}
             tableRef={this.getTableContentRef}
             title={title}
             toggleViewColumn={this.toggleViewColumn}
             setTableAction={this.setTableAction}
           />
         )}
        <TableFilterList options={this.options} filterList={filterList} filterUpdate={this.filterUpdate}/>
        <div
          style={{position: 'relative'}}
          className={this.options.responsive === 'scroll' ? classes.responsiveScroll : null}>
          {this.options.resizableColumns && (
            <TableResize
              key={rowCount}
              updateDividers={fn => (this.updateDividers = fn)}
              setResizeable={fn => (this.setHeadResizeable = fn)}
            />
          )}
          <MuiTable ref={el => (this.tableRef = el)} tabIndex={'0'} role={'grid'}>
            <caption className={classes.caption}>{title}</caption>
            <TableHead
              columns={columns}
              activeColumn={activeColumn}
              data={displayData}
              count={rowCount}
              columns={columns}
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
              expandedRows={expandedRows}
              toggleExpandRow={this.toggleExpandRow}
              options={this.options}
              searchText={searchText}
              filterList={filterList}
            />
          </MuiTable>
        </div>
        <TableFooter
          options={this.options}
          page={page}
          rowCount={rowCount}
          rowsPerPage={rowsPerPage}
          changeRowsPerPage={this.changeRowsPerPage}
          changePage={this.changePage}
        />
        <div className={classes.liveAnnounce} aria-live={'polite'} ref={el => (this.announceRef = el)}>
          {announceText}
        </div>
      </Paper>
    );
  }
}

export default withStyles(defaultTableStyles, {name: 'MUIDataTable'})(MUIDataTable);
