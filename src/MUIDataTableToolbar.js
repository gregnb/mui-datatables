import React from "react";
import { findDOMNode } from "react-dom";
import Typography from "material-ui/Typography";
import Toolbar from "material-ui/Toolbar";
import Tooltip from "material-ui/Tooltip";
import IconButton from "material-ui/IconButton";
import { MUIPopover, MUIPopoverTarget, MUIPopoverContent } from "./MUIPopover";
import MUIDataTableFilter from "./MUIDataTableFilter";
import MUIDataTableViewCol from "./MUIDataTableViewCol";
import MUIDataTableSearch from "./MUIDataTableSearch";
import SearchIcon from "material-ui-icons/Search";
import DownloadIcon from "material-ui-icons/FileDownload";
import PrintIcon from "material-ui-icons/Print";
import ViewColumnIcon from "material-ui-icons/ViewColumn";
import FilterIcon from "material-ui-icons/FilterList";
import merge from "lodash.merge";
import { getStyle, DataStyles } from "./DataStyles";

export const defaultToolbarStyles = {
  root: {},
  left: {
    flex: "1 1 55%",
  },
  actions: {
    flex: "0 0 45%",
    textAlign: "right",
  },
  titleRoot: {},
  titleText: {},
  icon: {
    "&:hover": {
      color: "#307BB0",
    },
  },
  iconActive: {
    color: "#307BB0",
  },
  searchIcon: {
    display: "inline-flex",
    marginTop: "10px",
    marginRight: "8px",
  },
};

export const responsiveToolbarStyles = {
  "@media screen and (max-width: 960px)": {
    titleRoot: {},
    titleText: {
      fontSize: "16px",
    },
    spacer: {
      display: "none",
    },
    left: {
      // flex: "1 1 40%",
      padding: "8px 0px",
    },
    actions: {
      // flex: "1 1 60%",
      textAlign: "right",
    },
  },
  "@media screen and (max-width: 600px)": {
    root: {
      display: "block",
    },
    left: {
      padding: "8px 0px 0px 0px",
    },
    titleText: {
      textAlign: "center",
    },
    actions: {
      textAlign: "center",
    },
  },
  "@media screen and (max-width: 480px)": {},
};

export const defaultViewColStyles = {
  root: {
    padding: "16px 24px 16px 24px",
    fontFamily: "Roboto",
  },
  title: {
    marginLeft: "-7px",
    fontSize: "14px",
    color: "#424242",
    textAlign: "left",
    fontWeight: 500,
  },
  formGroup: {
    marginTop: "8px",
  },
  formControl: {},
  checkbox: {
    color: "#027cb5",
    width: "32px",
    height: "32px",
  },
  label: {
    fontSize: "15px",
    marginLeft: "8px",
    color: "#4a4a4a",
  },
};

export const defaultFilterStyles = {
  root: {
    padding: "16px 24px 16px 24px",
    fontFamily: "Roboto",
  },
  header: {
    flex: "0 0 auto",
    marginBottom: "16px",
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
  },
  title: {
    display: "inline-block",
    marginLeft: "7px",
    color: "#424242",
    fontSize: "14px",
    fontWeight: 500,
  },
  noMargin: {
    marginLeft: "0px",
  },
  reset: {
    alignSelf: "left",
  },
  resetLink: {
    color: "#027cb5",
    display: "inline-block",
    marginLeft: "24px",
    fontSize: "12px",
    cursor: "pointer",
    border: "none",
    "&:hover": {
      color: "#FF0000",
    },
  },
  filtersSelected: {
    alignSelf: "right",
  },
  /* checkbox */
  checkboxList: {
    flex: "1 1 100%",
    display: "inline-flex",
    marginRight: "24px",
  },
  checkboxListTitle: {
    marginLeft: "7px",
    marginBottom: "8px",
    fontSize: "14px",
    color: "#424242",
    textAlign: "left",
    fontWeight: 500,
  },
  checkboxFormGroup: {
    marginTop: "8px",
  },
  checkboxFormControl: {
    margin: "0px",
  },
  checkboxFormControlLabel: {
    fontSize: "15px",
    marginLeft: "8px",
    color: "#4a4a4a",
  },
  checkboxIcon: {
    //color: "#027cb5",
    width: "32px",
    height: "32px",
  },
  checked: {
    color: "#027CB5",
  },
  /* selects */
  selectRoot: {
    display: "flex",
    marginTop: "16px",
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    height: "80%",
    justifyContent: "space-between",
  },
  selectFormControl: {
    flex: "1 1 calc(50% - 24px)",
    marginRight: "24px",
    marginBottom: "24px",
  },
};

class MUIDataTableToolbar extends React.Component {
  state = {
    iconActive: null,
    showSearch: false,
  };

  constructor(props) {
    super(props);

    if (props.options.responsive && props.options.responsive === "stacked") {
      this.tbarStyles = merge(defaultToolbarStyles, responsiveToolbarStyles);
    } else {
      this.tbarStyles = defaultToolbarStyles;
    }
  }

  handlePrint = () => {
    const tableEl = this.props.tableRef();
    const tableHTML = findDOMNode(tableEl).outerHTML;

    let printWindow = window.open("", "Print", "status=no, toolbar=no, scrollbars=yes", "false");

    const headEls = document.head.querySelectorAll("link, style");
    headEls.forEach(node => printWindow.document.head.appendChild(node.cloneNode(true)));

    printWindow.document.body.innerHTML = tableHTML;

    printWindow.print();
    printWindow.close();
  };

  handleCSVDownload = () => {
    const { data, columns } = this.props;

    const CSVHead = columns.reduce((soFar, column) => soFar + '"' + column.name + '",', "").slice(0, -1) + "\r\n";
    const CSVBody = data.reduce((soFar, row) => soFar + '"' + row.join('","') + '"\r\n', []).trim();

    let CSVLink = document.createElement("a");
    CSVLink.href = "data:text/csv;charset=utf-8;base64," + window.btoa(CSVHead + CSVBody);
    CSVLink.target = "_blank";
    CSVLink.download = "myFile.csv";

    document.body.appendChild(CSVLink);
    CSVLink.click();

    CSVLink.parentNode.removeChild(CSVLink);
  };

  setActiveIcon = iconName => {
    this.setState(() => ({
      iconActive: iconName,
      showSearch: iconName === "search" ? true : false,
    }));
  };

  getActiveIcon = (styles, iconName) => {
    return this.state.iconActive !== iconName ? styles.icon : styles.iconActive;
  };

  hideSearch = () => {
    this.props.searchTextUpdate(null);

    this.setState(() => ({
      iconActive: null,
      showSearch: false,
    }));

    this.searchButton.focus();
  };

  render() {
    const {
      data,
      options,
      columns,
      filterData,
      filterList,
      filterUpdate,
      resetFilters,
      searchTextUpdate,
      toggleViewColumn,
      title,
      tableRef,
    } = this.props;

    const { showSearch } = this.state;

    return (
      <DataStyles
        defaultStyles={this.tbarStyles}
        name="MUIDataTableToolbar"
        styles={getStyle(options, "table.toolbar")}>
        {toolbarStyles => (
          <Toolbar className={toolbarStyles.root} role={"toolbar"} aria-label={"Table Toolbar"}>
            <div className={toolbarStyles.left}>
              {showSearch === true ? (
                <MUIDataTableSearch onSearch={searchTextUpdate} onHide={this.hideSearch} options={options} />
              ) : (
                <div className={toolbarStyles.titleRoot} aria-hidden={"true"}>
                  <Typography type="title" className={toolbarStyles.titleText}>
                    {title}
                  </Typography>
                </div>
              )}
            </div>
            <div className={toolbarStyles.actions}>
              {options.search ? (
                <Tooltip title="Search">
                  <IconButton
                    aria-label="Search"
                    buttonRef={el => (this.searchButton = el)}
                    classes={{ root: this.getActiveIcon(toolbarStyles, "search") }}
                    onClick={this.setActiveIcon.bind(null, "search")}>
                    <SearchIcon />
                  </IconButton>
                </Tooltip>
              ) : (
                false
              )}
              {options.download ? (
                <Tooltip title="Download CSV">
                  <IconButton
                    aria-label="Download CSV"
                    classes={{ root: toolbarStyles.icon }}
                    onClick={this.handleCSVDownload}>
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
              ) : (
                false
              )}
              {options.print ? (
                <Tooltip title="Print">
                  <IconButton aria-label="Print" classes={{ root: toolbarStyles.icon }} onClick={this.handlePrint}>
                    <PrintIcon />
                  </IconButton>
                </Tooltip>
              ) : (
                false
              )}
              {options.viewColumns ? (
                <DataStyles
                  defaultStyles={defaultViewColStyles}
                  name="MUIDataTableViewCol"
                  styles={getStyle(options, "viewColumns")}>
                  {viewColStyles => (
                    <MUIPopover refExit={this.setActiveIcon.bind(null)} container={tableRef}>
                      <MUIPopoverTarget>
                        <Tooltip title="View Columns">
                          <IconButton
                            aria-label="View Columns"
                            classes={{ root: this.getActiveIcon(toolbarStyles, "viewcolumns") }}
                            onClick={this.setActiveIcon.bind(null, "viewcolumns")}>
                            <ViewColumnIcon />
                          </IconButton>
                        </Tooltip>
                      </MUIPopoverTarget>
                      <MUIPopoverContent>
                        <MUIDataTableViewCol
                          data={data}
                          viewColStyles={viewColStyles}
                          columns={columns}
                          options={options}
                          onColumnUpdate={toggleViewColumn}
                        />
                      </MUIPopoverContent>
                    </MUIPopover>
                  )}
                </DataStyles>
              ) : (
                false
              )}
              {options.filter ? (
                <DataStyles
                  defaultStyles={defaultFilterStyles}
                  name="MUIDataTableFilter"
                  styles={getStyle(options, "filterView")}>
                  {filterStyles => (
                    <MUIPopover refExit={this.setActiveIcon.bind(null)} container={tableRef}>
                      <MUIPopoverTarget>
                        <Tooltip title="Filter Table">
                          <IconButton
                            aria-label="Filter Table"
                            classes={{ root: this.getActiveIcon(toolbarStyles, "filter") }}
                            onClick={this.setActiveIcon.bind(null, "filter")}>
                            <FilterIcon />
                          </IconButton>
                        </Tooltip>
                      </MUIPopoverTarget>
                      <MUIPopoverContent>
                        <MUIDataTableFilter
                          columns={columns}
                          options={options}
                          filterStyles={filterStyles}
                          filterList={filterList}
                          filterData={filterData}
                          onFilterUpdate={filterUpdate}
                          onFilterReset={resetFilters}
                        />
                      </MUIPopoverContent>
                    </MUIPopover>
                  )}
                </DataStyles>
              ) : (
                false
              )}
            </div>
          </Toolbar>
        )}
      </DataStyles>
    );
  }
}

export default MUIDataTableToolbar;
