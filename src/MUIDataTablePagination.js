import React from "react";
import PropTypes from "prop-types";
import { TableRow, TableFooter, TablePagination } from "material-ui/Table";
import { getStyle, withDataStyles } from "./withDataStyles";

const styles = theme => ({
  root: {
    "&:last-child": {
      padding: "0px 24px 0px 24px",
    },
  },
});

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
    /** Extend the style applied to components */
    classes: PropTypes.object,
  };

  handleRowChange = event => {
    this.props.changeRowsPerPage(event.target.value);
  };

  handlePageChange = (_, page) => {
    this.props.changePage(page);
  };

  render() {
    const { count, classes, options, rowsPerPage, page } = this.props;

    return (
      <TableFooter>
        <TableRow>
          <TablePagination
            className={classes.root}
            count={count}
            rowsPerPage={rowsPerPage}
            page={page}
            rowsPerPageOptions={options.rowsPerPageOptions}
            onChangePage={this.handlePageChange}
            onChangeRowsPerPage={this.handleRowChange}
          />
        </TableRow>
      </TableFooter>
    );
  }
}

export default withDataStyles(styles)(MUIDataTablePagination);
