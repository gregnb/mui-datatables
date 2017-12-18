import React from "react";
import PropTypes from "prop-types";
import { findDOMNode } from "react-dom";
import Slide from "material-ui/transitions/Slide";
import Grow from "material-ui/transitions/Grow";
import Fade from "material-ui/transitions/Fade";
import TextField from "material-ui/TextField";
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
import ClearIcon from "material-ui-icons/Clear";
import FilterIcon from "material-ui-icons/FilterList";
import { getStyle, withDataStyles } from "./withDataStyles";

const styles = theme => ({
  root: {},
  spacer: {
    flex: "1 1 100%",
  },
  actions: {
    display: "inline-flex",
  },
  titleRoot: {
    flex: "0 0 auto",
  },
  titleText: {},
  icon: {
    "&:hover": {
      color: "#307BB0",
    },
  },
  iconActive: {
    color: "#307BB0",
  },
  search: {
    display: "inline-flex",
    flex: "1 0 auto",
  },
  searchIcon: {
    display: "inline-flex",
    marginTop: "10px",
    marginRight: "8px",
  },
  searchText: {
    display: "inline-flex",
    flex: "0.5 0",
  },
  clearIcon: {
    display: "inline-flex",
  },
});

class MUIDataTableToolbar extends React.Component {
  state = {
    iconActive: null,
    showSearch: false,
  };

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

  getActiveIcon = iconName => {
    const { classes } = this.props;
    return this.state.iconActive !== iconName ? classes.icon : classes.iconActive;
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
      classes,
      options,
      columns,
      filterData,
      filterList,
      filterUpdate,
      resetFilters,
      searchTextUpdate,
      toggleViewColumn,
    } = this.props;

    const { showSearch } = this.state;

    return (
      <Toolbar className={classes.root}>
        {showSearch === true ? (
          <MUIDataTableSearch onSearch={searchTextUpdate} onHide={this.hideSearch} />
        ) : (
          <div className={classes.titleRoot}>
            <Typography type="title" className={classes.titleText}>
              Title goes here and it should be really really long
            </Typography>
          </div>
        )}
        {showSearch === false ? <div className={classes.spacer} /> : false}
        <div className={classes.actions}>
          <Tooltip title="Search">
            <IconButton
              aria-label="Search"
              buttonRef={el => (this.searchButton = el)}
              classes={{ root: classes.icon }}
              classes={{ root: this.getActiveIcon("search") }}
              onClick={this.setActiveIcon.bind(null, "search")}>
              <SearchIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Download CSV">
            <IconButton aria-label="Download CSV" classes={{ root: classes.icon }} onClick={this.handleCSVDownload}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Print">
            <IconButton aria-label="Print" classes={{ root: classes.icon }} onClick={this.handlePrint}>
              <PrintIcon />
            </IconButton>
          </Tooltip>
          <MUIPopover placement={"bottom-center"} refExit={this.setActiveIcon.bind(null)} arrow={false}>
            <MUIPopoverTarget>
              <Tooltip title="View Columns">
                <IconButton
                  aria-label="View Columns"
                  classes={{ root: this.getActiveIcon("viewcolumns") }}
                  onClick={this.setActiveIcon.bind(null, "viewcolumns")}>
                  <ViewColumnIcon />
                </IconButton>
              </Tooltip>
            </MUIPopoverTarget>
            <MUIPopoverContent>
              <MUIDataTableViewCol data={data} columns={columns} onColumnUpdate={toggleViewColumn} />
            </MUIPopoverContent>
          </MUIPopover>
          <MUIPopover placement={"bottom-center"} refExit={this.setActiveIcon.bind(null)} arrow={false}>
            <MUIPopoverTarget>
              <Tooltip title="Filter Table">
                <IconButton
                  aria-label="Filter Table"
                  classes={{ root: this.getActiveIcon("filter") }}
                  onClick={this.setActiveIcon.bind(null, "filter")}>
                  <FilterIcon />
                </IconButton>
              </Tooltip>
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
        </div>
      </Toolbar>
    );
  }
}

export default withDataStyles(styles)(MUIDataTableToolbar);
