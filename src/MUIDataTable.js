import React from "react";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import MUIDataTableToolbar from "./MUIDataTableToolbar";
import MUIDataTableToolbarSelect from "./MUIDataTableToolbarSelect";
import MUIDataTableFilterList from "./MUIDataTableFilterList";
import MUIDataTableBody from "./MUIDataTableBody";
import MUIDataTableHead from "./MUIDataTableHead";
import MUIDataTablePagination from "./MUIDataTablePagination";
import cloneDeep from "lodash.clonedeep";
import merge from "lodash.merge";
import textLabels from "./textLabels";
import { withStyles } from "@material-ui/core/styles";

function equals(a, b) {
  if (typeof a !== typeof b) {
    return false;
  }

  // Naively assume functions to be equal
  if (typeof a === "function") {
    return true;
  }

  if (
    typeof a === "number" ||
    typeof a === "string" ||
    a === null ||
    a === undefined ||
    b === null ||
    b === undefined ||
    typeof a === "boolean"
  ) {
    return a === b;
  }

  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) {
      return false;
    }

    return a.every((x, i) => equals(a[i], b[i]));
  }

  if (typeof a === "object") {
    if (Object.keys(a).length !== Object.keys(b).length) {
      return false;
    }

    let keys = Object.keys(a);
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      const equal = equals(a[k], b[k]);
      if (!equal) {
        return false;
      }
    }

    keys = Object.keys(b);
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      const equal = equals(a[k], b[k]);
      if (!equal) {
        return false;
      }
    }
    return true;
  }

  return false;
}

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

const TABLE_LOAD = {
  INITIAL: 1,
  UPDATE: 2,
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
      textLabels: PropTypes.object,
      pagination: PropTypes.bool,
      customToolbar: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
      customToolbarSelect: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
      selectableRows: PropTypes.bool,
      caseSensitive: PropTypes.bool,
      rowHover: PropTypes.bool,
      page: PropTypes.number,
      count: PropTypes.number,
      filterList: PropTypes.array,
      rowsSelected: PropTypes.array,
      rowsPerPage: PropTypes.number,
      rowsPerPageOptions: PropTypes.array,
      filter: PropTypes.bool,
      sort: PropTypes.bool,
      search: PropTypes.bool,
      print: PropTypes.bool,
      delete: PropTypes.bool,
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
    announceText: null,
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
    showResponsive: false,
    searchText: null,
  };

  constructor() {
    super();
    this.tableRef = false;
    this.toolbar = React.createRef();
  }

  componentWillMount() {
    this.initializeTable(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (!equals(this.props.data, nextProps.data) || !equals(this.props.columns, nextProps.columns)) {
      this.initializeTable(nextProps);
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
      responsive: "stacked",
      filterType: "checkbox",
      pagination: true,
      textLabels,
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
      delete: true,
      viewColumns: true,
      download: true,
    };

    this.options = merge(defaultOptions, props.options);
  }

  setTableOptions(props) {
    const optionNames = ["rowsPerPage", "page", "filterList", "rowsPerPageOptions"];
    const optState = optionNames.reduce((acc, cur) => {
      if (this.options[cur]) {
        let val = this.options[cur];
        if (cur === "page") val--;
        acc[cur] = val;
      }
      return acc;
    }, {});
    this.setState(optState);
  }

  /*
   *  Build the source table data
   */

  setTableData(props, status) {
    const { data, columns, options } = props;

    let columnData = [],
      filterData = [],
      filterList = [],
      tableData = [],
      totals = columns.map(() => 0);

    columns.forEach((column, colIndex) => {
      let columnOptions = {
        display: true,
        filter: true,
        sort: true,
        sortDirection: null,
        noExportOnNoDisplay: false,
        showable: true,
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

      totals[colIndex] = window._ ? window._("Total:") : "Total:";
      for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
        let value = status === TABLE_LOAD.INITIAL ? data[rowIndex][colIndex] : data[rowIndex].data[colIndex];

        const v = parseFloat(value);
        if (typeof value === "number" || v === 0 || v) {
          totals[colIndex] = parseFloat(totals[colIndex]) || 0;
          totals[colIndex] += v;
        }

        if (typeof tableData[rowIndex] === "undefined") {
          tableData.push({
            index: status === TABLE_LOAD.INITIAL ? rowIndex : data[rowIndex].index,
            data: status === TABLE_LOAD.INITIAL ? data[rowIndex] : data[rowIndex].data,
          });
        }

        if (typeof columnOptions.customRender === "function") {
          const tableMeta = this.getCustomRenderMeta(rowIndex, colIndex, value, [], columnData, this.state);
          const funcResult = columnOptions.customRender(value, tableMeta);

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

      if (typeof columnOptions.customRender === "function" && typeof totals[colIndex] === "number") {
        const tableMeta = this.getCustomRenderMeta(data.length, colIndex, totals[colIndex], [], columnData, this.state);
        const render = columnOptions.totalRender || columnOptions.customRender;
        totals[colIndex] = render(totals[colIndex], tableMeta);
      }

      if (!columnOptions.display) {
        totals[colIndex] = "";
      }
    });

    if (options.filterList) filterList = options.filterList;

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
          selectedRowsData.data.push({ index: row, dataIndex: row });
          selectedRowsData.lookup[row] = true;
        });
      }
    }

    /* set source data and display Data set source set */
    this.setState(prevState => ({
      columns: columnData,
      filterData: filterData,
      filterList: filterList,
      selectedRows: selectedRowsData,
      data: tableData,
      totals: totals.filter(v => v !== ""),
      displayData: this.getDisplayData(columnData, tableData, filterList, prevState.searchText),
    }));
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

      if (columns[index].customRender) {
        const tableMeta = this.getCustomRenderMeta(rowIndex, index, row, columns[index], this.state.data, {
          ...this.state,
          filterList: filterList,
          searchText: searchText,
        });

        const funcResult = columns[index].customRender(
          columnValue,
          tableMeta,
          this.updateDataCol.bind(null, rowIndex, index),
        );
        columnDisplay = funcResult;

        /* drill down to get the value of a cell */
        columnValue =
          typeof funcResult === "string"
            ? funcResult
            : funcResult.props && funcResult.props.value
              ? funcResult.props.value
              : columnValue;
      }

      displayRow.push(columnDisplay);

      if (filterList[index].length && filterList[index].indexOf(columnValue) < 0) {
        isFiltered = true;
      }

      const searchCase = !this.options.caseSensitive ? columnValue.toString().toLowerCase() : columnValue.toString();

      if (searchText && searchCase.indexOf(searchText.toLowerCase()) >= 0) {
        isSearchFound = true;
      }
    }

    if (isFiltered || (searchText && !isSearchFound)) return null;
    else return displayRow;
  }

  updateDataCol = (row, index, value) => {
    this.setState(prevState => {
      let changedData = cloneDeep(prevState.data);
      let filterData = cloneDeep(prevState.filterData);

      const tableMeta = this.getCustomRenderMeta(row, index, row, prevState.columns[index], prevState.data, prevState);
      const funcResult = prevState.columns[index].customRender(value, tableMeta);

      const filterValue =
        React.isValidElement(funcResult) && funcResult.props.value
          ? funcResult.props.value
          : prevState["data"][row][index];

      const prevFilterIndex = filterData[index].indexOf(filterValue);
      filterData[index].splice(prevFilterIndex, 1, filterValue);

      changedData[row].data[index] = value;

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

  getCustomRenderMeta = (rowIndex, colIndex, rowData, columnData, tableData, curState) => {
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
        columns[index].display = !columns[index].display;
        return {
          columns: columns,
        };
      },
      () => {
        if (this.options.onColumnViewChange) {
          this.options.onColumnViewChange(
            this.state.columns[index].name,
            this.state.columns[index].display ? "add" : "remove",
          );
        }
      },
    );
  };

  getSortDirection(column) {
    return column.sortDirection === "asc" ? "ascending" : "descending";
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
          this.options.onColumnSortChange(
            this.state.columns[index].name,
            this.getSortDirection(this.state.columns[index]),
          );
        }
      },
    );
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
    this.setState(
      prevState => {
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
      },
    );
  };

  filterUpdate = (index, column, type) => {
    this.setState(
      prevState => {
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
      },
    );
  };

  selectRowDelete = () => {
    const { selectedRows, data, filterList } = this.state;

    const selectedMap = this.buildSelectedMap(selectedRows.data);
    const cleanRows = data.filter((_, index) => !selectedMap[index]);

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
    );
  };

  buildSelectedMap = rows => {
    return rows.reduce((accum, { index }) => {
      accum[index] = true;
      return accum;
    }, {});
  };

  selectRowUpdate = (type, value) => {
    if (type === "head") {
      this.setState(
        prevState => {
          const { data } = prevState;
          const selectedRowsLen = prevState.selectedRows.data.length;
          const isDeselect =
            selectedRowsLen === data.length || (selectedRowsLen < data.length && selectedRowsLen > 0) ? true : false;

          let selectedRows = Array(data.length)
            .fill()
            .map((d, i) => ({ index: i }));

          let newRows = [...prevState.selectedRows, ...selectedRows];
          let selectedMap = this.buildSelectedMap(newRows);

          if (isDeselect) {
            newRows = prevState.selectedRows.data.filter(({ index }) => !selectedMap[index]);
            selectedMap = this.buildSelectedMap(newRows);
          }

          return {
            curSelectedRows: selectedRows,
            selectedRows: {
              data: newRows,
              lookup: selectedMap,
            },
          };
        },
        () => {
          if (this.options.onRowsSelect) {
            this.options.onRowsSelect(this.state.curSelectedRows.data, this.state.selectedRows.data);
          }
        },
      );
    } else if (type === "cell") {
      this.setState(
        prevState => {
          const { index, dataIndex } = value;
          let selectedRows = this.props.options.radio ? [] : [...prevState.selectedRows.data];
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
              lookup: this.buildSelectedMap(selectedRows),
              data: selectedRows,
            },
          };
        },
        () => {
          if (this.options.onRowsSelect) {
            this.options.onRowsSelect([value], this.state.selectedRows.data);
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
    let sortedData = data.map((row, sIndex) => ({
      data: row.data[col],
      position: sIndex,
      rowSelected: this.state.selectedRows.lookup[sIndex] ? true : false,
    }));

    sortedData.sort(this.sortCompare(order));

    let tableData = [];
    let selectedRows = [];

    for (let i = 0; i < sortedData.length; i++) {
      const row = sortedData[i];
      tableData.push(data[row.position]);
      if (row.rowSelected) {
        selectedRows.push({ index: i, dataIndex: data[row.position].index });
      }
    }

    return {
      data: tableData,
      selectedRows: {
        lookup: this.buildSelectedMap(selectedRows),
        data: selectedRows,
      },
    };
  }

  render() {
    const { classes, title, height, totalled } = this.props;
    const {
      announceText,
      data,
      displayData,
      columns,
      page,
      filterData,
      filterList,
      rowsPerPage,
      selectedRows,
      searchText,
      totals,
    } = this.state;

    const rowCount = this.options.count || data.length;
    if (!rowCount) return false;

    if (height) {
      return (
        <Paper elevation={4} ref={el => (this.tableContent = el)} className={classes.paper}>
          {selectedRows.data.length && this.options.delete ? (
            <MUIDataTableToolbarSelect
              options={this.options}
              selectedRows={selectedRows}
              onRowsDelete={this.selectRowDelete}
              ref={this.toolbar}
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
              ref={this.toolbar}
              title={title}
              toggleViewColumn={this.toggleViewColumn}
            />
          )}
          <MUIDataTableFilterList options={this.options} filterList={filterList} filterUpdate={this.filterUpdate} />
          <div className="header-only">
            <Table ref={el => (this.tableRef = el)} tabIndex={"0"} role={"grid"}>
              <caption className={classes.caption}>{title}</caption>
              <MUIDataTableHead
                columns={columns}
                data={this.state.displayData}
                tableData={this.state.data}
                count={rowCount}
                columns={columns}
                page={page}
                rowsPerPage={rowsPerPage}
                handleHeadUpdateRef={fn => (this.updateToolbarSelect = fn)}
                selectedRows={selectedRows}
                selectRowUpdate={this.selectRowUpdate}
                toggleSort={this.toggleSortColumn}
                options={this.options}
              />
              <MUIDataTableBody
                data={this.state.displayData}
                tableData={this.state.data}
                count={rowCount}
                columns={columns}
                page={page}
                rowsPerPage={rowsPerPage}
                selectedRows={selectedRows}
                selectRowUpdate={this.selectRowUpdate}
                options={this.options}
                searchText={searchText}
                filterList={filterList}
                totals={totalled && totals}
              />
            </Table>
          </div>
          <div className="body-only" style={{ overflowY: "auto", height }}>
            <Table ref={el => (this.tableRef = el)} tabIndex={"0"} role={"grid"}>
              <caption className={classes.caption}>{title}</caption>
              <MUIDataTableHead
                columns={columns}
                data={this.state.displayData}
                tableData={this.state.data}
                count={rowCount}
                columns={columns}
                page={page}
                rowsPerPage={rowsPerPage}
                handleHeadUpdateRef={fn => (this.updateToolbarSelect = fn)}
                selectedRows={selectedRows}
                selectRowUpdate={this.selectRowUpdate}
                toggleSort={this.toggleSortColumn}
                options={this.options}
              />
              <MUIDataTableBody
                data={this.state.displayData}
                tableData={this.state.data}
                count={rowCount}
                columns={columns}
                page={page}
                rowsPerPage={rowsPerPage}
                selectedRows={selectedRows}
                selectRowUpdate={this.selectRowUpdate}
                options={this.options}
                searchText={searchText}
                filterList={filterList}
                totals={totalled && totals}
              />
            </Table>
          </div>
          <Table>
            {this.options.pagination ? (
              <MUIDataTablePagination
                count={rowCount}
                page={page}
                rowsPerPage={rowsPerPage}
                changeRowsPerPage={this.changeRowsPerPage}
                changePage={this.changePage}
                component={"div"}
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

    return (
      <Paper elevation={4} ref={el => (this.tableContent = el)} className={classes.paper}>
        {selectedRows.data.length && this.options.delete ? (
          <MUIDataTableToolbarSelect
            options={this.options}
            selectedRows={selectedRows}
            onRowsDelete={this.selectRowDelete}
            ref={this.toolbar}
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
            ref={this.toolbar}
            tableRef={() => this.tableContent}
            title={title}
            toggleViewColumn={this.toggleViewColumn}
          />
        )}
        <MUIDataTableFilterList options={this.options} filterList={filterList} filterUpdate={this.filterUpdate} />
        <div className={this.options.responsive === "scroll" ? classes.responsiveScroll : null}>
          <Table ref={el => (this.tableRef = el)} tabIndex={"0"} role={"grid"}>
            <caption className={classes.caption}>{title}</caption>
            <MUIDataTableHead
              columns={columns}
              data={this.state.displayData}
              tableData={this.state.data}
              count={rowCount}
              columns={columns}
              page={page}
              rowsPerPage={rowsPerPage}
              handleHeadUpdateRef={fn => (this.updateToolbarSelect = fn)}
              selectedRows={selectedRows}
              selectRowUpdate={this.selectRowUpdate}
              toggleSort={this.toggleSortColumn}
              options={this.options}
            />
            <MUIDataTableBody
              data={this.state.displayData}
              tableData={this.state.data}
              count={rowCount}
              columns={columns}
              page={page}
              rowsPerPage={rowsPerPage}
              selectedRows={selectedRows}
              selectRowUpdate={this.selectRowUpdate}
              options={this.options}
              searchText={searchText}
              filterList={filterList}
              totals={totalled && totals}
            />
          </Table>
        </div>
        <Table>
          {this.options.pagination ? (
            <MUIDataTablePagination
              count={rowCount}
              page={page}
              rowsPerPage={rowsPerPage}
              changeRowsPerPage={this.changeRowsPerPage}
              changePage={this.changePage}
              component={"div"}
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
