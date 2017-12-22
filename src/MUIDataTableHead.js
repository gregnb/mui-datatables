import React from "react";
import PropTypes from "prop-types";
import { TableHead, TableRow } from "material-ui/Table";
import MUIDataTableHeadCell from "./MUIDataTableHeadCell";
import { getStyle, DataStyles } from "./DataStyles";

const defaultHeadStyles = {};

const defaultHeadRowStyles = {};

const defaultHeadCellStyles = {
  root: {},
};

class MUIDataTableHead extends React.Component {
  render() {
    const { toggleSort, columns, options } = this.props;

    return (
      <DataStyles
        defaultStyles={defaultHeadStyles}
        name="MUIDataTableHead"
        styles={getStyle(options, "table.head.main")}>
        {headStyles => (
          <TableHead>
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
                                sortDirection={column.sort}
                                toggleSort={toggleSort}
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
