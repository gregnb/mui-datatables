import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Paper from "material-ui/Paper";
import Table from "material-ui/Table";
import MUIDataTableToolbar from "./MUIDataTableToolbar";
import MUIDataTableFilterList from "./MUIDataTableFilterList";
import MUIDataTableBody from "./MUIDataTableBody";
import MUIDataTableHead from "./MUIDataTableHead";
import MUIDataTablePagination from "./MUIDataTablePagination";
import { getStyle, withDataStyles } from "./withDataStyles";

const styles = theme => ({
  table: {
    fontFamily: "Roboto",
  },
});

class MUIDataTable extends React.Component {
  static propTypes = {
    /** Data used to describe table */
    data: PropTypes.array.isRequired,
    /** Columns used to describe table */
    columns: PropTypes.array.isRequired,
    /** Options used to describe table */
    options: PropTypes.shape({
      sort: PropTypes.bool,
      filter: PropTypes.bool,
      filterType: PropTypes.oneOf(["dropdown", "checkbox"]),
      pagination: PropTypes.bool,
      rowHover: PropTypes.bool,
      rowsPerPage: PropTypes.number,
      rowsPerPageOptions: PropTypes.array,
      search: PropTypes.bool,
      print: PropTypes.bool,
      responsive: PropTypes.bool,
    }),
    /** Pass and use className to style MUIDataTable as desired */
    className: PropTypes.string,
    /** Extend the style applied to components */
    classes: PropTypes.object,
  };

  state = {
    open: false,
    data: [],
    displayData: [],
    page: 0,
    rowsPerPage: 0,
    columns: [],
    filterData: [],
    filterList: [],
    searchText: null,
  };

  constructor() {
    super();
    this.tableRef = false;
  }

  componentWillMount() {
    this.setTableOptions(this.props);
    this.setTableData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data || this.props.columns !== nextProps.columns) {
      this.setTableOptions(nextProps);
      this.setTableData(nextProps);
    }
  }

  getDefaultOptions() {
    const defaultOptions = {
      rowHover: true,
      sort: true,
      filter: true,
      filterType: "checkbox",
      pagination: true,
      rowHover: true,
      rowsPerPage: 10,
      rowsPerPageOptions: [10, 15, 100],
      search: true,
      print: true,
      responsive: false,
    };

    return { ...defaultOptions, ...this.props.options };
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
    const { options, data, columns } = props;

    let columnData = [],
      filterData = [],
      filterList = [];

    for (let colIndex = 0; colIndex < columns.length; colIndex++) {
      columnData.push({
        name: columns[colIndex],
        display: true,
        sort: "desc",
      });

      filterData[colIndex] = [];
      filterList[colIndex] = [];

      for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
        const value = data[rowIndex][colIndex];

        if (filterData[colIndex].indexOf(value) < 0) filterData[colIndex].push(value);
      }
    }

    /* set source data and display Data set source set */
    this.setState(prevState => ({
      columns: columnData,
      filterData: filterData,
      filterList: filterList,
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
      const column = row[index];

      if (filterList[index].length && filterList[index].indexOf(column) < 0) {
        isFiltered = true;
        break;
      }

      if (searchText && column.indexOf(searchText) >= 0) {
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
      const columns = [...prevState.columns];
      const displayData = prevState.displayData;
      const order = prevState.columns[index].sort;
      columns[index].sort = columns[index].sort === "desc" ? "asc" : "desc";

      return {
        columns: columns,
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

      const dataOne = colOne.data.toLowerCase();
      const dataTwo = colTwo.data.toLowerCase();

      if (dataOne > dataTwo) {
        comparison = 1;
      } else if (dataOne < dataTwo) {
        comparison = -1;
      }

      return order === "desc" ? comparison * -1 : comparison;
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

  render() {
    const { className, classes } = this.props;

    const { data, displayData, columns, page, filterData, filterList, searchText } = this.state;

    const options = this.getDefaultOptions();
    const rowsPerPage = this.state.rowsPerPage ? this.state.rowsPerPage : options.rowsPerPage;

    return (
      <Paper elevation={4} ref={el => (this.tableContent = el)} className={className ? className : null}>
        <MUIDataTableToolbar
          data={data}
          columns={columns}
          classes={getStyle(options, "toolbar")}
          options={options}
          tableRef={() => this.tableRef}
          filterUpdate={this.filterUpdate}
          resetFilters={this.resetFilters}
          filterData={filterData}
          filterList={filterList}
          searchTextUpdate={this.searchTextUpdate}
          toggleViewColumn={this.toggleViewColumn}
        />
        <MUIDataTableFilterList
          classes={getStyle(options, "filterList")}
          filterList={filterList}
          filterUpdate={this.filterUpdate}
        />
        <Table ref={el => (this.tableRef = el)} className={classes.table}>
          <MUIDataTableHead
            columns={columns}
            classes={getStyle(options, "table.head")}
            toggleSort={this.toggleSortColumn}
            options={options}
          />
          <MUIDataTableBody
            data={this.state.displayData}
            columns={columns}
            classes={getStyle(options, "table.body")}
            page={page}
            rowsPerPage={rowsPerPage}
            options={options}
            searchText={searchText}
            filterList={filterList}
          />
          {options.pagination ? (
            <MUIDataTablePagination
              count={displayData.length}
              classes={getStyle(options, "pagination")}
              page={page}
              rowsPerPage={rowsPerPage}
              changeRowsPerPage={this.changeRowsPerPage}
              changePage={this.changePage}
              options={options}
            />
          ) : (
            false
          )}
        </Table>
      </Paper>
    );
  }
}

export default withDataStyles(styles)(MUIDataTable);
