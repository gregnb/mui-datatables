import Paper from '@material-ui/core/Paper';
import { withStyles, createStyles, Theme } from '@material-ui/core/styles';
import MuiTable from '@material-ui/core/Table';
import classnames from 'classnames';
import cloneDeep from 'lodash.clonedeep';
import find from 'lodash.find';
import isEqual from 'lodash.isequal';
import isUndefined from 'lodash.isundefined';
import merge from 'lodash.merge';
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
import { MUIDataTableProps, MUIDataTableColumn, MUIDataTableColumnOptions, defaultTableStyles } from './MUIDataTableProps';
import { MUIDataTableState } from './MUIDataTableState';
import { MUIDataTableOptions } from './MUIDataTableOptions';
import { SortDirection } from '@material-ui/core/TableCell';

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

class MUIDataTable extends React.Component<MUIDataTableProps, MUIDataTableState> {
  
  static defaultProps = {
    title: '',
    options: {},
    data: [],
    columns: [],
  };

  
  private tableRef: boolean;
  private tableContent: React.RefObject<unknown>;
  private headCellRefs: {};
  private setHeadResizeable: (arg1: any, arg2: any) => void;
  private updateDividers: () => void;
  private options: MUIDataTableOptions;
  private updateToolbarSelect: any;
  private announceRef: HTMLDivElement | null;

  state: MUIDataTableState = {
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
    expandedRows: {
      data: [],
      lookup: {},
    },
    showResponsive: false,
    searchText: null,
  };

  constructor(props: MUIDataTableProps) {
    super(props);
    this.tableRef = false;
    this.tableContent = React.createRef();
    this.headCellRefs = {};
    this.setHeadResizeable = () => {};
    this.updateDividers = () => {};
  }

  componentWillMount() {
    this.initializeTable(this.props);
  }

  componentDidMount() {
    this.setHeadResizeable(this.headCellRefs, this.tableRef);

    // When we have a search, we must reset page to view it
    // @ts-ignore
    if (this.props.options.searchText) this.setState({ page: 0 });
  }

  componentDidUpdate(prevProps: MUIDataTableProps) {
    if (this.props.data !== prevProps.data || this.props.columns !== prevProps.columns) {
      this.setTableData(this.props, TABLE_LOAD.INITIAL, () => {
        this.setTableAction('propsUpdate');
      });
      this.updateOptions(this.props);
    }

    // @ts-ignore
    if (this.props.options.searchText !== prevProps.options.searchText) {
      // When we have a search, we must reset page to view it
      this.setState({ page: 0 });
    }

    if (this.options.resizableColumns) {
      this.setHeadResizeable(this.headCellRefs, this.tableRef);
      this.updateDividers();
    }
  }

  updateOptions(props: MUIDataTableProps) {
    this.options = merge(this.options, props.options);
  }

  initializeTable(props: MUIDataTableProps) {
    this.getDefaultOptions(props);
    this.setTableOptions(props);
    this.setTableData(props, TABLE_LOAD.INITIAL, () => {
      this.setTableInit('tableInitialized');
    });
  }

  /*
   * React currently does not support deep merge for defaultProps. Objects are overwritten
   */
  getDefaultOptions(props: MUIDataTableProps) {
    const defaultOptions = {
      responsive: 'stacked',
      filterType: 'dropdown',
      pagination: true,
      textLabels,
      expandableRows: false,
      expandableRowsOnClick: false,
      resizableColumns: false,
      selectableRows: 'multiple',
      selectableRowsOnClick: false,
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

    const extra: any = {};
    if (props.options && typeof props.options.selectableRows === 'boolean') {
      extra.selectableRows = props.options.selectableRows ? 'multiple' : 'none';
    }
    this.options = merge(defaultOptions, props.options, extra);
    if (props.options && props.options.rowsPerPageOptions) {
      this.options.rowsPerPageOptions = props.options.rowsPerPageOptions;
    }
  }

  validateOptions(options) {
    if (options.serverSide && options.onTableChange === undefined) {
      throw Error('onTableChange callback must be provided when using serverSide option');
    }
    if (options.expandableRows && options.renderExpandableRow === undefined) {
      throw Error('renderExpandableRow must be provided when using expandableRows option');
    }
    // @ts-ignore
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

  setTableOptions(props: MUIDataTableProps) {
    // take a subset of the properties from the 
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
  getTableContentRef = () => {
    return this.tableContent.current;
  };

  rawColumns = cols => {
    return cols.map(item => {
      if (typeof item !== 'object') return item;

      let otherOptions = {};
      const { options, ...otherProps } = item;

      if (options) {
        const { customHeadRender, customBodyRender, customFilterListRender, setCellProps, ...nonFnOpts } = options;
        otherOptions = nonFnOpts;
      }

      return { ...otherOptions, ...otherProps };
    });
  };

  /*
   *  Build the source table data
   */

  buildColumns = newColumns => {
    let columnData: MUIDataTableColumnOptions[] = [];
    let filterData: any[] = [];
    let filterList: any[] = [];

    newColumns.forEach((column, colIndex) => {
      let columnOptions: MUIDataTableColumnOptions = {
        display: 'true',
        empty: false,
        filter: true,
        sort: true,
        print: true,
        searchable: true,
        download: true,
        viewColumns: true,
        sortDirection: undefined,
      };

      if (typeof column === 'object') {
        if (column.options && column.options.display !== undefined) {
          column.options.display = column.options.display.toString();
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
    const { options } = props;

    let tableData: any[] = [];
    let { columns, filterData, filterList } = this.buildColumns(props.columns);
    let sortIndex: number | null = null;
    let sortDirection: SortDirection | null = null;

    const data = status === TABLE_LOAD.INITIAL ? this.transformData(columns, props.data) : props.data;
    const searchText = status === TABLE_LOAD.INITIAL ? options.searchText : null;

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
          const tableMeta = this.getTableMeta(rowIndex, colIndex, value, column, [], this.state);
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

      if (column.sortDirection !== null) {
        sortIndex = colIndex;
        sortDirection = column.sortDirection || null;
      }
    });

    let selectedRowsData: {data: any[], lookup: any} = {
      data: [],
      lookup: {},
    };

    if (TABLE_LOAD.INITIAL) {
      if (options.rowsSelected && options.rowsSelected.length) {
        options.rowsSelected.forEach(row => {
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
    }

    if (!options.serverSide && sortIndex !== null) {
      const sortedData = this.sortTable(tableData, sortIndex, sortDirection);
      tableData = sortedData.data;
    }
    /* set source data and display Data set source set */
    this.setState(
      prevState => ({
        columns: columns,
        filterData: filterData,
        filterList: filterList,
        searchText: searchText,
        selectedRows: selectedRowsData,
        count: options.count,
        data: tableData,
        displayData: this.getDisplayData(columns, tableData, filterList, searchText),
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
    let displayRow: any[] = [];

    for (let index = 0; index < row.length; index++) {
      let columnDisplay = row[index];
      let columnValue = row[index];
      let column = columns[index];

      if (column.customBodyRender) {
        const tableMeta = this.getTableMeta(rowIndex, index, row, column, this.state.data, {
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

    const { customSearch = undefined } = this.props.options || {};

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
      // @ts-ignore
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

  getDisplayData(columns, data, filterList, searchText) {
    let newRows: any[] = [];

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
            this.state.columns[index].name || null,
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
            columns[pos].sortDirection = null;
          } else {
            columns[pos].sortDirection = newOrder;
          }
        }

        const orderLabel = this.getSortDirection(columns[index]);
        const announceText = `Table now sorted by ${columns[index].name} : ${orderLabel}`;

        let newState: MUIDataTableState = {
          ...prevState,
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
          };
        }

        return newState;
      },
      () => {
        this.setTableAction('sort');
        if (this.options.onColumnSortChange) {
          this.options.onColumnSortChange(
            this.state.columns[index].name || null,
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
      // TODO fix me.
      // @ts-ignore
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
      // TODO fix me.
      // @ts-ignore
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

  selectRowUpdate = (type, value) => {
    // safety check
    const { selectableRows } = this.options;
    if (selectableRows === 'none') {
      return;
    }

    if (type === 'head') {
      const { isRowSelectable } = this.options;
      this.setState(
        prevState => {
          const { displayData } = prevState;
          const selectedRowsLen = prevState.selectedRows.data.length;
          const isDeselect =
            selectedRowsLen === displayData.length || (selectedRowsLen < displayData.length && selectedRowsLen > 0)
              ? true
              : false;

          let selectedRows = displayData.reduce((arr, d, i) => {
            const selected = isRowSelectable ? isRowSelectable(displayData[i].dataIndex) : true;
            selected && arr.push({ index: i, dataIndex: displayData[i].dataIndex });
            return arr;
          }, []);

          // TODO fix me.
          // @ts-ignore
          let newRows = [...prevState.selectedRows, ...selectedRows];
          let selectedMap = buildMap(newRows);

          if (isDeselect) {
            // TODO fix me.
            // @ts-ignore
            newRows = prevState.selectedRows.data.filter(({ dataIndex }) => !selectedMap[dataIndex]);
            selectedMap = buildMap(newRows);
          }

          return {
            ...prevState,
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
            this.options.onRowsSelect(this.state.curSelectedRows || [], this.state.selectedRows.data);
          }
        },
      );
    } else if (type === 'cell') {
      this.setState(
        prevState => {
          const { index, dataIndex } = value;
          let selectedRows = [...prevState.selectedRows.data];
          let rowPos = -1;

          for (let cIndex = 0; cIndex < selectedRows.length; cIndex++) {
            // TODO fix me.
            // @ts-ignore
            if (selectedRows[cIndex].dataIndex === dataIndex) {
              rowPos = cIndex;
              break;
            }
          }

          if (rowPos >= 0) {
            selectedRows.splice(rowPos, 1);
          } else if (selectableRows === 'single') {
            selectedRows = [value];
          } else {
            // multiple
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
      const { displayData } = this.state;

      const data = value.map(row => ({ index: row, dataIndex: displayData[row].dataIndex }));
      const lookup = buildMap(data);

      this.setState(
        {
          selectedRows: { data, lookup },
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

    let tableData: any[] = [];
    let selectedRows: any[] = [];

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
      expandedRows,
      searchText,
    } = this.state;

    const rowCount = this.state.count || displayData.length;
    const rowsPerPage = this.options.pagination ? this.state.rowsPerPage : displayData.length;
    const showToolbar = hasToolbarItem(this.options, title);
    const columnNames = columns.map(column => ({ name: column.name, filterType: column.filterType }));

    return (
      // @ts-ignore
      <Paper
        elevation={this.options.elevation}
        // TODO fix me.
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
        <div
          style={{ position: 'relative' }}
          className={this.options.responsive === 'scroll' ? classes.responsiveScroll : classes.responsiveStacked}>
          {this.options.resizableColumns && (
            <TableResize
              key={rowCount}
              updateDividers={fn => (this.updateDividers = fn)}
              setResizeable={fn => (this.setHeadResizeable = fn)}
            />
          )}
          // TODO fix me.
          // @ts-ignore
          <MuiTable 
            ref={el => (this.tableRef = el)} 
            tabIndex={0} 
            role={'grid'} 
            className={classes.tableRoot}
          >
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
        <div className={classes.liveAnnounce} aria-live={'polite'} ref={el => (this.announceRef = el)}>
          {announceText}
        </div>
      </Paper>
    );
  }
}

export default withStyles(defaultTableStyles, { name: 'MUIDataTable' })(MUIDataTable);
