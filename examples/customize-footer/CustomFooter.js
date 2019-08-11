import React from "react";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import MuiTablePagination from "@material-ui/core/TablePagination";
import { withStyles } from "@material-ui/core/styles";

const defaultFooterStyles = {
};

class CustomFooter extends React.Component {

  handleRowChange = event => {
    this.props.changeRowsPerPage(event.target.value);
  };

  handlePageChange = (_, page) => {
    const { options } = this.props;
    this.props.changePage(page);
  };

  render() {
    const { count, classes, options, rowsPerPage, page } = this.props;
    const textLabels = options.textLabels.pagination;

    const footerStyle = {
      display:'flex', 
      justifyContent: 'flex-end',
      padding: '0px 24px 0px 24px'
    };

    return (
      <TableFooter>
        <TableRow>
          <TableCell style={footerStyle} colSpan={1000}>
            <button>Custom Option</button>
          
            <MuiTablePagination
              component="div"
              count={count}
              rowsPerPage={rowsPerPage}
              page={page}
              labelRowsPerPage={textLabels.rowsPerPage}
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} ${textLabels.displayRows} ${count}`}
              backIconButtonProps={{
                id: 'pagination-back',
                'data-testid': 'pagination-back',
                'aria-label': textLabels.previous,
              }}
              nextIconButtonProps={{
                id: 'pagination-next',
                'data-testid': 'pagination-next',
                'aria-label': textLabels.next,
              }}
              SelectProps={{
                id: 'pagination-input',
                SelectDisplayProps: { id: 'pagination-rows', 'data-testid': 'pagination-rows' },
                MenuProps: {
                  id: 'pagination-menu',
                  'data-testid': 'pagination-menu',
                  MenuListProps: { id: 'pagination-menu-list', 'data-testid': 'pagination-menu-list' },
                },
              }}
              rowsPerPageOptions={options.rowsPerPageOptions}
              onChangePage={this.handlePageChange}
              onChangeRowsPerPage={this.handleRowChange}
            />
          </TableCell>
        </TableRow>
      </TableFooter>
    );
  }

}

export default withStyles(defaultFooterStyles, { name: "CustomFooter" })(CustomFooter);