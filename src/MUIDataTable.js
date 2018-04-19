import React from "react";
import PropTypes from "prop-types";
import Paper from "material-ui/Paper";
import Table from "material-ui/Table";
import MUIDataTableToolbar from "./MUIDataTableToolbar";
import MUIDataTableToolbarSelect from "./MUIDataTableToolbarSelect";
import MUIDataTableFilterList from "./MUIDataTableFilterList";
import MUIDataTableBody from "./MUIDataTableBody";
import MUIDataTableHead from "./MUIDataTableHead";
import MUIDataTablePagination from "./MUIDataTablePagination";
import cloneDeep from "lodash.clonedeep";
import { withStyles } from "material-ui/styles";

const defaultTableStyles = {
  root: {},
  responsiveScroll: {
    overflowX: "auto",
  },
  caption: {
    position: "absolute",
    left: "-1000px",
  },
  liveAnnounce: {
    border: "0",
    clip: "rect(0 0 0 0)",
    height: "1px",
    margin: "-1px",
    overflow: "hidden",
    padding: "0",
    position: "absolute",
    width: "1px",
  },
};

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
            display: PropTypes.bool,
            filter: PropTypes.bool,
            sort: PropTypes.bool,
            customRender: PropTypes.func,
          }),
        }),
      ]),
    ).isRequired,
    /** Options used to describe table */
    options: PropTypes.shape({
      responsive: PropTypes.oneOf(["stacked", "scroll"]),
      filterType: PropTypes.oneOf(["dropdown", "checkbox", "multiselect"]),
      pagination: PropTypes.bool,
      selectableRows: PropTypes.bool,
      caseSensitive: PropTypes.bool,
      rowHover: PropTypes.bool,
      rowsPerPage: PropTypes.number,
      rowsPerPageOptions: PropTypes.array,
      filter: PropTypes.bool,
      sort: PropTypes.bool,
      search: PropTypes.bool,
      print: PropTypes.bool,
      viewColumns: PropTypes.bool,
      download: PropTypes.bool,
    }),
    /** Pass and use className to style MUIDataTable as desired */
    className: PropTypes.string,
  };

  static defaultProps = {
    title: "",
    options: {},
    data: [],
    columns: [],
  };

  state = {
    open: false,
    announceText: null,
    data: [],
    displayData: [],
    page: 0,
    rowsPerPage: 0,
    columns: [],
    filterData: [],
    filterList: [],
    selectedRows: [],
    showResponsive: false,
    searchText: null,
  };

  constructor() {
    super();
    this.tableRef = false;
  }

  componentWillMount() {
    this.initializeTable(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data || this.props.columns !== nextProps.columns) {
      this.initializeTable(nextProps);
    }
  }

  initializeTable(props) {
    this.getDefaultOptions(props);
    this.setTableOptions(props);
    this.setTableData(props);
  }

  /*
   * React currently does not support deep merge for defaultProps. Objects are overwritten
   */
  getDefaultOptions(props) {
    const defaultOptions = {
      responsive: "stacked",
      filterType: "checkbox",
      pagination: true,
      selectableRows: true,
      caseSensitive: false,
      rowHover: true,
      rowsPerPage: 10,
      rowsPerPageOptions: [10, 15, 100],
      filter: true,
      sortFilterList: true,
      sort: true,
      search: true,
      print: true,
      viewColumns: true,
      download: true,
    };

    this.options = { ...defaultOptions, ...props.options };
  }

  setTableOptions(props) {
    if (props.options) {
      if (props.options.rowsPerPageOptions) {
        this.setState(() => ({
          rowsPerPageOptions: props.options.rowsPerPageOptions,
        }));
      }
      if (props.options.rowsPerPage) {
        this.setState(() => ({
          rowsPerPage: props.options.rowsPerPage,
        }));
      }
    }
  }

  /*
   *  Build the source table data
   */

  setTableData(props) {
    const { data, columns } = props;

    let columnData = [],
      filterData = [],
      filterList = [];

    columns.forEach((column, colIndex) => {
      let columnOptions = {
        display: true,
        filter: true,
        sort: true,
        sortDirection: null,
      };

      if (typeof column === "object") {
        columnOptions = {
          name: column.name,
          ...columnOptions,
          ...(column.options ? column.options : {}),
        };
      } else {
        columnOptions = { ...columnOptions, name: column };
      }

      columnData.push(columnOptions);

      filterData[colIndex] = [];
      filterList[colIndex] = [];

      for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
        let value = data[rowIndex][colIndex];
        if (typeof columnOptions.customRender === "function") {
          const funcResult = columnOptions.customRender(rowIndex, data[rowIndex][colIndex]);

          if (React.isValidElement(funcResult) && funcResult.props.value) {
            value = funcResult.props.value;
          } else if (typeof funcResult === "string") {
            value = funcResult;
          }
        }

        if (filterData[colIndex].indexOf(value) < 0) filterData[colIndex].push(value);
      }

      if (this.options.sortFilterList) {
        const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });
        filterData[colIndex].sort(collator.compare);
      }
    });

    /* set source data and display Data set source set */
    this.setState(prevState => ({
      columns: columnData,
      filterData: filterData,
      filterList: filterList,
      selectedRows: [],
      data: data,
      displayData: this.getDisplayData(columnData, data, filterList, prevState.searchText),
    }));
  }

  /*
   *  Build the table data used to display to the user (ie: after filter/search applied)
   */

  isRowDisplayed(columns, row, filterList, searchText) {
    let isFiltered = false,
      isSearchFound = false;

    for (let index = 0; index < row.length; index++) {
      let column = row[index];

      if (columns[index].customRender) {
        const funcResult = columns[index].customRender(index, column);
        column =
          typeof funcResult === "string"
            ? funcResult
            : funcResult.props && funcResult.props.value ? funcResult.props.value : column;
      }

      if (filterList[index].length && filterList[index].indexOf(column) < 0) {
        isFiltered = true;
        break;
      }

      const searchCase = !this.options.caseSensitive ? column.toString().toLowerCase() : column.toString();

      if (searchText && searchCase.indexOf(searchText.toLowerCase()) >= 0) {
        isSearchFound = true;
        break;
      }
    }

    if (isFiltered || (searchText && !isSearchFound)) return false;
    else return true;
  }

  //
  // possible place for future callbacks:
  //  - onDataChange(tableData)
  //  - onFilterListChange(filterList)
  //

  updateDataCol = (row, index, value) => {
    this.setState(prevState => {
      let changedData = cloneDeep(prevState.data);
      let filterData = cloneDeep(prevState.filterData);

      const funcResult = prevState.columns[index].customRender(index, value);

      const filterValue =
        React.isValidElement(funcResult) && funcResult.props.value
          ? funcResult.props.value
          : prevState["data"][row][index];

      const prevFilterIndex = filterData[index].indexOf(filterValue);
      filterData[index].splice(prevFilterIndex, 1, filterValue);

      changedData[row][index] = value;

      if (this.options.sortFilterList) {
        const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });
        filterData[index].sort(collator.compare);
      }

      return {
        data: changedData,
        filterData: filterData,
        displayData: this.getDisplayData(prevState.columns, changedData, prevState.filterList, prevState.searchText),
      };
    });
  };

  getDisplayData(columns, data, filterList, searchText) {
    let newRows = [];

    for (let index = 0; index < data.length; index++) {
      if (this.isRowDisplayed(columns, data[index], filterList, searchText))
        newRows.push(
          columns.map((column, colIndex) => {
            return typeof column.customRender === "function"
              ? column.customRender(index, data[index][colIndex], this.updateDataCol.bind(null, index, colIndex))
              : data[index][colIndex];
          }),
        );
    }

    return newRows;
  }

  toggleViewColumn = index => {
    this.setState(prevState => {
      const columns = cloneDeep(prevState.columns);
      columns[index].display = !columns[index].display;
      return {
        columns: columns,
      };
    }, 
    () => {
      if (this.options.onColumnViewChange) {
        this.options.onColumnViewChange(this.state.columns[index].name, this.state.columns[index].display ? "add" : "remove");
      }
    });
  };

  getSortDirection(column) {
    return column.sortDirection === "asc" ? "ascending" : "descending";
  }

  toggleSortColumn = index => {
    this.setState(prevState => {
      let columns = cloneDeep(prevState.columns);
      let data = prevState.data;
      const order = prevState.columns[index].sortDirection;

      for (let pos = 0; pos < columns.length; pos++) {
        if (index !== pos) {
          columns[pos].sortDirection = null;
        } else {
          columns[pos].sortDirection = columns[pos].sortDirection === "asc" ? "desc" : "asc";
        }
      }

      const orderLabel = this.getSortDirection(columns[index]);
      const announceText = `Table now sorted by ${columns[index].name} : ${orderLabel}`;
      const sortedData = this.sortTable(data, index, order);

      return {
        columns: columns,
        announceText: announceText,
        data: sortedData.data,
        displayData: this.getDisplayData(columns, sortedData.data, prevState.filterList, prevState.searchText),
        selectedRows: sortedData.selectedRows,
      };
    },
    () => {
      if (this.options.onColumnSortChange) {
        this.options.onColumnSortChange(this.state.columns[index].name, this.getSortDirection(this.state.columns[index]));
      }
    });
  };

  changeRowsPerPage = rows => {
    this.setState(
      () => ({
        rowsPerPage: rows,
      }),
      () => {
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
        if (this.options.onChangePage) {
          this.options.onChangePage(this.state.page);
        }
      },
    );
  };

  searchTextUpdate = text => {
    this.setState(prevState => ({
      searchText: text && text.length ? text : null,
      displayData: this.getDisplayData(prevState.columns, prevState.data, prevState.filterList, text),
    }));
  };

  resetFilters = () => {
    this.setState(prevState => {
      const filterList = prevState.columns.map((column, index) => []);

      return {
        filterList: filterList,
        displayData: this.getDisplayData(prevState.columns, prevState.data, filterList, prevState.searchText),
      };
    },
    () => {
      if (this.options.onFilterChange) {
        this.options.onFilterChange(null, this.state.filterList);
      }
    });
  };

  filterUpdate = (index, column, type) => {
    this.setState(prevState => {
      const filterList = cloneDeep(prevState.filterList);
      const filterPos = filterList[index].indexOf(column);

      switch (type) {
        case "checkbox":
          filterPos >= 0 ? filterList[index].splice(filterPos, 1) : filterList[index].push(column);
          break;
        case "multiselect":
          filterList[index] = column === "" ? [] : column;
          break;
        default:
          filterList[index] = filterPos >= 0 || column === "" ? [] : [column];
      }

      return {
        filterList: filterList,
        displayData: this.getDisplayData(prevState.columns, prevState.data, filterList, prevState.searchText),
      };
    }, 
    () => {
      if (this.options.onFilterChange) {
        this.options.onFilterChange(column, this.state.filterList);
      }
    });
  };

  selectRowDelete = () => {
    const cleanRows = this.state.data.filter((_, index) => this.state.selectedRows.indexOf(index) === -1);

    if (this.options.onRowsDelete) {
      this.options.onRowsDelete(this.state.selectedRows);
    }

    this.updateToolbarSelect(false);

    this.setTableData({
      columns: this.props.columns,
      data: cleanRows,
    });
  };

  selectRowUpdate = (type, value) => {
    if (type === "head") {
      this.setState(
        prevState => {
          const { data, page } = prevState;
          const rowsPerPage = prevState.rowsPerPage ? prevState.rowsPerPage : this.options.rowsPerPage;

          const fromIndex = page === 0 ? 0 : page * rowsPerPage;
          const toIndex = Math.min(data.length, (page + 1) * rowsPerPage);
          let selectedRows = Array(toIndex - fromIndex)
            .fill()
            .map((d, i) => i + fromIndex);

          let newRows = [...prevState.selectedRows, ...selectedRows];

          if (value === false) {
            newRows = prevState.selectedRows.filter(val => selectedRows.indexOf(val) === -1);
          }

          return {
            curSelectedRows: selectedRows,
            selectedRows: newRows,
          };
        },
        () => {
          if (this.options.onRowsSelect) {
            this.options.onRowsSelect(this.state.curSelectedRows, this.state.selectedRows);
          }
        },
      );
    } else if (type === "cell") {
      this.setState(
        prevState => {
          let selectedRows = [...prevState.selectedRows];
          const rowPos = selectedRows.indexOf(value);

          if (rowPos >= 0) {
            selectedRows.splice(rowPos, 1);
          } else {
            selectedRows.push(value);
          }

          return {
            selectedRows: selectedRows,
          };
        },
        () => {
          if (this.options.onRowsSelect) {
            this.options.onRowsSelect([value], this.state.selectedRows);
          }
        },
      );
    }
  };

  sortCompare(order) {
    return (a, b) =>
      (typeof a.data.localeCompare === "function" ? a.data.localeCompare(b.data) : a.data - b.data) *
      (order === "asc" ? -1 : 1);
  }

  sortTable(data, col, order) {
    let sortedData = data.map((row, index) => ({
      data: row[col],
      position: index,
      rowSelected: this.state.selectedRows.indexOf(index) >= 0 ? true : false,
    }));

    sortedData.sort(this.sortCompare(order));

    let tableData = [];
    let selectedRows = [];

    for (let i = 0; i < sortedData.length; i++) {
      const row = sortedData[i];
      tableData.push(data[row.position]);
      if (row.rowSelected) {
        selectedRows.push(i);
      }
    }

    return {
      data: tableData,
      selectedRows: selectedRows,
    };
  }

  render() {
    const { classes, title } = this.props;
    const {
      announceText,
      data,
      displayData,
      columns,
      page,
      filterData,
      filterList,
      selectedRows,
      searchText,
    } = this.state;

    const rowsPerPage = this.state.rowsPerPage ? this.state.rowsPerPage : this.options.rowsPerPage;

    return (
      <Paper
        elevation={4}
        ref={el => (this.tableContent = el)}
      >
        {selectedRows.length ? (
          <MUIDataTableToolbarSelect
            options={this.options}
            selectedRows={selectedRows}
            onRowsDelete={this.selectRowDelete}
          />
        ) : (
          <MUIDataTableToolbar
            columns={columns}
            data={data}
            filterData={filterData}
            filterList={filterList}
            filterUpdate={this.filterUpdate}
            options={this.options}
            resetFilters={this.resetFilters}
            searchTextUpdate={this.searchTextUpdate}
            tableRef={() => this.tableContent}
            title={title}
            toggleViewColumn={this.toggleViewColumn}
          />
        )}
        <MUIDataTableFilterList options={this.options} filterList={filterList} filterUpdate={this.filterUpdate} />
        <div className={this.options.responsive === "scroll" ? classes.responsiveScroll : null}>
          <Table ref={el => (this.tableRef = el)} tabIndex={"0"} role={"grid"} >
            <caption className={classes.caption}>{title}</caption>
            <MUIDataTableHead
              columns={columns}
              handleHeadUpdateRef={fn => (this.updateToolbarSelect = fn)}
              selectRowUpdate={this.selectRowUpdate}
              toggleSort={this.toggleSortColumn}
              options={this.options}
            />
            <MUIDataTableBody
              data={this.state.displayData}
              columns={columns}
              page={page}
              rowsPerPage={rowsPerPage}
              selectedRows={selectedRows}
              selectRowUpdate={this.selectRowUpdate}
              options={this.options}
              searchText={searchText}
              filterList={filterList}
            />
          </Table>
        </div>
        <Table>
          {this.options.pagination ? (
            <MUIDataTablePagination
              count={displayData.length}
              page={page}
              rowsPerPage={rowsPerPage}
              changeRowsPerPage={this.changeRowsPerPage}
              changePage={this.changePage}
              component="div"
              options={this.options}
            />
          ) : (
            false
          )}
        </Table>
        <div className={classes.liveAnnounce} aria-live={"polite"} ref={el => (this.announceRef = el)}>
          {announceText}
        </div>
      </Paper>
    );
  }
}

export default withStyles(defaultTableStyles, { name: "MUIDataTable" })(MUIDataTable);
