<div align="center">
  <img src="https://user-images.githubusercontent.com/19170080/34070522-e15d32e2-e235-11e7-8af5-fa704cdcad56.png" />
</div>

# MUI-Datatables - Datatables for Material-UI

[![Build Status](https://travis-ci.org/gregnb/mui-datatables.svg?branch=master)](https://travis-ci.org/gregnb/mui-datatables)
[![NPM Downloads](https://img.shields.io/npm/dt/mui-datatables.svg?style=flat)](https://npmcharts.com/compare/mui-datatables?minimal=true)
[![Coverage Status](https://coveralls.io/repos/github/gregnb/mui-datatables/badge.svg?branch=master)](https://coveralls.io/github/gregnb/mui-datatables?branch=master)
[![dependencies Status](https://david-dm.org/gregnb/mui-datatables/status.svg)](https://david-dm.org/gregnb/mui-datatables)
[![npm version](https://badge.fury.io/js/mui-datatables.svg)](https://badge.fury.io/js/mui-datatables)

MUI-Datatables is a data tables component built on [Material-UI](https://www.material-ui.com).  It comes with features like filtering, resizable + view/hide columns, search, export to CSV download, printing, selectable rows, expandable rows, pagination, and sorting. On top of the ability to customize styling on most views, there are three responsive modes "stacked", "scrollMaxHeight", and "scrollFullHeight" for mobile/tablet devices.

<div align="center">
	<img src="https://user-images.githubusercontent.com/19170080/38026128-eac9d506-3258-11e8-92a7-b0d06e5faa82.gif" />
</div>

## Install

`npm install mui-datatables --save`

## Demo

[![Edit react-to-print](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/wy2rl1nyzl)

## Usage

For a simple table:

```js

import MUIDataTable from "mui-datatables";

const columns = ["Name", "Company", "City", "State"];

const data = [
 ["Joe James", "Test Corp", "Yonkers", "NY"],
 ["John Walsh", "Test Corp", "Hartford", "CT"],
 ["Bob Herm", "Test Corp", "Tampa", "FL"],
 ["James Houston", "Test Corp", "Dallas", "TX"],
];

const options = {
  filterType: 'checkbox',
};

<MUIDataTable
  title={"Employee List"}
  data={data}
  columns={columns}
  options={options}
/>

```

Or customize columns:

```js

import MUIDataTable from "mui-datatables";

const columns = [
 {
  name: "name",
  label: "Name",
  options: {
   filter: true,
   sort: true,
  }
 },
 {
  name: "company",
  label: "Company",
  options: {
   filter: true,
   sort: false,
  }
 },
 {
  name: "city",
  label: "City",
  options: {
   filter: true,
   sort: false,
  }
 },
 {
  name: "state",
  label: "State",
  options: {
   filter: true,
   sort: false,
  }
 },
];

const data = [
 { name: "Joe James", company: "Test Corp", city: "Yonkers", state: "NY" },
 { name: "John Walsh", company: "Test Corp", city: "Hartford", state: "CT" },
 { name: "Bob Herm", company: "Test Corp", city: "Tampa", state: "FL" },
 { name: "James Houston", company: "Test Corp", city: "Dallas", state: "TX" },
];

const options = {
  filterType: 'checkbox',
};

<MUIDataTable
  title={"Employee List"}
  data={data}
  columns={columns}
  options={options}
/>

```

## API


#### &lt;MUIDataTable />

The component accepts the following props:

|Name|Type|Description
|:--:|:-----|:-----|
|**`title`**|array|Title used to caption table
|**`columns`**|array|Columns used to describe table. Must be either an array of simple strings or objects describing a column
|**`data`**|array|Data used to describe table. Must be either an array containing objects of key/value pairs with values that are strings or numbers, or arrays of strings or numbers (Ex: data: [{"Name": "Joe", "Job Title": "Plumber", "Age": 30}, {"Name": "Jane", "Job Title": "Electrician", "Age": 45}] or data: [["Joe", "Plumber", 30], ["Jane", "Electrician", 45]]) **Use of arbitrary objects as data is not supported, and is deprecated. Consider using ids and mapping to external object data in custom renderers instead e.g. `const data = [{"Name": "Joe", "ObjectData": 123}] --> const dataToMapInCustomRender = { 123: { foo: 'bar', baz: 'qux', ... } }`**
|**`options`**|object|Options used to describe table

#### Options:
|Name|Type|Default|Description
|:--:|:-----|:--|:-----|
|**`page`**|number||User provided starting page for pagination
|**`count`**|number||User provided override for total number of rows
|**`serverSide`**|boolean|false|Enable remote data source
|**`serverSideFilterList`**|array|[]|Sets the filter list display when using serverSide: true
|**`rowsSelected`**|array||User provided selected rows
|**`rowsExpanded`**|array||User provided expanded rows
|**`filterType`**|string||Choice of filtering view. `enum('checkbox', 'dropdown', 'multiselect', 'textField', 'custom')`
|**`textLabels`**|object||User provided labels to localize text
|**`pagination`**|boolean|true|Enable/disable pagination
|**`selectableRows`**|string|'multiple'|Numbers of rows that can be selected. Options are "multiple", "single", "none". **(Boolean options have been deprecated.)**
|**`selectableRowsOnClick`**|boolean|false|Enable/disable select toggle when row is clicked. When False, only checkbox will trigger this action.
|**`disableToolbarSelect`**|boolean|false|Enable/disable the Select Toolbar that appears when a row is selected.
|**`isRowSelectable`**|function||Enable/disable selection on certain rows with custom function. Returns true if not provided. `function(dataIndex: number, selectedRows: object(lookup: {dataindex: boolean}, data: arrayOfObjects: {index, dataIndex})) => boolean`.
|**`isRowExpandable`**|function||Enable/disable expansion or collapse on certain expandable rows with custom function. Will be considered true if not provided. `function(dataIndex: number, expandedRows: object(lookup: {dataIndex: number}, data: arrayOfObjects: {index: number, dataIndex: number})) => boolean`.
|**`selectableRowsHeader`**|boolean|true|Show/hide the select all/deselect all checkbox header for selectable rows
|**`expandableRows`**|boolean|false|Enable/disable expandable rows
|**`expandableRowsOnClick`**|boolean|false|Enable/disable expand trigger when row is clicked. When False, only expand icon will trigger this action.
|**`renderExpandableRow`**|function||Render expandable row. `function(rowData, rowMeta) => React Component`
|**`resizableColumns`**|boolean|false|Enable/disable resizable columns
|**`customToolbar`**|function||Render a custom toolbar
|**`customToolbarSelect`**|function||Render a custom selected rows toolbar. `function(selectedRows, displayData, setSelectedRows) => void`
|**`customFooter`**|function||Render a custom table footer. `function(count, page, rowsPerPage, changeRowsPerPage, changePage, `[`textLabels: object`](https://github.com/gregnb/mui-datatables/blob/master/src/textLabels.js)`) => string`&#124;` React Component` [Example](https://github.com/gregnb/mui-datatables/blob/master/examples/customize-footer/index.js)
|**`customRowRender `**|function||Override default row rendering with custom function. `customRowRender(data, dataIndex, rowIndex) => React Component`
|**`customSort`**|function||Override default sorting with custom function. `function(data: array, colIndex: number, order: string) => array`
|**`customSearch `**|function||Override default search with custom function. `customSearch(searchQuery: string, currentRow: array, columns: array) => boolean`
|**`customSearchRender `**|function||Render a custom table search. `customSearchRender(searchText: string, handleSearch, hideSearch, options) => React Component`
|**`customFilterDialogFooter `**|function||Add a custom footer to the filter dialog. `customFilterDialogFooter(filterList: array) => React Component`
|**`elevation`**|number|4|Shadow depth applied to Paper component
|**`caseSensitive `**|boolean|false|Enable/disable case sensitivity for search
|**`responsive`**|string|'stacked'|Enable/disable responsive table views. Options: 'stacked', 'scrollMaxHeight' (limits height of table), 'scrollFullHeight' (table takes on as much height as needed to display all rows set in rowsPerPage), 'scrollFullHeightFullWidth' (same as 'scrollFullHeight' except that paper container wraps the table and the width takes the full browser window), 'stackedFullWidth' (same as stacked with the addition of the paper container changes with 'scrollFullHeightFullWidth') **('scroll' option has been deprecated in favor of `scrollMaxHeight`)**
|**`rowsPerPage`**|number|10|Number of rows allowed per page
|**`rowsPerPageOptions`**|array|[10,15,100]|Options to provide in pagination for number of rows a user can select
|**`rowHover`**|boolean|true|Enable/disable hover style over rows
|**`fixedHeader` DEPRECATED (use `fixedHeaderOptions`)**|boolean|true|Enable/disable fixed header columns
|**`fixedHeaderOptions`**|object|`{xAxis: true, yAxis: true}`|Enable/disable fixed header columns according to axis in any combination desired [Example](https://github.com/gregnb/mui-datatables/blob/master/examples/fixed-header/index.js)
|**`sortFilterList`**|boolean|true|Enable/disable alphanumeric sorting of filter lists
|**`sort`**|boolean|true|Enable/disable sort on all columns
|**`filter`**|boolean|true|Show/hide filter icon from toolbar
|**`search`**|boolean|true|Show/hide search icon from toolbar
|**`searchOpen`**|boolean|false|Initially displays search bar  
|**`searchText`**|string||Initial search text
|**`searchPlaceholder`**|string||Search text placeholder. [Example](https://github.com/gregnb/mui-datatables/blob/master/examples/customize-search/index.js)
|**`print`**|boolean|true|Show/hide print	 icon from toolbar
|**`download`**|boolean|true|Show/hide download icon from toolbar
|**`downloadOptions`**|object|`{filename: 'tableDownload.csv', separator: ','}`|Options to change the output of the CSV file: `filename`: string, `separator`: string, `filterOptions`: object(`useDisplayedColumnsOnly`: boolean, `useDisplayedRowsOnly`: boolean)
|**`onDownload`**|function||A callback function that triggers when the user downloads the CSV file. In the callback, you can control what is written to the CSV file. `function(buildHead: (columns) => string, buildBody: (data) => string, columns, data) => string`. Return `false` to cancel download of file.
|**`viewColumns`**|boolean|true|Show/hide viewColumns icon from toolbar
|**`onRowsSelect`**|function||Callback function that triggers when row(s) are selected. `function(currentRowsSelected: array, allRowsSelected: array) => void`
|**`onRowsExpand`**|function||Callback function that triggers when row(s) are expanded. `function(currentRowsExpanded: array, allRowsExpanded: array) => void`
|**`onRowsDelete`**|function||Callback function that triggers when row(s) are deleted. `function(rowsDeleted: object(lookup: {[dataIndex]: boolean}, data: arrayOfObjects: {index: number, dataIndex: number})) => void OR false` (Returning `false` prevents row deletion.)
|**`onRowClick`**|function||Callback function that triggers when a row is clicked. `function(rowData: string[], rowMeta: { dataIndex: number, rowIndex: number }) => void`
|**`onCellClick`**|function||Callback function that triggers when a cell is clicked. `function(colData: any, cellMeta: { colIndex: number, rowIndex: number, dataIndex: number }) => void`
|**`onChangePage`**|function||Callback function that triggers when a page has changed. `function(currentPage: number) => void`
|**`onChangeRowsPerPage`**|function||Callback function that triggers when the number of rows per page has changed. `function(numberOfRows: number) => void`
|**`onSearchChange`**|function||Callback function that triggers when the search text value has changed. `function(searchText: string) => void`
|**`onSearchOpen`**|function||Callback function that triggers when the searchbox opens. `function() => void`
|**`onFilterDialogOpen`**|function||Callback function that triggers when the filter dialog opens. `function() => void`
|**`onFilterDialogClose`**|function||Callback function that triggers when the filter dialog closes. `function() => void`
|**`onFilterChange`**|function||Callback function that triggers when filters have changed. `function(changedColumn: string, filterList: array, type: enum('checkbox', 'dropdown', 'multiselect', 'textField', 'custom', 'chip', 'reset')) => void`
|**`onSearchClose`**|function||Callback function that triggers when the searchbox closes. `function() => void`
|**`onColumnSortChange`**|function||Callback function that triggers when a column has been sorted. `function(changedColumn: string, direction: string) => void`
|**`onColumnViewChange`**|function||Callback function that triggers when a column view has been changed. `function(changedColumn: string, action: string) => void`
|**`onTableChange`**|function||Callback function that triggers when table state has changed. `function(action: string, tableState: object) => void`
|**`onTableInit`**|function||Callback function that triggers when table state has been initialized. `function(action: string, tableState: object) => void`
|**`setRowProps`**|function||Is called for each row and allows you to return custom props for this row based on its data. `function(row: array, dataIndex: number) => object` [Example](https://github.com/gregnb/mui-datatables/blob/master/examples/customize-styling/index.js)
|**`setTableProps`**|function||Is called for the table and allows you to return custom props for the table based on its data. `function() => object` [Example](https://github.com/gregnb/mui-datatables/blob/master/examples/customize-styling/index.js)

## Customize Columns

On each column object, you have the ability to customize columns to your liking with the 'options' property. Example:

```js
const columns = [
 {
  name: "Name",
  options: {
   filter: true,
   sort: false
  }
 },
 ...
];
```

#### Column:
|Name|Type|Description
|:--:|:-----|:-----|
|**`name`**|string|Name of column (This field is required)
|**`label`**|string|Column Header Name override
|**`options`**|object|Options for customizing column


#### Column Options:
|Name|Type|Default|Description
|:--:|:-----|:--|:-----|
|**`display`**|string|'true'|Display column in table. `enum('true', 'false', 'excluded')`
|**`empty`**|boolean|false|This denotes whether the column has data or not (for use with intentionally empty columns)
|**`viewColumns`**|boolean|true|Allow user to toggle column visibility through 'View Column' list
|**`filterList`**|array||Filter value list [Example](https://github.com/gregnb/mui-datatables/blob/master/examples/column-filters/index.js)
|**`filterOptions`**|{names, logic, display}||(These options affect the filter display and functionality from the filter dialog. To modify the filter chips that display after selecting filters, see `customFilterListOptions`) With filter options, it's possible to use custom names for the filter fields [Example](https://github.com/gregnb/mui-datatables/blob/master/examples/column-filters/index.js), custom filter logic [Example](https://github.com/gregnb/mui-datatables/blob/master/examples/customize-filter/index.js), and custom rendering [Example](https://github.com/gregnb/mui-datatables/blob/master/examples/customize-filter/index.js)
|**`customFilterListRender` DEPRECATED (use `customFilterListOptions`)**|function||Function that returns a string or array of strings used as the chip label(s). `function(value) => string OR arrayOfStrings` [Example](https://github.com/gregnb/mui-datatables/blob/master/examples/column-filters/index.js)
|**`customFilterListOptions`**|{render: function, update: function}|| (These options only affect the filter chips that display after filters are selected. To modify the filters themselves, see `filterOptions`) `render` returns a string or array of strings used as the chip label(s). `function(value) => string OR arrayOfStrings`, `update` returns a `filterList (see above)` allowing for custom filter updates when removing the filter chip [Example](https://github.com/gregnb/mui-datatables/blob/master/examples/column-filters/index.js)
|**`filter`**|boolean|true|Display column in filter list
|**`filterType `**|string|'dropdown'|Choice of filtering view. Takes priority over global filterType option.`enum('checkbox', 'dropdown', 'multiselect', 'textField', 'custom')` Use 'custom' if you are supplying your own rendering via `filterOptions`.
|**`sort`**|boolean|true|Enable/disable sorting on column
|**`searchable`**|boolean|true|Exclude/include column from search results
|**`sortDirection`**|string||Set default sort order `enum('asc', 'desc', 'none')` **(`null` option has been deprecated, use 'none' instead)**
|**`print`**|boolean|true|Display column when printing
|**`download`**|boolean|true|Display column in CSV download file
|**`hint`**|string||Display hint icon with string as tooltip on hover.
|**`customHeadRender`**|function||Function that returns a string or React component. Used as display for column header. `function(columnMeta, handleToggleColumn) => string`&#124;` React Component`
|**`customBodyRender`**|function||Function that returns a string or React component. Used as display data within all table cells of a given column. `function(value, tableMeta, updateValue) => string`&#124;` React Component` [Example](https://github.com/gregnb/mui-datatables/blob/master/examples/component/index.js)
|**`setCellProps`**|function||Is called for each cell and allows to you return custom props for this cell based on its data. `function(cellValue: string, rowIndex: number, columnIndex: number) => object` [Example](https://github.com/gregnb/mui-datatables/blob/master/examples/customize-styling/index.js)
|**`setCellHeaderProps`**|function||Is called for each header cell and allows you to return custom props for the header cell based on its data. `function(columnMeta: object) => object` [Example](https://github.com/gregnb/mui-datatables/blob/master/examples/customize-styling/index.js)

`customHeadRender` is called with these arguments:

```js
function(columnMeta: {
  customHeadRender: func,
  display: enum('true', 'false', 'excluded'),
  filter: boolean,
  sort: boolean,
  sortDirection: boolean,
  download: boolean,
  empty: boolean,
  index: number,
  label: string,
  name: string,
  print: boolean,
  searchable: boolean,
  viewColumns: boolean
}, handleToggleColumn: function(columnIndex))
```


`customBodyRender` is called with these arguments:

```js
function(value: any, tableMeta: {
  rowIndex: number,
  columnIndex: number,
  columnData: array, // Columns Options object
  rowData: array, // Full row data
  tableData: array, Full table data
  tableState: {
    announceText: null|string,
    page: number,
    rowsPerPage: number,
    filterList: array,
    selectedRows: {
      data: array,
      lookup: object,
    },
    showResponsive: boolean,
    searchText: null|string,
  },
}, updateValue: function)
```

## Customize Styling

Using Material-UI theme overrides will allow you to customize styling to your liking. First, determine which component you would want to target and then lookup the override classname. Let's start with a simple example where we will change the background color of a body cell to be red:

```js
import React from "react";
import MUIDataTable from "mui-datatables";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

class BodyCellExample extends React.Component {

  getMuiTheme = () => createMuiTheme({
    overrides: {
      MUIDataTableBodyCell: {
        root: {
          backgroundColor: "#FF0000"
        }
      }
    }
  })

  render() {

    return (
      <MuiThemeProvider theme={this.getMuiTheme()}>
        <MUIDataTable title={"ACME Employee list"} data={data} columns={columns} options={options} />
      </MuiThemeProvider>
    );

  }
}

```

## Remote Data

If you are looking to work with remote data sets or handle pagination, filtering, and sorting on a remote server you can do that with the following options:

```js
const options = {
  serverSide: true,
  onTableChange: (action, tableState) => {
    this.xhrRequest('my.api.com/tableData', result => {
      this.setState({ data: result });
    });
  }
};
```

To see an example **[Click Here](https://github.com/gregnb/mui-datatables/blob/master/examples/serverside-pagination/index.js)**

## Localization

This package decided that the cost of bringing in another library to perform localizations would be too expensive. Instead the ability to override all text labels (which aren't many) is offered through the options property `textLabels`.  The available strings:

```js
const options = {
  ...
  textLabels: {
    body: {
      noMatch: "Sorry, no matching records found",
      toolTip: "Sort",
      columnHeaderTooltip: column => `Sort for ${column.label}`
    },
    pagination: {
      next: "Next Page",
      previous: "Previous Page",
      rowsPerPage: "Rows per page:",
      displayRows: "of",
    },
    toolbar: {
      search: "Search",
      downloadCsv: "Download CSV",
      print: "Print",
      viewColumns: "View Columns",
      filterTable: "Filter Table",
    },
    filter: {
      all: "All",
      title: "FILTERS",
      reset: "RESET",
    },
    viewColumns: {
      title: "Show Columns",
      titleAria: "Show/Hide Table Columns",
    },
    selectedRows: {
      text: "row(s) selected",
      delete: "Delete",
      deleteAria: "Delete Selected Rows",
    },
  }
  ...
}
```

## Contributing
Thanks for taking an interest in the library and the github community!

The following commands should get you started:

```sh
npm i
npm run dev
```
open  http://localhost:5050/ in browser

After you make your changes locally, you can run the test suite with `npm test`.

## License
The files included in this repository are licensed under the MIT license.

## Thanks

[<img src="https://www.browserstack.com/images/mail/browserstack-logo-footer.png" width="120">](https://www.browserstack.com/)

Thank you to [BrowserStack](https://www.browserstack.com/) for providing the infrastructure that allows us to test in real browsers.
