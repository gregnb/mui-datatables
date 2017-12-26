<div align="center">
  <img src="https://user-images.githubusercontent.com/19170080/34070522-e15d32e2-e235-11e7-8af5-fa704cdcad56.png" />
</div>

# MUI-Datatables - Datatables for Material-UI

[![Build Status](https://travis-ci.org/gregnb/mui-datatables.svg?branch=master)](https://travis-ci.org/gregnb/mui-datatables)
[![Coverage Status](https://coveralls.io/repos/github/gregnb/mui-datatables/badge.svg?branch=master)](https://coveralls.io/github/gregnb/mui-datatables?branch=master)
[![dependencies Status](https://david-dm.org/gregnb/mui-datatables/status.svg)](https://david-dm.org/gregnb/mui-datatables)
[![npm version](https://badge.fury.io/js/mui-datatables.svg)](https://badge.fury.io/js/mui-datatables)

MUI-Datatables is a data tables component built on [Material-UI V1](https://www.material-ui-next.com).  It comes with features like filtering, view/hide columns, search, export to CSV download, printing, pagination, and sorting. On top of the ability to customize styling on most views, there is a responsive data stacking mode for mobile/tablet devices.

<div align="center">
	<img src="https://user-images.githubusercontent.com/19170080/34346996-b59a8b3a-e9cb-11e7-80d5-591aef3dc1f4.gif" />
</div>

## Install

`npm install mui-datatables --save-dev `

## Demo

[![Edit react-to-print](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/edit-this)

## Usage


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
  filter: true,
  filterType: 'checkbox',
};

<MUIDataTable data={data} columns={columns} options={options} />

```

## API


#### &lt;MUIDataTable />

The component accepts the following props:

|Name|Type|Description
|:--:|:-----|:-----|
|**`columns`**|array|Columns used to describe table. Must be an array of simple strings
|**`data`**|array|Data used to describe table. Must be an array of simple strings
|**`options`**|object|Options used to describe table

#### Options:
|Name|Type|Description
|:--:|:-----|:-----|
|**`styles`**|object|Extend or override default styling
|**`filterType `**|string|Choice of filtering view. Options are "checkbox" or "dropdown" (default: checkbox)
|**`pagination`**|boolean|Enable/disable pagination
|**`responsive`**|boolean|Enable/disable responsive data stacking
|**`rowsPerPage`**|number|Number of rows allowed per page
|**`rowsPerPageOptions`**|array|Options to provide in pagination for number of rows a user can select
|**`rowHover`**|boolean|Enable/disable hover style over rows
|**`sort`**|boolean|Show/hide sort icon from toolbar
|**`filter`**|boolean|Show/hide filter icon from toolbar
|**`search`**|boolean|Show/hide search icon from toolbar
|**`print`**|boolean|Show/hide print	 icon from toolbar
|**`download`**|boolean|Show/hide download icon from toolbar


## Customize Styling

In the options object, you have the ability to customize styling to your liking with the 'styles' property.  Here are the following sections you can customize:

#### Table of Contents

- [Table](#styletable)
- [Toolbar](#styletoolbar)
- [FilterList](#stylefilterlist)
- [Pagination](#stylepagination)
  
  
An example of how we would target FilterList would look like:

```js

const options = {
  filter: true,
  filterType: 'checkbox',
  styles: {
    filterList: {
      root: {
        color: "#FF0000"
      },
      chip: {
        color: "#FEFEF0"
      },
    },
  }
};

<MUIDataTable data={data} columns={columns} options={options} />

```

#### Styling Table
--
<a name="styletable"></a>


```js

const options = {
  styles: {
    table: {          
      head: {
        row: {
        },            
        cell: {
          root: {
          },
          sortLabel: {
          },
        }
      },
      body: {
        row: {
        },
        cell: {
          root: {
          }
        }
      },
    },
  }
};

```

#### Styling Toolbar
--
<a name="styletoolbar"></a>

```js

const options = {
  styles: {
    toolbar: {
      root: {},
      spacer: {
      },
      actions: {
      },
      titleRoot: {
      },
      titleText: {
      },
      icon: {
      },
      iconActive: {
      },
      search: {
      },
      searchIcon: {
      },
      searchText: {
      },
      clearIcon: {
      },
    },
  }
};

```

#### Styling FilterList
--
<a name="stylefilterlist"></a>



```js

const options = {
  styles: {
    filterList: {
      root: {
      },
      chip: {
      },
    },
  }
};

```

#### Styling Pagination
--
<a name="stylepagination"></a>

```js

const options = {
  styles: {  
    pagination: {
    }
  }
};

```