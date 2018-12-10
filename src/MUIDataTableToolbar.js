import React from "react";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
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
import MUIDataTablePopoverWrapper from "./MUIPopover/MUIDataTablePopoverWrapper";

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
  ...(props.options.responsive ? { ...responsiveToolbarStyles(theme) } : {}),
});

export const responsiveToolbarStyles = theme => ({
  [theme.breakpoints.down("sm")]: {
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
  [theme.breakpoints.down("xs")]: {
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
});

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

    if (navigator && navigator.msSaveOrOpenBlob) {
      navigator.msSaveOrOpenBlob(blob, options.downloadOptions.filename);
    } else {
      const dataURI = `data:text/csv;charset=utf-8,${csv}`;

      const URL = window.URL || window.webkitURL;
      const downloadURI = typeof URL.createObjectURL === "undefined" ? dataURI : URL.createObjectURL(blob);

      let link = document.createElement("a");
      link.setAttribute("href", downloadURI);
      link.setAttribute("download", options.downloadOptions.filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  setActiveIcon = iconName => {
    this.setState(() => ({
      iconActive: iconName,
      showSearch: iconName === "search" ? this.handleShowSearch() : false,
    }));
  };

  getActiveIcon = (styles, iconName) => {
    return this.state.iconActive !== iconName ? styles.icon : styles.iconActive;
  };

  handleShowSearch = () => {
    !!this.props.options.onSearchOpen && this.props.options.onSearchOpen();
    this.props.setTableAction("onSearchOpen");
    return true;
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
          {options.search && (
            <Tooltip title={search}>
              <IconButton
                aria-label={search}
                buttonRef={el => (this.searchButton = el)}
                classes={{ root: this.getActiveIcon(classes, "search") }}
                onClick={this.setActiveIcon.bind(null, "search")}>
                <SearchIcon />
              </IconButton>
            </Tooltip>
          )}

          {options.download && (
            <Tooltip title={downloadCsv}>
              <IconButton aria-label={downloadCsv} classes={{ root: classes.icon }} onClick={this.handleCSVDownload}>
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          )}

          {options.print && (
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
          )}

          {options.viewColumns && (
            <MUIDataTablePopoverWrapper
              label={viewColumns}
              tableRef={tableRef}
              onClick={this.setActiveIcon.bind(null, "viewcolumns")}
              buttonRoot={this.getActiveIcon(classes, "viewcolumns")}
              icon={<ViewColumnIcon />}
              classes={classes}>
              <MUIDataTableViewCol data={data} columns={columns} options={options} onColumnUpdate={toggleViewColumn} />
            </MUIDataTablePopoverWrapper>
          )}

          {options.filter && (
            <MUIDataTablePopoverWrapper
              label={filterTable}
              tableRef={tableRef}
              onClick={this.setActiveIcon.bind(null, "filter")}
              buttonRoot={this.getActiveIcon(classes, "filter")}
              icon={<FilterIcon />}
              classes={classes}>
              <MUIDataTableFilter
                columns={columns}
                options={options}
                filterList={filterList}
                filterData={filterData}
                onFilterUpdate={filterUpdate}
                onFilterReset={resetFilters}
              />
            </MUIDataTablePopoverWrapper>
          )}
          {options.customToolbar ? options.customToolbar() : false}
        </div>
      </Toolbar>
    );
  }
}

export default styled(MUIDataTableToolbar)(defaultToolbarStyles, { name: "MUIDataTableToolbar" });
