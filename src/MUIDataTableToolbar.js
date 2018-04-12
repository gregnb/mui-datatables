import React from "react";
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
import ReactToPrint from "react-to-print";
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
                  <Typography variant="title" className={toolbarStyles.titleText}>
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
                <ReactToPrint
                  trigger={() => (
                    <Tooltip title="Print">
                      <IconButton aria-label="Print" classes={{ root: toolbarStyles.icon }}>
                        <PrintIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  content={() => this.props.tableRef()}
                />
              ) : (
                false
              )}
              {options.viewColumns ? (
                <MUIPopover refExit={this.setActiveIcon.bind(null)} container={tableRef}>
                  <MUIPopoverTarget>
                    <IconButton
                      aria-label="View Columns"
                      classes={{ root: this.getActiveIcon(toolbarStyles, "viewcolumns") }}
                      onClick={this.setActiveIcon.bind(null, "viewcolumns")}>
                      <Tooltip title="View Columns">
                        <ViewColumnIcon />
                      </Tooltip>
                    </IconButton>
                  </MUIPopoverTarget>
                  <MUIPopoverContent>
                    <MUIDataTableViewCol
                      data={data}
                      columns={columns}
                      options={options}
                      onColumnUpdate={toggleViewColumn}
                    />
                  </MUIPopoverContent>
                </MUIPopover>
              ) : (
                false
              )}
              {options.filter ? (
                <MUIPopover refExit={this.setActiveIcon.bind(null)} container={tableRef}>
                  <MUIPopoverTarget>
                    <IconButton
                      aria-label="Filter Table"
                      classes={{ root: this.getActiveIcon(toolbarStyles, "filter") }}
                      onClick={this.setActiveIcon.bind(null, "filter")}>
                      <Tooltip title="Filter Table">
                        <FilterIcon />
                      </Tooltip>
                    </IconButton>
                  </MUIPopoverTarget>
                  <MUIPopoverContent>
                    <MUIDataTableFilter
                      columns={columns}
                      options={options}
                      filterList={filterList}
                      filterData={filterData}
                      onFilterUpdate={filterUpdate}
                      onFilterReset={resetFilters}
                    />
                  </MUIPopoverContent>
                </MUIPopover>
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
