import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { TableHead, TableRow } from "material-ui/Table";
import MUIDataTableHeadCell from "./MUIDataTableHeadCell";
import { getStyle, DataStyles } from "./DataStyles";

const defaultHeadStyles = {
  responsiveStacked: {
    "@media screen and (max-width: 960px)": {
      display: "none",
    },
  },
};

const defaultHeadRowStyles = {};

const defaultHeadCellStyles = {
  tooltip: {
    cursor: "pointer",
  },
  data: {
    display: "inline-block",
  },
  sortAction: {
    display: "inline-block",
    verticalAlign: "top",
    cursor: "pointer",
    paddingLeft: "4px",
    height: "10px",
  },
  sortActive: {
    color: "rgba(0, 0, 0, 0.87)",
  },
  toolButton: {
    height: "10px",
    outline: "none",
  },
};

class MUIDataTableHead extends React.Component {
  state = {
    activeColumn: null,
  };

  handleToggleColumn = index => {
    this.setState(() => ({
      activeColumn: index,
    }));
    this.props.toggleSort(index);
  };

  render() {
    const { columns, options } = this.props;
    const { activeColumn } = this.state;

    return (
      <DataStyles
        defaultStyles={defaultHeadStyles}
        name="MUIDataTableHead"
        styles={getStyle(options, "table.head.main")}>
        {headStyles => (
          <TableHead className={headStyles.responsiveStacked}>
            <DataStyles
              defaultStyles={defaultHeadRowStyles}
              name="MUIDataTableHeadRow"
              styles={getStyle(options, "table.head.row")}>
              {rowStyles => (
                <DataStyles
                  defaultStyles={defaultHeadCellStyles}
                  name="MUIDataTableHeadCell"
                  styles={getStyle(options, "table.head.cell")}>
                  {cellStyles => {
                    return (
                      <TableRow classes={getStyle(options, "table.head.row")}>
                        {columns.map(
                          (column, index) =>
                            column.display ? (
                              <MUIDataTableHeadCell
                                key={index}
                                index={index}
                                classes={cellStyles}
                                sort={column.sort}
                                sortDirection={column.sortDirection}
                                toggleSort={this.handleToggleColumn}
                                options={options}>
                                {column.name}
                              </MUIDataTableHeadCell>
                            ) : (
                              false
                            ),
                        )}
                      </TableRow>
                    );
                  }}
                </DataStyles>
              )}
            </DataStyles>
          </TableHead>
        )}
      </DataStyles>
    );
  }
}

export default MUIDataTableHead;
