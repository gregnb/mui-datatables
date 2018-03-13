import React from "react";
import ReactDOMServer from "react-dom/server";
import PropTypes from "prop-types";
import Paper from "material-ui/Paper";
import Table from "material-ui/Table";
import MUIDataTableToolbar from "./MUIDataTableToolbar";
import MUIDataTableFilterList from "./MUIDataTableFilterList";
import MUIDataTableBody from "./MUIDataTableBody";
import MUIDataTableHead from "./MUIDataTableHead";
import MUIDataTablePagination from "./MUIDataTablePagination";
import { getStyle, DataStyles } from "./DataStyles";

const defaultTableStyles = {
  root: {},
  responsiveScroll: {
    display: "block",
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
    columns: PropTypes.array.isRequired,
    /** Options used to describe table */
    options: PropTypes.shape({
      responsive: PropTypes.oneOf(["stacked", "scroll"]),
      filterType: PropTypes.oneOf(["dropdown", "checkbox"]),
      pagination: PropTypes.bool,
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

  state = {
    open: false,
    announceText: null,
    data: [],
    textData: [],
    displayData: [],
    page: 0,
    rowsPerPage: 0,
    columns: [],
    filterData: [],
    filterList: [],
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

  getDefaultOptions(props) {
    const defaultOptions = {
      responsive: "stacked",
      filterType: "checkbox",
      pagination: true,
      caseSensitive: false,
      rowHover: true,
      rowsPerPage: 10,
      rowsPerPageOptions: [10, 15, 100],
      filter: true,
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
      filterList = [],
      textData = [];

    for (let colIndex = 0; colIndex < columns.length; colIndex++) {
      columnData.push({
        name: columns[colIndex],
        display: true,
        sort: null,
      });

      filterData[colIndex] = [];
      filterList[colIndex] = [];

      for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
        const value = this.getText(data[rowIndex][colIndex]);

        if (filterData[colIndex].indexOf(value) < 0) filterData[colIndex].push(value);
        if (!textData[rowIndex]) textData[rowIndex] = [];
        textData[rowIndex].push(value);
      }
    }

    /* set source data and display Data set source set */
    this.setState(prevState => ({
      columns: columnData,
      filterData: filterData,
      filterList: filterList,
      textData: textData,
      data: data,
      displayData: this.getDisplayData(data, filterList, prevState.searchText),
    }));
  }

  /*
   *  Build the table data used to display to the user (ie: after filter/search applied)
   */

  isRowDisplayed(row, filterList, searchText) {
    let isFiltered = false,
      isSearchFound = false;

    for (let index = 0; index < row.length; index++) {
      const column = this.getText(row[index]);

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

  getDisplayData(data, filterList, searchText) {
    let newRows = [];

    for (let index = 0; index < data.length; index++) {
      if (this.isRowDisplayed(data[index], filterList, searchText)) newRows.push(data[index]);
    }

    return newRows;
  }

  toggleViewColumn = index => {
    this.setState(prevState => {
      const columns = [...prevState.columns];
      columns[index].display = !columns[index].display;
      return {
        columns: columns,
      };
    });
  };

  toggleSortColumn = index => {
    this.setState(prevState => {
      let columns = [...prevState.columns];
      const displayData = prevState.displayData;
      const order = prevState.columns[index].sort;

      for (let pos = 0; pos < columns.length; pos++) {
        if (index !== pos) {
          columns[pos].sort = null;
        } else {
          columns[pos].sort = columns[pos].sort === "asc" ? "desc" : "asc";
        }
      }

      const orderLabel = columns[index].sort === "asc" ? "ascending" : "descending";
      const announceText = `Table now sorted by ${columns[index].name} : ${orderLabel}`;

      return {
        columns: columns,
        announceText: announceText,
        displayData: this.sortTable(displayData, index, order),
      };
    });
  };

  changeRowsPerPage = rows => {
    this.setState(() => ({
      rowsPerPage: rows,
    }));
  };

  changePage = page => {
    this.setState(() => ({
      page: page,
    }));
  };

  searchTextUpdate = text => {
    this.setState(prevState => ({
      searchText: text && text.length ? text : null,
      displayData: this.getDisplayData(prevState.data, prevState.filterList, text),
    }));
  };

  resetFilters = () => {
    this.setState(prevState => {
      const filterList = prevState.columns.map((column, index) => []);

      return {
        filterList: filterList,
        displayData: this.getDisplayData(prevState.data, filterList, prevState.searchText),
      };
    });
  };

  filterUpdate = (index, column, type) => {
    this.setState(prevState => {
      const filterList = [...prevState.filterList];
      const filterPos = filterList[index].indexOf(column);

      if (filterPos >= 0) {
        if (type === "checkbox") filterList[index].splice(filterPos, 1);
        else filterList[index] = [];
      } else {
        if (type === "checkbox") filterList[index].push(column);
        else filterList[index] = column === "" ? [] : [column];
      }

      return {
        filterList: filterList,
        displayData: this.getDisplayData(prevState.data, filterList, prevState.searchText),
      };
    });
  };

  sortCompare(order) {
    return (colOne, colTwo) => {
      let comparison = 0;

      const dataOne = typeof colOne.data === "string" ? colOne.data.toLowerCase() : colOne.data;
      const dataTwo = typeof colTwo.data === "string" ? colTwo.data.toLowerCase() : colTwo.data;

      if (dataOne > dataTwo) {
        comparison = 1;
      } else if (dataOne < dataTwo) {
        comparison = -1;
      }

      return order === "asc" ? comparison * -1 : comparison;
    };
  }

  sortTable(data, col, order) {
    let sortedData = data.map((row, index) => ({
      data: row[col],
      position: index,
    }));

    sortedData.sort(this.sortCompare(order));

    const updatedTable = sortedData.map(item => data[item.position]);
    return updatedTable;
  }

  getText(val) {
    return !React.isValidElement(val) ? val : new DOMParser().parseFromString(ReactDOMServer.renderToStaticMarkup(val), "text/html").body.textContent;
  }

  render() {
    const { title } = this.props;
    const { announceText, textData, displayData, columns, page, filterData, filterList, searchText } = this.state;

    const rowsPerPage = this.state.rowsPerPage ? this.state.rowsPerPage : this.options.rowsPerPage;

    return (
      <DataStyles defaultStyles={defaultTableStyles} name="MUIDataTable" styles={getStyle(this.options, "table.main")}>
        {tableStyles => (
          <Paper
            elevation={4}
            ref={el => (this.tableContent = el)}
            className={this.options.responsive === "scroll" ? tableStyles.responsiveScroll : null}>
            <MUIDataTableToolbar
              columns={columns}
              data={textData}
              filterData={filterData}
              filterList={filterList}
              filterUpdate={this.filterUpdate}
              options={this.options}
              resetFilters={this.resetFilters}
              searchTextUpdate={this.searchTextUpdate}
              tableRef={() => this.tableRef}
              title={title}
              toggleViewColumn={this.toggleViewColumn}
            />
            <MUIDataTableFilterList options={this.options} filterList={filterList} filterUpdate={this.filterUpdate} />
            <Table ref={el => (this.tableRef = el)} tabIndex={"0"} role={"grid"} aria-readonly={"true"}>
              <caption className={tableStyles.caption}>{title}</caption>
              <MUIDataTableHead columns={columns} toggleSort={this.toggleSortColumn} options={this.options} />
              <MUIDataTableBody
                data={this.state.displayData}
                columns={columns}
                page={page}
                rowsPerPage={rowsPerPage}
                options={this.options}
                searchText={searchText}
                filterList={filterList}
              />
              {this.options.pagination ? (
                <MUIDataTablePagination
                  count={displayData.length}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  changeRowsPerPage={this.changeRowsPerPage}
                  changePage={this.changePage}
                  options={this.options}
                />
              ) : (
                false
              )}
            </Table>
            <div className={tableStyles.liveAnnounce} aria-live={"polite"} ref={el => (this.announceRef = el)}>
              {announceText}
            </div>
          </Paper>
        )}
      </DataStyles>
    );
  }
}

export default MUIDataTable;
