import React from "react";
import ExcelJS from "exceljs/dist/es5/exceljs.browser";
import FileSaver from "file-saver";
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

    if (props.options.responsive) {
      this.tbarStyles = merge(defaultToolbarStyles, responsiveToolbarStyles);
    } else {
      this.tbarStyles = defaultToolbarStyles;
    }
  }

  handleCSVDownload = () => {
    const { data, columns, options } = this.props;

    var workbook = new ExcelJS.Workbook();
    var ws = workbook.addWorksheet("Data");
    const cols = [];
    const toDownload = columns.map(r => {
      const exelCol = { header: r.name, width: Math.max(10, r.name.length + 2) };
      const export_ = r.downloadFormatter !== null && (!r.noExportOnNoDisplay || r.display);
      if (export_) {
        cols.push(exelCol);
      }
      return {
        formatter: r.downloadFormatter,
        export_: export_,
        name: r.name,
        exelCol: exelCol,
      };
    });

    const rows = [];
    // Sanitize data that is impossible to serialize
    data.forEach(r => {
      const row = [];
      r.data.forEach((c, i) => {
        const cData = toDownload[i];
        if (!cData.export_) {
          return;
        }

        let formatter =
          cData.formatter ||
          function(d) {
            if (typeof d === "object") {
              return "";
            }
            return d || "";
          };
        const formatted = formatter(c);
        cData.exelCol.width = Math.max(cData.exelCol.width, formatted.toString().length + 2);
        row.push(formatted);
      });
      rows.push(row);
    });

    ws.columns = cols;
    rows.forEach(r => ws.addRow(r));
    ws.eachRow(r =>
      r.eachCell(cell => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      }),
    );
    // Apply styles to the header row
    ws.getRow(1).eachCell(cell => {
      cell.fill = {
        type: "pattern",
        pattern: "lightGrid",
        fgColor: { argb: "d3d3d3" },
        bgColor: { argb: "ffffff" },
      };
      cell.font = {
        bold: true,
      };
    });

    // A chance to modify the download content before submitting it
    if (options.customDownload) {
      workbook = options.customDownload(workbook);
    }

    workbook.xlsx
      .writeBuffer()
      .then(b => FileSaver.saveAs(new Blob([b], { type: "application/octet-stream" }), "Report.xlsx"));
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

    const { search, downloadCsv, print, viewColumns, filterTable } = options.textLabels.toolbar;
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
                  <Typography variant="h6" className={toolbarStyles.titleText}>
                    {title}
                  </Typography>
                </div>
              )}
            </div>
            <div className={toolbarStyles.actions}>
              {options.customToolbarStart ? options.customToolbarStart() : false}
              {options.search ? (
                <Tooltip title={search}>
                  <IconButton
                    aria-label={search}
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
                <Tooltip title={downloadCsv}>
                  <IconButton
                    aria-label={downloadCsv}
                    classes={{ root: toolbarStyles.icon }}
                    onClick={this.handleCSVDownload}>
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
                        <IconButton aria-label={print} classes={{ root: toolbarStyles.icon }}>
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
                      classes={{ root: this.getActiveIcon(toolbarStyles, "viewcolumns") }}
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
                      classes={{ root: this.getActiveIcon(toolbarStyles, "filter") }}
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
        )}
      </DataStyles>
    );
  }
}

export default MUIDataTableToolbar;
