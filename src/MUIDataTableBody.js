import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Typography from "material-ui/Typography";
import { TableBody, TableRow } from "material-ui/Table";
import MUIDataTableBodyCell from "./MUIDataTableBodyCell";
import { getStyle, DataStyles } from "./DataStyles";

const defaultBodyStyles = {
  root: {},
  emptyTitle: {
    textAlign: "center",
  },
};

const defaultBodyRowStyles = {
  root: {},
  responsiveStacked: {
    "@media screen and (max-width: 960px)": {
      border: "solid 2px rgba(0, 0, 0, 0.15)",
    },
  },
};

const defaultBodyCellStyles = {
  root: {},
  responsiveStacked: {
    "@media screen and (max-width: 960px)": {
      display: "block",
      fontSize: "16px",
      position: "relative",
      paddingLeft: "calc(50% - 8px)",
      "&:before": {
        position: "absolute",
        top: "6px",
        left: "6px",
        width: "calc(45% - 10px)",
        paddingRight: "10px",
        whiteSpace: "nowrap",
      },
    },
  },
};

class MUIDataTableBody extends React.Component {
  static propTypes = {
    /** Data used to describe table */
    data: PropTypes.array.isRequired,
    /** Columns used to describe table */
    columns: PropTypes.array.isRequired,
    /** Options used to describe table */
    options: PropTypes.object.isRequired,
    /** Data used to filter table against */
    filterList: PropTypes.array,
    /** Data used to search table against */
    searchText: PropTypes.string,
    /** Extend the style applied to components */
    classes: PropTypes.object,
  };

  componentDidMount() {
    this.rRowStyles = this.getRowStyles();
  }

  buildRows() {
    const { data, page, rowsPerPage } = this.props;

    let rows = [];
    const fromIndex = page === 0 ? 0 : page * rowsPerPage;
    const toIndex = Math.min(data.length, (page + 1) * rowsPerPage);

    for (let rowIndex = fromIndex; rowIndex < data.length && rowIndex < toIndex; rowIndex++) {
      rows.push(data[rowIndex]);
    }

    return rows.length ? rows : null;
  }

  getRowStyles() {
    const { columns, options } = this.props;

    if (!options.responsive && options.responsive !== "stacked") {
      return defaultBodyRowStyles;
    }

    let stackStyles = defaultBodyRowStyles;
    const breakpoint = "@media screen and (max-width: 960px)";

    columns.forEach((column, index) => {
      stackStyles["responsiveStacked"][breakpoint]["& td:nth-of-type(" + (index + 1) + "):before"] = {
        content: '"' + column.name + '"',
      };
    });

    return stackStyles;
  }

  render() {
    const { columns, options } = this.props;
    const tableRows = this.buildRows();

    return (
      <DataStyles
        defaultStyles={defaultBodyStyles}
        name="MUIDataTableBody"
        styles={getStyle(options, "table.body.main")}>
        {bodyStyles => (
          <TableBody>
            <DataStyles
              defaultStyles={this.rRowStyles}
              name="MUIDataTableBodyRow"
              styles={getStyle(options, "table.body.row")}>
              {rowStyles => (
                <DataStyles
                  defaultStyles={defaultBodyCellStyles}
                  name="MUIDataTableBodyCell"
                  styles={getStyle(options, "table.body.cell")}>
                  {cellStyles => {
                    return tableRows ? (
                      tableRows.map((row, rowIndex) => (
                        <TableRow
                          hover={options.rowHover ? true : false}
                          className={classNames({
                            [rowStyles.root]: true,
                            [rowStyles.responsiveStacked]: options.responsive === "stacked",
                          })}
                          key={rowIndex}>
                          {row.map(
                            (column, index) =>
                              columns[index].display ? (
                                <MUIDataTableBodyCell
                                  className={classNames({
                                    [cellStyles.root]: true,
                                    [cellStyles.responsiveStacked]: options.responsive === "stacked",
                                  })}
                                  key={index}>
                                  {column.raw}
                                </MUIDataTableBodyCell>
                              ) : (
                                false
                              ),
                          )}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <MUIDataTableBodyCell className={cellStyles.root} colSpan={columns.length}>
                          <Typography variant="subheading" className={bodyStyles.emptyTitle}>
                            Sorry, no matching records found
                          </Typography>
                        </MUIDataTableBodyCell>
                      </TableRow>
                    );
                  }}
                </DataStyles>
              )}
            </DataStyles>
          </TableBody>
        )}
      </DataStyles>
    );
  }
}

export default MUIDataTableBody;
