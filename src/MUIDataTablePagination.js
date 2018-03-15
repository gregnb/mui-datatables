import React from "react";
import PropTypes from "prop-types";
import { TableRow, TableFooter, TablePagination } from "material-ui/Table";
import { getStyle, DataStyles } from "./DataStyles";

const defaultPaginationStyles = {
  root: {
    "&:last-child": {
      padding: "0px 24px 0px 24px",
    },
  },
  toolbar: {},
  selectRoot: {},
  "@media screen and (max-width: 400px)": {
    toolbar: {
      "& span:nth-child(2)": {
        display: "none",
      },
    },
    selectRoot: {
      marginRight: "8px",
    },
  },
};

class MUIDataTablePagination extends React.Component {
  static propTypes = {
    /** Total number of table rows */
    count: PropTypes.number.isRequired,
    /** Options used to describe table */
    options: PropTypes.object.isRequired,
    /** Current page index */
    page: PropTypes.number.isRequired,
    /** Total number allowed of rows per page */
    rowsPerPage: PropTypes.number.isRequired,
    /** Callback to trigger rows per page change */
    changeRowsPerPage: PropTypes.func.isRequired,
  };

  handleRowChange = event => {
    this.props.changeRowsPerPage(event.target.value);
  };

  handlePageChange = (_, page) => {
    this.props.changePage(page);
  };

  render() {
    const { count, options, rowsPerPage, page } = this.props;

    return (
      <DataStyles
        defaultStyles={defaultPaginationStyles}
        name="MUIDataTablePagination"
        styles={getStyle(options, "table.pagination")}>
        {paginationStyles => (
          <TableFooter>
            <TableRow>
              <TablePagination
                className={paginationStyles.root}
                classes={{
                  caption: paginationStyles.caption,
                  toolbar: paginationStyles.toolbar,
                  selectRoot: paginationStyles.selectRoot,
                }}
                count={count}
                rowsPerPage={rowsPerPage}
                page={page}
                backIconButtonProps={{
                  "aria-label": "Previous Page",
                }}
                nextIconButtonProps={{
                  "aria-label": "Next Page",
                }}
                rowsPerPageOptions={options.rowsPerPageOptions}
                onChangePage={this.handlePageChange}
                onChangeRowsPerPage={this.handleRowChange}
              />
            </TableRow>
          </TableFooter>
        )}
      </DataStyles>
    );
  }
}

export default MUIDataTablePagination;
