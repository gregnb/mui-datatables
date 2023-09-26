import Paper from '@mui/material/Paper';
import MuiTable from '@mui/material/Table';
import MuiTooltip from '@mui/material/Tooltip';
import { withStyles } from 'tss-react/mui';
import clsx from 'clsx';
import assignwith from 'lodash.assignwith';
import cloneDeep from 'lodash.clonedeep';
import find from 'lodash.find';
import isEqual from 'lodash.isequal';
import isUndefined from 'lodash.isundefined';
import merge from 'lodash.merge';
import PropTypes from 'prop-types';
import React from 'react';
import DefaultTableBody from './components/TableBody';
import DefaultTableFilter from './components/TableFilter';
import DefaultTableFilterList from './components/TableFilterList';
import DefaultTableFooter from './components/TableFooter';
import DefaultTableHead from './components/TableHead';
import DefaultTableResize from './components/TableResize';
import DefaultTableToolbar from './components/TableToolbar';
import DefaultTableToolbarSelect from './components/TableToolbarSelect';
import getTextLabels from './textLabels';
import { buildMap, getCollatorComparator, getPageValue, sortCompare, warnDeprecated, warnInfo } from './utils';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { load, save } from './localStorage';

const defaultTableStyles = theme => ({
  root: {
    '& .datatables-noprint': {
      '@media print': {
        display: 'none',
      },
    },
  },
  paper: {
    isolation: 'isolate',
  },
  paperResponsiveScrollFullHeightFullWidth: {
    position: 'absolute',
  },
  tableRoot: {
    outline: 'none',
  },
  responsiveBase: {
    overflow: 'auto',
    '@media print': {
      height: 'auto !important',
    },
  },

  // deprecated, but continuing support through v3.x
  responsiveScroll: {
    overflow: 'auto',
    height: '100%',
  },
  // deprecated, but continuing support through v3.x
  responsiveScrollMaxHeight: {
    overflow: 'auto',
    height: '100%',
  },
  // deprecated, but continuing support through v3.x
  responsiveScrollFullHeight: {
    height: '100%',
  },
  // deprecated, but continuing support through v3.x
  responsiveStacked: {
    overflow: 'auto',
    [theme.breakpoints.down('md')]: {
      overflow: 'hidden',
    },
  },
  // deprecated, but continuing support through v3.x
  responsiveStackedFullWidth: {},
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

// Select Toolbar Placement options
const STP = {
  REPLACE: 'replace',
  ABOVE: 'above',
  NONE: 'none',
  ALWAYS: 'always',
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
            display: PropTypes.oneOf(['true', 'false', 'excluded', 'always', true, false]),
            empty: PropTypes.bool,
            filter: PropTypes.bool,
            sort: PropTypes.bool,
            print: PropTypes.bool,
            searchable: PropTypes.bool,
            download: PropTypes.bool,
            viewColumns: PropTypes.bool,
            filterList: PropTypes.array,
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
            customBodyRenderLite: PropTypes.func,
            customHeadLabelRender: PropTypes.func,
            customFilterListOptions: PropTypes.oneOfType([
              PropTypes.shape({
                render: PropTypes.func,
                update: PropTypes.func,
              }),
            ]),
            customFilterListRender: PropTypes.func,
            setCellProps: PropTypes.func,
            setCellHeaderProps: PropTypes.func,
            sortThirdClickReset: PropTypes.bool,
            sortDescFirst: PropTypes.bool,
          }),
        }),
      ]),
    ).isRequired,
    /** Options used to describe table */
    options: PropTypes.shape({
      caseSensitive: PropTypes.bool,
      columnOrder: PropTypes.array,
      count: PropTypes.number,
      confirmFilters: PropTypes.bool,
      consoleWarnings: PropTypes.bool,
      customFilterDialogFooter: PropTypes.func,
      customFooter: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
      customRowRender: PropTypes.func,
      customSearch: PropTypes.func,
      customSearchRender: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
      customSort: PropTypes.func,
      customToolbar: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
      customToolbarSelect: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
      draggableColumns: PropTypes.object,
      enableNestedDataAccess: PropTypes.string,
      expandableRows: PropTypes.bool,
      expandableRowsHeader: PropTypes.bool,
      expandableRowsOnClick: PropTypes.bool,
      disableToolbarSelect: PropTypes.bool,
      download: PropTypes.oneOf([true, false, 'true', 'false', 'disabled']),
      downloadOptions: PropTypes.shape({
        filename: PropTypes.string,
        separator: PropTypes.string,
        filterOptions: PropTypes.shape({
          useDisplayedColumnsOnly: PropTypes.bool,
          useDisplayedRowsOnly: PropTypes.bool,
        }),
      }),
      filter: PropTypes.oneOf([true, false, 'true', 'false', 'disabled']),
      filterArrayFullMatch: PropTypes.bool,
      filterType: PropTypes.oneOf(['dropdown', 'checkbox', 'multiselect', 'textField', 'custom']),
      fixedHeader: PropTypes.bool,
      fixedSelectColumn: PropTypes.bool,
      getTextLabels: PropTypes.func,
      isRowExpandable: PropTypes.func,
      isRowSelectable: PropTypes.func,
      jumpToPage: PropTypes.bool,
      onDownload: PropTypes.func,
      onFilterChange: PropTypes.func,
      onFilterChipClose: PropTypes.func,
      onFilterConfirm: PropTypes.func,
      onFilterDialogOpen: PropTypes.func,
      onFilterDialogClose: PropTypes.func,
      onRowClick: PropTypes.func,
      onRowsExpand: PropTypes.func,
      onRowExpansionChange: PropTypes.func,
      onRowsSelect: PropTypes.func,
      onRowSelectionChange: PropTypes.func,
      onTableChange: PropTypes.func,
      onTableInit: PropTypes.func,
      page: PropTypes.number,
      pagination: PropTypes.bool,
      print: PropTypes.oneOf([true, false, 'true', 'false', 'disabled']),
      searchProps: PropTypes.object,
      selectableRows: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(['none', 'single', 'multiple'])]),
      selectableRowsHeader: PropTypes.bool,
      selectableRowsHideCheckboxes: PropTypes.bool,
      selectableRowsOnClick: PropTypes.bool,
      serverSide: PropTypes.bool,
      tableId: PropTypes.string,
      tableBodyHeight: PropTypes.string,
      tableBodyMaxHeight: PropTypes.string,
      renderExpandableRow: PropTypes.func,
      resizableColumns: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
      responsive: PropTypes.oneOf(['standard', 'vertical', 'verticalAlways', 'simple']),
      rowHover: PropTypes.bool,
      rowsExpanded: PropTypes.array,
      rowsPerPage: PropTypes.number,
      rowsPerPageOptions: PropTypes.array,
      rowsSelected: PropTypes.array,
      search: PropTypes.oneOf([true, false, 'true', 'false', 'disabled']),
      searchOpen: PropTypes.bool,
      searchAlwaysOpen: PropTypes.bool,
      searchPlaceholder: PropTypes.string,
      searchText: PropTypes.string,
      setFilterChipProps: PropTypes.func,
      setRowProps: PropTypes.func,
      selectToolbarPlacement: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.oneOf([STP.REPLACE, STP.ABOVE, STP.NONE, STP.ALWAYS]),
      ]),
      setTableProps: PropTypes.func,
      sort: PropTypes.bool,
      sortOrder: PropTypes.object,
      storageKey: PropTypes.string,
      viewColumns: PropTypes.oneOf([true, false, 'true', 'false', 'disabled']),
    }),
    /** Pass and use className to style MUIDataTable as desired */
    className: PropTypes.string,
    components: PropTypes.objectOf(PropTypes.any),
  };

  static defaultProps = {
    title: '',
    options: {},
    data: [],
    columns: [],
    components: {
      TableBody: DefaultTableBody,
      TableFilter: DefaultTableFilter,
      TableFilterList: DefaultTableFilterList,
      TableFooter: DefaultTableFooter,
      TableHead: DefaultTableHead,
      TableResize: DefaultTableResize,
      TableToolbar: DefaultTableToolbar,
      TableToolbarSelect: DefaultTableToolbarSelect,
      Tooltip: MuiTooltip,
      icons: {},
    },
  };

  constructor(props) {
    super(props);
    this.tableRef = React.createRef();
    this.tableContent = React.createRef();
    this.draggableHeadCellRefs = {};
    this.resizeHeadCellRefs = {};
    this.timers = {};
    this.setHeadResizeable = () => {};
    this.updateDividers = () => {};

    let defaultState = {
      activeColumn: null,
      announceText: null,
      count: 0,
      columns: [],
      expandedRows: {
        data: [],
        lookup: {},
      },
      data: [],
      displayData: [],
      filterData: [],
      filterList: [],
      page: 0,
      previousSelectedRow: null,
      rowsPerPage: 10,
      searchProps: {},
      searchText: null,
      selectedRows: {
        data: [],
        lookup: {},
      },
      showResponsive: false,
      sortOrder: {},
    };

    this.mergeDefaultOptions(props);

    const restoredState = load(props.options.storageKey);
    this.state = Object.assign(defaultState, restoredState ? restoredState : this.getInitTableOptions());

    this.setTableData = this.setTableData.bind(this);

    this.setTableData(props, TABLE_LOAD.INITIAL, true, null, true);
  }

  componentDidMount() {
    this.setHeadResizeable(this.resizeHeadCellRefs, this.tableRef);

    // When we have a search, we must reset page to view it unless on serverSide since paging is handled by the user.
    if (this.props.options.searchText && !this.props.options.serverSide) this.setState({ page: 0 });

    this.setTableInit('tableInitialized');
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.data !== prevProps.data ||
      this.props.columns !== prevProps.columns ||
      this.props.options !== prevProps.options
    ) {
      this.updateOptions(this.options, this.props);

      var didDataUpdate = this.props.data !== prevProps.data;
      if (this.props.data && prevProps.data) {
        didDataUpdate = didDataUpdate && this.props.data.length === prevProps.data.length;
      }

      this.setTableData(this.props, TABLE_LOAD.INITIAL, didDataUpdate, () => {
        this.setTableAction('propsUpdate');
      });
    }

    if (this.props.options.searchText !== prevProps.options.searchText && !this.props.options.serverSide) {
      // When we have a search, we must reset page to view it unless on serverSide since paging is handled by the user.
      this.setState({ page: 0 });
    }

    if (
      this.options.resizableColumns === true ||
      (this.options.resizableColumns && this.options.resizableColumns.enabled)
    ) {
      this.setHeadResizeable(this.resizeHeadCellRefs, this.tableRef);
      this.updateDividers();
    }
  }

  updateOptions(options, props) {
    // set backwards compatibility options
    if (props.options.disableToolbarSelect === true && props.options.selectToolbarPlacement === undefined) {
      // if deprecated option disableToolbarSelect is set and selectToolbarPlacement is default then use it
      props.options.selectToolbarPlacement = STP.NONE;
    }

    // provide default tableId when no tableId has been passed as prop
    if (!props.options.tableId) {
      props.options.tableId = (Math.random() + '').replace(/\./, '');
    }

    this.options = assignwith(options, props.options, (objValue, srcValue, key) => {
      // Merge any default options that are objects, as they will be overwritten otherwise
      if (key === 'textLabels' || key === 'downloadOptions') return merge(objValue, srcValue);
      return;
    });

    this.handleOptionDeprecation(props);
  }

  getDefaultOptions = () => ({
    caseSensitive: false,
    consoleWarnings: true,
    disableToolbarSelect: false,
    download: true,
    downloadOptions: {
      filename: 'tableDownload.csv',
      separator: ',',
    },
    draggableColumns: {
      enabled: false,
      transitionTime: 300,
    },
    elevation: 4,
    enableNestedDataAccess: '',
    expandableRows: false,
    expandableRowsHeader: true,
    expandableRowsOnClick: false,
    filter: true,
    filterArrayFullMatch: true,
    filterType: 'dropdown',
    fixedHeader: true,
    fixedSelectColumn: true,
    pagination: true,
    print: true,
    resizableColumns: false,
    responsive: 'vertical',
    rowHover: true,
    //rowsPerPage: 10,
    rowsPerPageOptions: [10, 15, 100],
    search: true,
    selectableRows: 'multiple',
    selectableRowsHideCheckboxes: false,
    selectableRowsOnClick: false,
    selectableRowsHeader: true,
    serverSide: false,
    serverSideFilterList: null,
    setTableProps: () => ({}),
    sort: true,
    sortFilterList: true,
    tableBodyHeight: 'auto',
    tableBodyMaxHeight: null, // if set, it will override tableBodyHeight
    sortOrder: {},
    textLabels: getTextLabels(),
    viewColumns: true,
    selectToolbarPlacement: STP.REPLACE,
  });

  warnDep = (msg, consoleWarnings) => {
    warnDeprecated(msg, this.options.consoleWarnings);
  };

  warnInfo = (msg, consoleWarnings) => {
    warnInfo(msg, this.options.consoleWarnings);
  };

  handleOptionDeprecation = props => {
    if (typeof this.options.selectableRows === 'boolean') {
      this.warnDep(
        'Using a boolean for selectableRows has been deprecated. Please use string option: multiple | single | none',
      );
      this.options.selectableRows = this.options.selectableRows ? 'multiple' : 'none';
    }
    if (['standard', 'vertical', 'verticalAlways', 'simple'].indexOf(this.options.responsive) === -1) {
      if (
        [
          'scrollMaxHeight',
          'scrollFullHeight',
          'stacked',
          'stackedFullWidth',
          'scrollFullHeightFullWidth',
          'scroll',
        ].indexOf(this.options.responsive) !== -1
      ) {
        this.warnDep(
          this.options.responsive +
            ' has been deprecated, but will still work in version 3.x. Please use string option: standard | vertical | simple. More info: https://github.com/gregnb/mui-datatables/tree/master/docs/v2_to_v3_guide.md',
        );
      } else {
        this.warnInfo(
          this.options.responsive +
            ' is not recognized as a valid input for responsive option. Please use string option: standard | vertical | simple. More info: https://github.com/gregnb/mui-datatables/tree/master/docs/v2_to_v3_guide.md',
        );
      }
    }
    if (this.options.onRowsSelect) {
      this.warnDep(
        'onRowsSelect has been renamed onRowSelectionChange. More info: https://github.com/gregnb/mui-datatables/tree/master/docs/v2_to_v3_guide.md',
      );
    }
    if (this.options.onRowsExpand) {
      this.warnDep(
        'onRowsExpand has been renamed onRowExpansionChange. More info: https://github.com/gregnb/mui-datatables/tree/master/docs/v2_to_v3_guide.md',
      );
    }
    if (this.options.fixedHeaderOptions) {
      if (
        typeof this.options.fixedHeaderOptions.yAxis !== 'undefined' &&
        typeof this.options.fixedHeader === 'undefined'
      ) {
        this.options.fixedHeader = this.options.fixedHeaderOptions.yAxis;
      }
      if (
        typeof this.options.fixedHeaderOptions.xAxis !== 'undefined' &&
        typeof this.options.fixedSelectColumn === 'undefined'
      ) {
        this.options.fixedSelectColumn = this.options.fixedHeaderOptions.xAxis;
      }
      this.warnDep(
        'fixedHeaderOptions will still work but has been deprecated in favor of fixedHeader and fixedSelectColumn. More info: https://github.com/gregnb/mui-datatables/tree/master/docs/v2_to_v3_guide.md',
      );
    }
    if (this.options.serverSideFilterList) {
      this.warnDep(
        'serverSideFilterList will still work but has been deprecated in favor of the confirmFilters option. See this example for details: https://github.com/gregnb/mui-datatables/blob/master/examples/serverside-filters/index.js More info here: https://github.com/gregnb/mui-datatables/tree/master/docs/v2_to_v3_guide.md',
      );
    }

    props.columns.map(c => {
      if (c.options && c.options.customFilterListRender) {
        this.warnDep(
          'The customFilterListRender option has been deprecated. It is being replaced by customFilterListOptions.render (Specify customFilterListOptions: { render: Function } in column options.)',
        );
      }
    });

    if (this.options.disableToolbarSelect === true) {
      this.warnDep(
        'disableToolbarSelect has been deprecated but will still work in version 3.x. It is being replaced by "selectToolbarPlacement"="none". More info: https://github.com/gregnb/mui-datatables/tree/master/docs/v2_to_v3_guide.md',
      );
    }

    // only give this warning message in newer browsers
    if (Object.values) {
      if (Object.values(STP).indexOf(this.options.selectToolbarPlacement) === -1) {
        this.warnDep(
          'Invalid option value for selectToolbarPlacement. Please check the documentation: https://github.com/gregnb/mui-datatables#options',
        );
      }
    }
  };

  /*
   * React currently does not support deep merge for defaultProps. Objects are overwritten
   */
  mergeDefaultOptions(props) {
    const defaultOptions = this.getDefaultOptions();
    const theProps = Object.assign({}, props);
    theProps.options = theProps.options || {};

    this.updateOptions(defaultOptions, theProps);
  }

  validateOptions(options) {
    if (options.serverSide && options.onTableChange === undefined) {
      throw Error('onTableChange callback must be provided when using serverSide option');
    }
    if (options.expandableRows && options.renderExpandableRow === undefined) {
      throw Error('renderExpandableRow must be provided when using expandableRows option');
    }
    if (options.rowsSelected && Array.isArray(options.rowsSelected) && options.rowsSelected.some(isNaN)) {
      warnInfo('When using the rowsSelected option, must be provided an array of numbers only.');
    }
  }

  setTableAction = action => {
    if (typeof this.options.onTableChange === 'function') {
      this.options.onTableChange(action, this.state);
    }
    if (this.options.storageKey) {
      save(this.options.storageKey, this.state);
    }
  };

  setTableInit = action => {
    if (typeof this.options.onTableInit === 'function') {
      this.options.onTableInit(action, this.state);
    }
  };

  getInitTableOptions() {
    const optionNames = ['rowsPerPage', 'page', 'rowsSelected', 'rowsPerPageOptions'];
    const optState = optionNames.reduce((acc, cur) => {
      if (this.options[cur] !== undefined) {
        acc[cur] = this.options[cur];
      }
      return acc;
    }, {});

    this.validateOptions(optState);
    return optState;
  }

  setHeadCellRef = (index, pos, el) => {
    this.draggableHeadCellRefs[index] = el;
    this.resizeHeadCellRefs[pos] = el;
  };

  // must be arrow function on local field to refer to the correct instance when passed around
  // assigning it as arrow function in the JSX would cause hard to track re-render errors
  getTableContentRef = () => this.tableContent.current;

  /*
   *  Build the source table data
   *
   *  newColumns - columns from the options object.
   *  prevColumns - columns object saved onto ths state.
   *  newColumnOrder - columnOrder from the options object.
   *  prevColumnOrder - columnOrder object saved onto the state.
   */

  buildColumns = (newColumns, prevColumns = [], newColumnOrder, prevColumnOrder = []) => {
    let columnData = [];
    let filterData = [];
    let filterList = [];
    let columnOrder = [];

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
        sortCompare: null,
        sortThirdClickReset: false,
        sortDescFirst: false,
      };

      columnOrder.push(colIndex);
      const options = { ...column.options };

      if (typeof column === 'object') {
        if (options) {
          if (options.display !== undefined) {
            options.display = options.display.toString();
          }

          if (options.sortDirection === null || options.sortDirection) {
            this.warnDep(
              'The sortDirection column field has been deprecated. Please use the sortOrder option on the options object. More info: https://github.com/gregnb/mui-datatables/tree/master/docs/v2_to_v3_guide.md',
            );
          }
        }

        // remember stored version of display if not overwritten
        if (
          typeof options.display === 'undefined' &&
          prevColumns[colIndex] &&
          prevColumns[colIndex].name === column.name &&
          prevColumns[colIndex].display
        ) {
          options.display = prevColumns[colIndex].display;
        }

        columnOptions = {
          name: column.name,
          label: column.label ? column.label : column.name,
          ...columnOptions,
          ...options,
        };
      } else {
        // remember stored version of display if not overwritten
        if (prevColumns[colIndex] && prevColumns[colIndex].display) {
          options.display = prevColumns[colIndex].display;
        }

        columnOptions = { ...columnOptions, ...options, name: column, label: column };
      }

      columnData.push(columnOptions);

      filterData[colIndex] = [];
      filterList[colIndex] = [];
    });

    if (Array.isArray(newColumnOrder)) {
      columnOrder = newColumnOrder;
    } else if (
      Array.isArray(prevColumnOrder) &&
      Array.isArray(newColumns) &&
      Array.isArray(prevColumns) &&
      newColumns.length === prevColumns.length
    ) {
      columnOrder = prevColumnOrder;
    }

    return { columns: columnData, filterData, filterList, columnOrder };
  };

  transformData = (columns, data) => {
    const { enableNestedDataAccess } = this.options;
    const leaf = (obj, path) =>
      (enableNestedDataAccess ? path.split(enableNestedDataAccess) : path.split()).reduce(
        (value, el) => (value ? value[el] : undefined),
        obj,
      );

    const transformedData = Array.isArray(data[0])
      ? data.map(row => {
          let i = -1;

          return columns.map(col => {
            if (!col.empty) i++;
            return col.empty ? undefined : row[i];
          });
        })
      : data.map(row => columns.map(col => leaf(row, col.name)));

    return transformedData;
  };

  setTableData(props, status, dataUpdated, callback = () => {}, fromConstructor = false) {
    let tableData = [];
    let { columns, filterData, filterList, columnOrder } = this.buildColumns(
      props.columns,
      this.state.columns,
      this.options.columnOrder,
      this.state.columnOrder,
    );

    let sortIndex = null;
    let sortDirection = 'none';
    let tableMeta;

    let sortOrder;
    if (this.options.sortOrder && this.options.sortOrder.direction && this.options.sortOrder.name) {
      sortOrder = Object.assign({}, this.options.sortOrder);
    } else {
      sortOrder = Object.assign({}, this.state.sortOrder);

      // if no sortOrder, check and see if there's a sortDirection on one of the columns (deprecation notice for this is given above)
      if (!sortOrder.direction) {
        props.columns.forEach((column, colIndex) => {
          if (column.options && (column.options.sortDirection === 'asc' || column.options.sortDirection === 'desc')) {
            sortOrder.name = column.name;
            sortOrder.sortDirection = column.sortDirection;
          }
        });
      }
    }

    const data = status === TABLE_LOAD.INITIAL ? this.transformData(columns, props.data) : props.data;
    let searchText = status === TABLE_LOAD.INITIAL ? this.options.searchText : null;

    if (typeof this.options.searchText === 'undefined' && typeof this.state.searchText !== 'undefined') {
      searchText = this.state.searchText;
    }

    let rowsPerPage = this.state.rowsPerPage;
    if (typeof this.options.rowsPerPage === 'number') {
      rowsPerPage = this.options.rowsPerPage;
    }

    let page = this.state.page;
    if (typeof this.options.page === 'number') {
      page = this.options.page;
    }

    columns.forEach((column, colIndex) => {
      for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
        let value = status === TABLE_LOAD.INITIAL ? data[rowIndex][colIndex] : data[rowIndex].data[colIndex];

        if (typeof tableData[rowIndex] === 'undefined') {
          tableData.push({
            index: status === TABLE_LOAD.INITIAL ? rowIndex : data[rowIndex].index,
            data: status === TABLE_LOAD.INITIAL ? data[rowIndex] : data[rowIndex].data,
          });
        }

        if (column.filter !== false) {
          if (typeof column.customBodyRender === 'function') {
            const rowData = tableData[rowIndex].data;
            tableMeta = this.getTableMeta(rowIndex, colIndex, rowData, column, data, this.state, tableData);
            const funcResult = column.customBodyRender(value, tableMeta);

            if (React.isValidElement(funcResult) && funcResult.props.value) {
              value = funcResult.props.value;
            } else if (typeof funcResult === 'string') {
              value = funcResult;
            }
          }

          if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
            // it's extremely rare but possible to create an object without a toString method, ex: var x = Object.create(null);
            // so this check has to be made
            value = value.toString ? value.toString() : '';
          }

          if (filterData[colIndex].indexOf(value) < 0 && !Array.isArray(value)) {
            filterData[colIndex].push(value);
          } else if (Array.isArray(value)) {
            value.forEach(element => {
              let elmVal;
              if ((typeof element === 'object' && element !== null) || typeof element === 'function') {
                elmVal = element.toString ? element.toString() : '';
              } else {
                elmVal = element;
              }

              if (filterData[colIndex].indexOf(elmVal) < 0) {
                filterData[colIndex].push(elmVal);
              }
            });
          }
        }
      }

      if (column.filterOptions) {
        if (Array.isArray(column.filterOptions)) {
          filterData[colIndex] = cloneDeep(column.filterOptions);
          this.warnDep(
            'filterOptions must now be an object. see https://github.com/gregnb/mui-datatables/tree/master/examples/customize-filter example',
          );
        } else if (Array.isArray(column.filterOptions.names)) {
          filterData[colIndex] = cloneDeep(column.filterOptions.names);
        }
      }

      if (column.filterList) {
        filterList[colIndex] = cloneDeep(column.filterList);
      } else if (
        this.state.filterList &&
        this.state.filterList[colIndex] &&
        this.state.filterList[colIndex].length > 0
      ) {
        filterList[colIndex] = cloneDeep(this.state.filterList[colIndex]);
      }

      if (this.options.sortFilterList) {
        const comparator = getCollatorComparator();
        filterData[colIndex].sort(comparator);
      }

      if (column.name === sortOrder.name) {
        sortDirection = sortOrder.direction;
        sortIndex = colIndex;
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
        this.options.rowsSelected
          .filter(selectedRowIndex => selectedRowIndex === 0 || (Number(selectedRowIndex) && selectedRowIndex > 0))
          .forEach(row => {
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

        // Single row selection customization
      } else if (
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
      } else if (typeof this.options.rowsSelected === 'undefined' && dataUpdated === false) {
        if (this.state.selectedRows) {
          selectedRowsData = Object.assign({}, this.state.selectedRows);
        }
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
      } else if (typeof this.options.rowsExpanded === 'undefined' && dataUpdated === false && this.state.expandedRows) {
        expandedRowsData = Object.assign({}, this.state.expandedRows);
      }
    }

    if (!this.options.serverSide && sortIndex !== null) {
      const sortedData = this.sortTable(tableData, sortIndex, sortDirection, columns[sortIndex].sortCompare);
      tableData = sortedData.data;
    }

    /* set source data and display Data set source set */
    let stateUpdates = {
      columns: columns,
      filterData: filterData,
      filterList: filterList,
      searchText: searchText,
      selectedRows: selectedRowsData,
      expandedRows: expandedRowsData,
      count: this.options.count,
      data: tableData,
      sortOrder: sortOrder,
      rowsPerPage,
      page,
      displayData: this.getDisplayData(columns, tableData, filterList, searchText, tableMeta, props),
      columnOrder,
    };

    if (fromConstructor) {
      this.state = Object.assign({}, this.state, stateUpdates);
    } else {
      this.setState(stateUpdates, callback);
    }
  }

  /*
   *  Build the table data used to display to the user (ie: after filter/search applied)
   */
  computeDisplayRow(
    columns,
    row,
    rowIndex,
    filterList,
    searchText,
    dataForTableMeta,
    options,
    props,
    currentTableData,
  ) {
    let isFiltered = false;
    let isSearchFound = false;
    let displayRow = [];

    for (let index = 0; index < row.length; index++) {
      let columnDisplay = row[index];
      let columnValue = row[index];
      let column = columns[index];

      if (column.customBodyRenderLite) {
        displayRow.push(column.customBodyRenderLite);
      } else if (column.customBodyRender) {
        const tableMeta = this.getTableMeta(
          rowIndex,
          index,
          row,
          column,
          dataForTableMeta,
          {
            ...this.state,
            filterList: filterList,
            searchText: searchText,
          },
          currentTableData,
        );

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

        displayRow.push(columnDisplay);
      } else {
        displayRow.push(columnDisplay);
      }

      const columnVal = columnValue === null || columnValue === undefined ? '' : columnValue.toString();

      const filterVal = filterList[index];
      const caseSensitive = options.caseSensitive;
      const filterType = column.filterType || options.filterType;
      if (filterVal.length || filterType === 'custom') {
        if (column.filterOptions && column.filterOptions.logic) {
          if (column.filterOptions.logic(columnValue, filterVal, row)) isFiltered = true;
        } else if (filterType === 'textField' && !this.hasSearchText(columnVal, filterVal, caseSensitive)) {
          isFiltered = true;
        } else if (
          filterType !== 'textField' &&
          Array.isArray(columnValue) === false &&
          filterVal.indexOf(columnValue) < 0
        ) {
          isFiltered = true;
        } else if (filterType !== 'textField' && Array.isArray(columnValue)) {
          if (options.filterArrayFullMatch) {
            //true if every filterVal exists in columnVal, false otherwise
            const isFullMatch = filterVal.every(el => {
              return columnValue.indexOf(el) >= 0;
            });
            //if it is not a fullMatch, filter row out
            if (!isFullMatch) {
              isFiltered = true;
            }
          } else {
            const isAnyMatch = filterVal.some(el => {
              return columnValue.indexOf(el) >= 0;
            });
            //if no value matches, filter row out
            if (!isAnyMatch) {
              isFiltered = true;
            }
          }
        }
      }

      if (
        searchText &&
        column.display !== 'excluded' &&
        this.hasSearchText(columnVal, searchText, caseSensitive) &&
        column.display !== 'false' &&
        column.searchable
      ) {
        isSearchFound = true;
      }
    }

    const { customSearch } = props.options;

    if (searchText && customSearch) {
      const customSearchResult = customSearch(searchText, row, columns);
      if (typeof customSearchResult !== 'boolean') {
        console.error('customSearch must return a boolean');
      } else {
        isSearchFound = customSearchResult;
      }
    }

    if (options.serverSide) {
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

      const tableMeta = this.getTableMeta(
        row,
        index,
        row,
        prevState.columns[index],
        prevState.data,
        prevState,
        prevState.data,
      );
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
        displayData: this.getDisplayData(
          prevState.columns,
          changedData,
          prevState.filterList,
          prevState.searchText,
          null,
          this.props,
        ),
      };
    });
  };

  getTableMeta = (rowIndex, colIndex, rowData, columnData, tableData, curState, currentTableData) => {
    const { columns, data, displayData, filterData, ...tableState } = curState;

    return {
      rowIndex: rowIndex,
      columnIndex: colIndex,
      columnData: columnData,
      rowData: rowData,
      tableData: tableData,
      tableState: tableState,
      currentTableData: currentTableData,
    };
  };

  getDisplayData(columns, data, filterList, searchText, tableMeta, props) {
    let newRows = [];
    const dataForTableMeta = tableMeta ? tableMeta.tableData : props.data;

    for (let index = 0; index < data.length; index++) {
      const value = data[index].data;
      const displayRow = this.computeDisplayRow(
        columns,
        value,
        index,
        filterList,
        searchText,
        dataForTableMeta,
        this.options,
        props,
        data,
      );

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
        this.setTableAction('viewColumnsChange');
        var cb = this.options.onViewColumnsChange || this.options.onColumnViewChange;

        if (cb) {
          cb(this.state.columns[index].name, this.state.columns[index].display === 'true' ? 'add' : 'remove');
        }
      },
    );
  };

  updateColumns = newColumns => {
    this.setState(
      prevState => {
        return {
          columns: newColumns,
        };
      },
      () => {
        this.setTableAction('viewColumnsChange');
        var cb = this.options.onViewColumnsChange || this.options.onColumnViewChange;

        if (cb) {
          cb(null, 'update', newColumns);
        }
      },
    );
  };

  getSortDirectionLabel(sortOrder) {
    switch (sortOrder.direction) {
      case 'asc':
        return 'ascending';
      case 'desc':
        return 'descending';
      case 'none':
        return 'none';
      default:
        return '';
    }
  }

  getTableProps() {
    const { classes } = this.props;
    const tableProps = this.options.setTableProps() || {};

    tableProps.className = clsx(classes.tableRoot, tableProps.className);

    return tableProps;
  }

  toggleSortColumn = index => {
    this.setState(
      prevState => {
        let columns = cloneDeep(prevState.columns);
        let data = prevState.data;
        let newOrder = columns[index].sortDescFirst ? 'desc' : 'asc'; // default

        let sequenceOrder = ['asc', 'desc'];
        if (columns[index].sortDescFirst) {
          sequenceOrder = ['desc', 'asc'];
        }
        if (columns[index].sortThirdClickReset) {
          sequenceOrder.push('none');
        }

        if (columns[index].name === this.state.sortOrder.name) {
          let pos = sequenceOrder.indexOf(this.state.sortOrder.direction);
          if (pos !== -1) {
            pos++;
            if (pos >= sequenceOrder.length) pos = 0;
            newOrder = sequenceOrder[pos];
          }
        }

        const newSortOrder = {
          name: columns[index].name,
          direction: newOrder,
        };

        const orderLabel = this.getSortDirectionLabel(newSortOrder);
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
            sortOrder: newSortOrder,
          };
        } else {
          const sortedData = this.sortTable(data, index, newOrder, columns[index].sortCompare);

          newState = {
            ...newState,
            data: sortedData.data,
            displayData: this.getDisplayData(
              columns,
              sortedData.data,
              prevState.filterList,
              prevState.searchText,
              null,
              this.props,
            ),
            selectedRows: sortedData.selectedRows,
            sortOrder: newSortOrder,
            previousSelectedRow: null,
          };
        }

        return newState;
      },
      () => {
        this.setTableAction('sort');

        if (this.options.onColumnSortChange) {
          this.options.onColumnSortChange(this.state.sortOrder.name, this.state.sortOrder.direction);
        }
      },
    );
  };

  changeRowsPerPage = rows => {
    const rowCount = this.options.count || this.state.displayData.length;

    this.setState(
      () => ({
        rowsPerPage: rows,
        page: getPageValue(rowCount, rows, this.state.page),
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

  searchClose = () => {
    this.setState(
      prevState => ({
        searchText: null,
        displayData: this.options.serverSide
          ? prevState.displayData
          : this.getDisplayData(prevState.columns, prevState.data, prevState.filterList, null, null, this.props),
      }),
      () => {
        this.setTableAction('search');
        if (this.options.onSearchChange) {
          this.options.onSearchChange(this.state.searchText);
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
          : this.getDisplayData(prevState.columns, prevState.data, prevState.filterList, text, null, this.props),
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
            : this.getDisplayData(
                prevState.columns,
                prevState.data,
                filterList,
                prevState.searchText,
                null,
                this.props,
              ),
        };
      },
      () => {
        this.setTableAction('resetFilters');
        if (this.options.onFilterChange) {
          this.options.onFilterChange(null, this.state.filterList, 'reset', null);
        }
      },
    );
  };

  updateFilterByType = (filterList, index, value, type, customUpdate) => {
    const filterPos = filterList[index].findIndex(filter => isEqual(filter, value));

    switch (type) {
      case 'checkbox':
        filterPos >= 0 ? filterList[index].splice(filterPos, 1) : filterList[index].push(value);
        break;
      case 'chip':
        filterPos >= 0 ? filterList[index].splice(filterPos, 1) : filterList[index].push(value);
        break;
      case 'multiselect':
        filterList[index] = value === '' ? [] : value;
        break;
      case 'dropdown':
        filterList[index] = value;
        break;
      case 'custom':
        if (customUpdate) {
          filterList = customUpdate(filterList, filterPos, index);
        } else {
          filterList[index] = value;
        }
        break;
      default:
        filterList[index] = filterPos >= 0 || value === '' ? [] : [value];
    }
  };

  filterUpdate = (index, value, column, type, customUpdate, next) => {
    this.setState(
      prevState => {
        const filterList = cloneDeep(prevState.filterList);
        this.updateFilterByType(filterList, index, value, type, customUpdate);

        return {
          page: 0,
          filterList: filterList,
          displayData: this.options.serverSide
            ? prevState.displayData
            : this.getDisplayData(
                prevState.columns,
                prevState.data,
                filterList,
                prevState.searchText,
                null,
                this.props,
              ),
          previousSelectedRow: null,
        };
      },
      () => {
        this.setTableAction('filterChange');
        if (this.options.onFilterChange) {
          this.options.onFilterChange(column, this.state.filterList, type, index, this.state.displayData);
        }
        next && next(this.state.filterList);
      },
    );
  };

  // Collapses or expands all expanded rows
  toggleAllExpandableRows = () => {
    let expandedRowsData = [...this.state.expandedRows.data];
    const { isRowExpandable } = this.options;
    let affecttedRows = [];

    if (expandedRowsData.length > 0) {
      // collapse all
      for (let ii = expandedRowsData.length - 1; ii >= 0; ii--) {
        let item = expandedRowsData[ii];
        if (!isRowExpandable || (isRowExpandable && isRowExpandable(item.dataIndex, this.state.expandedRows))) {
          affecttedRows.push(expandedRowsData.splice(ii, 1));
        }
      }
    } else {
      // expand all
      for (let ii = 0; ii < this.state.data.length; ii++) {
        let item = this.state.data[ii];
        if (!isRowExpandable || (isRowExpandable && isRowExpandable(item.dataIndex, this.state.expandedRows))) {
          if (this.state.expandedRows.lookup[item.index] !== true) {
            let newItem = {
              index: ii,
              dataIndex: item.index,
            };
            expandedRowsData.push(newItem);
            affecttedRows.push(newItem);
          }
        }
      }
    }

    this.setState(
      {
        expandedRows: {
          lookup: buildMap(expandedRowsData),
          data: expandedRowsData,
        },
      },
      () => {
        this.setTableAction('expandRow');
        if (this.options.onRowExpansionChange) {
          this.options.onRowExpansionChange(
            affecttedRows,
            this.state.expandedRows.data,
            this.state.expandedRows.data.map(item => item.dataIndex),
          );
        }
      },
    );
  };

  areAllRowsExpanded = () => {
    return this.state.expandedRows.data.length === this.state.data.length;
  };

  updateColumnOrder = (columnOrder, columnIndex, newPosition) => {
    this.setState(
      prevState => {
        return {
          columnOrder,
        };
      },
      () => {
        this.setTableAction('columnOrderChange');
        if (this.options.onColumnOrderChange) {
          this.options.onColumnOrderChange(this.state.columnOrder, columnIndex, newPosition);
        }
      },
    );
  };

  selectRowDelete = () => {
    const { selectedRows, data, filterList } = this.state;

    const selectedMap = buildMap(selectedRows.data);
    const cleanRows = data.filter(({ index }) => !selectedMap[index]);

    if (this.options.onRowsDelete) {
      if (
        this.options.onRowsDelete(
          selectedRows,
          cleanRows.map(ii => ii.data),
        ) === false
      )
        return;
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
      true,
      () => {
        this.setTableAction('rowDelete');
      },
    );
  };

  toggleExpandRow = row => {
    const { dataIndex } = row;
    const { isRowExpandable } = this.options;
    let { expandedRows } = this.state;
    const expandedRowsData = [...expandedRows.data];
    let shouldCollapseExpandedRow = false;
    let hasRemovedRow = false;
    let removedRow = [];

    for (var cIndex = 0; cIndex < expandedRowsData.length; cIndex++) {
      if (expandedRowsData[cIndex].dataIndex === dataIndex) {
        shouldCollapseExpandedRow = true;
        break;
      }
    }

    if (shouldCollapseExpandedRow) {
      if ((isRowExpandable && isRowExpandable(dataIndex, expandedRows)) || !isRowExpandable) {
        removedRow = expandedRowsData.splice(cIndex, 1);
        hasRemovedRow = true;
      }
    } else {
      if (isRowExpandable && isRowExpandable(dataIndex, expandedRows)) expandedRowsData.push(row);
      else if (!isRowExpandable) expandedRowsData.push(row);
    }

    this.setState(
      {
        curExpandedRows: hasRemovedRow ? removedRow : [row],
        expandedRows: {
          lookup: buildMap(expandedRowsData),
          data: expandedRowsData,
        },
      },
      () => {
        this.setTableAction('rowExpansionChange');
        if (this.options.onRowExpansionChange || this.options.onRowsExpand) {
          let expandCallback = this.options.onRowExpansionChange || this.options.onRowsExpand;
          expandCallback(this.state.curExpandedRows, this.state.expandedRows.data);
        }
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
          let isDeselect =
            selectedRowsLen === displayData.length || (selectedRowsLen < displayData.length && selectedRowsLen > 0);

          let selectedRows = displayData.reduce((arr, d, i) => {
            const selected = isRowSelectable ? isRowSelectable(displayData[i].dataIndex, prevSelectedRows) : true;
            selected && arr.push({ index: i, dataIndex: displayData[i].dataIndex });
            return arr;
          }, []);

          let newRows = [...selectedRows];
          let selectedMap = buildMap(newRows);

          // if the select toolbar is disabled, the rules are a little different
          if (this.options.selectToolbarPlacement === STP.NONE) {
            if (selectedRowsLen > displayData.length) {
              isDeselect = true;
            } else {
              for (let ii = 0; ii < displayData.length; ii++) {
                if (!selectedMap[displayData[ii].dataIndex]) {
                  isDeselect = true;
                }
              }
            }
          }

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
          this.setTableAction('rowSelectionChange');
          if (this.options.onRowSelectionChange) {
            this.options.onRowSelectionChange(
              this.state.curSelectedRows,
              this.state.selectedRows.data,
              this.state.selectedRows.data.map(item => item.dataIndex),
            );
          } else if (this.options.onRowsSelect) {
            this.options.onRowsSelect(
              this.state.curSelectedRows,
              this.state.selectedRows.data,
              this.state.selectedRows.data.map(item => item.dataIndex),
            );
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
          this.setTableAction('rowSelectionChange');
          if (this.options.onRowSelectionChange) {
            this.options.onRowSelectionChange(
              [value],
              this.state.selectedRows.data,
              this.state.selectedRows.data.map(item => item.dataIndex),
            );
          } else if (this.options.onRowsSelect) {
            this.options.onRowsSelect(
              [value],
              this.state.selectedRows.data,
              this.state.selectedRows.data.map(item => item.dataIndex),
            );
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
          this.setTableAction('rowSelectionChange');
          if (this.options.onRowSelectionChange) {
            this.options.onRowSelectionChange(
              this.state.selectedRows.data,
              this.state.selectedRows.data,
              this.state.selectedRows.data.map(item => item.dataIndex),
            );
          } else if (this.options.onRowsSelect) {
            this.options.onRowsSelect(
              this.state.selectedRows.data,
              this.state.selectedRows.data,
              this.state.selectedRows.data.map(item => item.dataIndex),
            );
          }
        },
      );
    }
  };

  sortTable(data, col, order, columnSortCompare = null) {
    let hasCustomTableSort = this.options.customSort && !columnSortCompare;
    let meta = { selectedRows: this.state.selectedRows }; // meta for customSort
    let dataSrc = hasCustomTableSort
      ? this.options.customSort(data, col, order || (this.options.sortDescFirst ? 'desc' : 'asc'), meta)
      : data;

    // reset the order by index
    let noSortData;
    if (order === 'none') {
      noSortData = data.reduce((r, i) => {
        r[i.index] = i;
        return r;
      }, []);
    }

    let sortedData = dataSrc.map((row, sIndex) => ({
      data: row.data[col],
      rowData: row.data,
      position: sIndex,
      rowSelected: this.state.selectedRows.lookup[row.index] ? true : false,
    }));

    if (!hasCustomTableSort) {
      const sortFn = columnSortCompare || sortCompare;
      sortedData.sort(sortFn(order));
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
      data: order === 'none' ? noSortData : tableData,
      selectedRows: {
        lookup: buildMap(selectedRows),
        data: selectedRows,
      },
    };
  }

  render() {
    const {
      classes,
      className,
      title,
      components: {
        TableBody,
        TableFilterList,
        TableFooter,
        TableHead,
        TableResize,
        TableToolbar,
        TableToolbarSelect,
        DragDropBackend = HTML5Backend,
      },
    } = this.props;
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
      sortOrder,
      serverSideFilterList,
      columnOrder,
    } = this.state;

    const TableBodyComponent = TableBody || DefaultTableBody;
    const TableFilterListComponent = TableFilterList || DefaultTableFilterList;
    const TableFooterComponent = TableFooter || DefaultTableFooter;
    const TableHeadComponent = TableHead || DefaultTableHead;
    const TableResizeComponent = TableResize || DefaultTableResize;
    const TableToolbarComponent = TableToolbar || DefaultTableToolbar;
    const TableToolbarSelectComponent = TableToolbarSelect || DefaultTableToolbarSelect;

    const rowCount = this.state.count || displayData.length;
    const rowsPerPage = this.options.pagination ? this.state.rowsPerPage : displayData.length;
    const showToolbar = hasToolbarItem(this.options, title);
    const columnNames = columns.map(column => ({
      name: column.name,
      filterType: column.filterType || this.options.filterType,
    }));
    const responsiveOption = this.options.responsive;
    let paperClasses = `${classes.paper} ${className}`;
    let maxHeight = this.options.tableBodyMaxHeight;
    let responsiveClass;

    switch (responsiveOption) {
      // deprecated
      case 'scroll':
        responsiveClass = classes.responsiveScroll;
        maxHeight = '499px';
        break;
      // deprecated
      case 'scrollMaxHeight':
        responsiveClass = classes.responsiveScrollMaxHeight;
        maxHeight = '499px';
        break;
      // deprecated
      case 'scrollFullHeight':
        responsiveClass = classes.responsiveScrollFullHeight;
        maxHeight = 'none';
        break;
      // deprecated
      case 'scrollFullHeightFullWidth':
        responsiveClass = classes.responsiveScrollFullHeight;
        paperClasses = `${classes.paperResponsiveScrollFullHeightFullWidth} ${className}`;
        break;
      // deprecated
      case 'stacked':
        responsiveClass = classes.responsiveStacked;
        maxHeight = 'none';
        break;
      // deprecated
      case 'stackedFullWidth':
        responsiveClass = classes.responsiveStackedFullWidth;
        paperClasses = `${classes.paperResponsiveScrollFullHeightFullWidth} ${className}`;
        maxHeight = 'none';
        break;

      default:
        responsiveClass = classes.responsiveBase;
        break;
    }

    var tableHeightVal = {};
    if (maxHeight) {
      tableHeightVal.maxHeight = maxHeight;
    }
    if (this.options.tableBodyHeight) {
      tableHeightVal.height = this.options.tableBodyHeight;
    }

    const tableProps = this.options.setTableProps ? this.options.setTableProps() || {} : {};
    const tableClassNames = clsx(classes.tableRoot, tableProps.className);
    delete tableProps.className; // remove className from props to avoid the className being applied twice

    const dndProps = {};
    if (typeof window !== 'undefined') {
      dndProps.context = window;
    }

    return (
      <Paper elevation={this.options.elevation} ref={this.tableContent} className={paperClasses}>
        {(this.options.selectToolbarPlacement === STP.ALWAYS ||
          (selectedRows.data.length > 0 && this.options.selectToolbarPlacement !== STP.NONE)) && (
          <TableToolbarSelectComponent
            options={this.options}
            selectedRows={selectedRows}
            onRowsDelete={this.selectRowDelete}
            displayData={displayData}
            selectRowUpdate={this.selectRowUpdate}
            components={this.props.components}
          />
        )}
        {(selectedRows.data.length === 0 ||
          [STP.ABOVE, STP.NONE].indexOf(this.options.selectToolbarPlacement) !== -1) &&
          showToolbar && (
            <TableToolbarComponent
              columns={columns}
              columnOrder={columnOrder}
              displayData={displayData}
              data={data}
              filterData={filterData}
              filterList={filterList}
              filterUpdate={this.filterUpdate}
              updateFilterByType={this.updateFilterByType}
              options={this.options}
              resetFilters={this.resetFilters}
              searchText={searchText}
              searchTextUpdate={this.searchTextUpdate}
              searchClose={this.searchClose}
              tableRef={this.getTableContentRef}
              title={title}
              toggleViewColumn={this.toggleViewColumn}
              updateColumns={this.updateColumns}
              setTableAction={this.setTableAction}
              components={this.props.components}
            />
          )}
        <TableFilterListComponent
          options={this.options}
          serverSideFilterList={this.props.options.serverSideFilterList}
          filterListRenderers={columns.map(c => {
            if (c.customFilterListOptions && c.customFilterListOptions.render) return c.customFilterListOptions.render;
            // DEPRECATED: This option is being replaced with customFilterListOptions.render
            if (c.customFilterListRender) return c.customFilterListRender;

            return f => f;
          })}
          customFilterListUpdate={columns.map(c => {
            return c.customFilterListOptions && c.customFilterListOptions.update
              ? c.customFilterListOptions.update
              : null;
          })}
          filterList={filterList}
          filterUpdate={this.filterUpdate}
          columnNames={columnNames}
        />
        <div style={{ position: 'relative', ...tableHeightVal }} className={responsiveClass}>
          {(this.options.resizableColumns === true ||
            (this.options.resizableColumns && this.options.resizableColumns.enabled)) && (
            <TableResizeComponent
              key={rowCount}
              columnOrder={columnOrder}
              updateDividers={fn => (this.updateDividers = fn)}
              setResizeable={fn => (this.setHeadResizeable = fn)}
              options={this.props.options}
              tableId={this.options.tableId}
            />
          )}
          {(() => {
            const components = (
              <MuiTable
                ref={el => (this.tableRef = el)}
                tabIndex={'0'}
                role={'grid'}
                className={tableClassNames}
                {...tableProps}>
                <caption className={classes.caption}>{title}</caption>
                <TableHeadComponent
                  columns={columns}
                  activeColumn={activeColumn}
                  data={displayData}
                  count={rowCount}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  selectedRows={selectedRows}
                  selectRowUpdate={this.selectRowUpdate}
                  toggleSort={this.toggleSortColumn}
                  setCellRef={this.setHeadCellRef}
                  expandedRows={expandedRows}
                  areAllRowsExpanded={this.areAllRowsExpanded}
                  toggleAllExpandableRows={this.toggleAllExpandableRows}
                  options={this.options}
                  sortOrder={sortOrder}
                  columnOrder={columnOrder}
                  updateColumnOrder={this.updateColumnOrder}
                  draggableHeadCellRefs={this.draggableHeadCellRefs}
                  tableRef={this.getTableContentRef}
                  tableId={this.options.tableId}
                  timers={this.timers}
                  components={this.props.components}
                />
                <TableBodyComponent
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
                  columnOrder={columnOrder}
                  filterList={filterList}
                  components={this.props.components}
                  tableId={this.options.tableId}
                />
                {this.options.customTableBodyFooterRender
                  ? this.options.customTableBodyFooterRender({
                      data: displayData,
                      count: rowCount,
                      columns,
                      selectedRows,
                      selectableRows: this.options.selectableRows,
                    })
                  : null}
              </MuiTable>
            );
            if (DragDropBackend) {
              return (
                <DndProvider backend={DragDropBackend} {...dndProps}>
                  {components}
                </DndProvider>
              );
            }

            return components;
          })()}
        </div>
        <TableFooterComponent
          options={this.options}
          page={page}
          rowCount={rowCount}
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

export default withStyles(MUIDataTable, defaultTableStyles, { name: 'MUIDataTable' });
