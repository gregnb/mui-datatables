# mui-datatables 3.0.0 upgrade guide

All existing options from version 2 will still work in version 3, however, some options will give deprecation warnings in the console urging you to update to different options. This guide goes over what's new in version 3. 

## API Changes 

### responsive
The responsive option has been updated so that it no longer controls the table height. Instead, two new options have been created to help developers control the height of the table: **tableBodyHeight** and **tableBodyMaxHeight**. The value the responsive option takes in have been changed to the following:

* vertical: This mode replaces "stacked" mode. Long strings of text are now correctly handled and alignment appears correct.
* standard: This mode replaces "scrollMaxHeight" mode.
* simple: This mode mimics the design proposed in this issue: https://github.com/gregnb/mui-datatables/issues/1188

All existing inputs to the responsive field such as "scrollMaxHeight", "stacked", etc, will still work. 

### sortDirection deprecated in favor of sortOrder 
The sort direction of the table is now controlled by options.sortOrder ([example](https://github.com/gregnb/mui-datatables/blob/master/examples/serverside-pagination/index.js)). Using a sortDirection value on a column's options object will still work, but it will print a deprecation notice when run in development mode.

More information here: https://github.com/gregnb/mui-datatables/pull/1310

### fixedHeaderOptions is now fixedHeader and fixedSelectColumn
* fixedHeaderOptions.xAxis is now fixedSelectColumn
* fixedHeaderOptions.yAxis is now fixedHeader

The table will still accept the fixedHeaderOptions option, but it will print a deprecation notice when run in development mode.

### serverSideFilterList is deprecated in favor of the confirmFilters option
confirmFilters allows for a more DRY solution to handling filters for serverSide tables. It can also be used with tables that have large data sets. When this option is true, the customFilterDialogFooter callback will receive an applyFilters function which, when called, will apply the filters to the table. See the [serverside-filters example](https://github.com/gregnb/mui-datatables/blob/master/examples/serverside-filters/index.js) for a demonstration on how its used. 

### disableToolbarSelect deprecated in favor of selectToolbarPlacement
disableToolbarSelect will still work, but will give a deprecation warning. selectToolbarPlacement allows for more customization. disableToolbarSelect:true is equivalent to selectToolbarPlacement:"none".

### onColumnViewChange is now onViewColumnsChange
The callback option was changed to reflect the name of the option it corresponds to (viewColumns). The corresponding table action columnViewChange has been renamed to viewColumnsChange. The old onColumnViewChange option will still work but will give a deprecation warning.

### onRowsSelect is now onRowSelectionChange
The callback option was changed to better reflect what it does. It also takes in an additional 3rd parameter for updating the rowsSelection option if you need it. The corresponding table action changes from rowsSelect to rowSelectionChange. The old onRowsSelect option will still work but will give a deprecation warning.

### onRowsExpand is now onRowExpansionChange
The callback option was changed to better reflect what it does. It also now takes in a rowsExpanded parameter. The corresponding table action changes from expandRow to rowExpansionChange. The old onRowsExpand option will still work but will give a deprecation warning.

### onColumnSortChange
This callback will now receive values of "asc" or "desc" for the sortDirection value, rather than the full names spelled out. 

### Nested data is off by default
If you were previously putting dots in your column names (ex: "phone.cell") to indicate nested data, this is now off by default. Use the enableNestedDataAccess option to turn it back on (ex: enableNestedDataAccess: ".").

## New features

Side note: For a full list of changes, bug fixes, etc, please see the [v3 PR](https://github.com/gregnb/mui-datatables/pull/1300), as it lists all of the changes. Below are simply a list of new features in v3.

### Draggable Columns (v3.1.0)

Columns can now be dragged to new positions. [example](https://codesandbox.io/s/muidatatables-resize-columns-example-tnrkc?file=/index.js)

### Fixed Resizable Columns (v3.0.1)

Resizable columns has been overhauled and now works a lot better. 

### customBodyRenderLite

A much better performing version of customBodyRender that does not cause issues with custom filters. See [here](https://github.com/gregnb/mui-datatables/pull/1339) for a detailed write-up.

### components prop

The new [components prop](https://github.com/gregnb/mui-datatables/tree/v3#custom-components) allows developers to inject their own components into the table, allowing for more compartmentalized and reusable customization. For example, custom filter chips can be injected. Below you can see a short example on how to inject a custom tooltip component.

```
const CustomTooltip = (props) => {
  return (
    <Tooltip 
      title={props.title} 
      interactive={true} 
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 500 }}
      leaveDelay={500}>{props.children}</Tooltip>
  );
};

return (
  <MUIDataTable
    columns={columns}
    data={data}
    components={{
      Tooltip: CustomTooltip,
    }}
  />
);
```

A full example is available [here](https://github.com/gregnb/mui-datatables/examples/custom-components/index.js).

### searchProps

Props that get applied to the search textbox for the table. Useful for adding custom events (ex: onBlur, onChange, etc etc).

### confirmFilters

An option that allows developers to delay adding filters to the table until they are "confirmed". Confirmation happens via a callback function to the customFilterDialogFooter options. This feature is useful for server-side tables and tables with large data sets. [Example](https://github.com/gregnb/mui-datatables/blob/master/examples/serverside-filters/index.js)

### customTableBodyFooterRender

Allows developers to render a footer under the table body but above the table footer (which contains the pagination). This is useful for developers who want to setup footers for individual columns. [Example](https://github.com/gregnb/mui-datatables/blob/master/examples/customize-footer/index.js)

### expandableRowsHeader

Adds an option to the table's header that allows all expandable rows to be opened or collapsed. [Example](https://github.com/gregnb/mui-datatables/blob/master/examples/expandable-rows/index.js)

### enableNestedDataAccess

If provided a non-empty string (ex: "."), it will use that value in the column's names to access nested data. For example, given a enableNestedDataAccess value of "." and a column name of "phone.cell", the column would use the value found in `phone:{cell:"555-5555"}`. Any amount of nesting will work. [Example](https://github.com/gregnb/mui-datatables/blob/master/examples/data-as-objects/index.js)

### filterOptions.renderValue

Adds option to control display of items in filter controls for checkbox, multiselect and select filter types. [Example](https://github.com/gregnb/mui-datatables/blob/master/examples/customize-filter/index.js)

### selectToolbarPlacement

Allows the following placement options for the select toolbar:

* none: No select toolbar when a row is selected (same as what disableToolbarSelect does)
* replace (default): Replaces the normal toolbar when a row is selected.
* above: Renders the select toolbar above the normal toolbar when an item is selected.

### selectableRowsHideCheckboxes

Boolean option that allows checkboxes for selectable rows to be hidden.

### tableBodyHeight and tableBodyMaxHeight

Options that allows developers to control the height of the table. Both take in a css string (ex: '500px', 'auto', '100%', etc). If both are set, tableBodyHeight will take precedence.

### sortOrder

An option that allows developers to control the sortDirection of the table (previously this was done through a sortDirection option in the columns object). This option may eventually allow for secondary sorts. 

### More...

There will be more coming soon, you can follow the [release page](https://github.com/gregnb/mui-datatables/releases) to keep up. Contributions are weclome! If you're interested in contributing please see the [Contributing section](https://github.com/gregnb/mui-datatables#contributing).
