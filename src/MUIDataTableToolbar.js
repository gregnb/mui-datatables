import React from "react";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import { MUIPopover, MUIPopoverTarget, MUIPopoverContent } from "./MUIPopover";
import MUIDataTableFilter from "./MUIDataTableFilter";
import MUIDataTableViewCol from "./MUIDataTableViewCol";
import MUIDataTableSearch from "./MUIDataTableSearch";
import SearchIcon from "@material-ui/icons/Search";
import DownloadIcon from "@material-ui/icons/CloudDownload";
import PrintIcon from "@material-ui/icons/Print";
import ViewColumnIcon from "@material-ui/icons/ViewColumn";
import FilterIcon from "@material-ui/icons/FilterList";
import ReactToPrint from "react-to-print";
import styled from "./styled";

export const defaultToolbarStyles = (theme, props) => ({
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
  ...(props.options.responsive ? { ...responsiveToolbarStyles } : {}),
});

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

  handleCSVDownload = () => {
    const { data, columns, options } = this.props;

    const CSVHead =
      columns
        .reduce(
          (soFar, column) =>
            column.download ? soFar + '"' + column.name + '"' + options.downloadOptions.separator : soFar,
          "",
        )
        .slice(0, -1) + "\r\n";

    const CSVBody = data
      .reduce(
        (soFar, row) =>
          soFar +
          '"' +
          row.data
            .filter((field, index) => columns[index].download)
            .join('"' + options.downloadOptions.separator + '"') +
          '"\r\n',
        [],
      )
      .trim();

    /* taken from react-csv */
    const csv = `${CSVHead}${CSVBody}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const dataURI = `data:text/csv;charset=utf-8,${csv}`;

    const URL = window.URL || window.webkitURL;
    const downloadURI = typeof URL.createObjectURL === "undefined" ? dataURI : URL.createObjectURL(blob);

    let link = document.createElement("a");
    link.setAttribute("href", downloadURI);
    link.setAttribute("download", options.downloadOptions.filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    const { onSearchClose } = this.props.options;

    if (onSearchClose) onSearchClose();
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
      classes,
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

    const { search, downloadCsv, print, viewColumns, filterTable } = options.textLabels.toolbar;
    const { showSearch } = this.state;

    return (
      <Toolbar className={classes.root} role={"toolbar"} aria-label={"Table Toolbar"}>
        <div className={classes.left}>
          {showSearch === true ? (
            <MUIDataTableSearch onSearch={searchTextUpdate} onHide={this.hideSearch} options={options} />
          ) : (
            <div className={classes.titleRoot} aria-hidden={"true"}>
              <Typography variant="h6" className={classes.titleText}>
                {title}
              </Typography>
            </div>
          )}
        </div>
        <div className={classes.actions}>
          {options.search ? (
            <Tooltip title={search}>
              <IconButton
                aria-label={search}
                buttonRef={el => (this.searchButton = el)}
                classes={{ root: this.getActiveIcon(classes, "search") }}
                onClick={this.setActiveIcon.bind(null, "search")}>
                <SearchIcon />
              </IconButton>
            </Tooltip>
          ) : (
            false
          )}
          {options.download ? (
            <Tooltip title={downloadCsv}>
              <IconButton aria-label={downloadCsv} classes={{ root: classes.icon }} onClick={this.handleCSVDownload}>
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          ) : (
            false
          )}
          {options.print ? (
            <Tooltip title={print}>
              <span>
                <ReactToPrint
                  trigger={() => (
                    <IconButton aria-label={print} classes={{ root: classes.icon }}>
                      <PrintIcon />
                    </IconButton>
                  )}
                  content={() => this.props.tableRef()}
                />
              </span>
            </Tooltip>
          ) : (
            false
          )}
          {options.viewColumns ? (
            <MUIPopover refExit={this.setActiveIcon.bind(null)} container={tableRef}>
              <MUIPopoverTarget>
                <IconButton
                  aria-label={viewColumns}
                  classes={{ root: this.getActiveIcon(classes, "viewcolumns") }}
                  onClick={this.setActiveIcon.bind(null, "viewcolumns")}>
                  <Tooltip title={viewColumns}>
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
                  aria-label={filterTable}
                  classes={{ root: this.getActiveIcon(classes, "filter") }}
                  onClick={this.setActiveIcon.bind(null, "filter")}>
                  <Tooltip title={filterTable}>
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
          {options.customToolbar ? options.customToolbar() : false}
        </div>
      </Toolbar>
    );
  }
}

export default styled(MUIDataTableToolbar)(defaultToolbarStyles, { name: "MUIDataTableToolbar" });
