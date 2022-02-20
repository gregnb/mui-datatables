import React from 'react';
import { styled } from '@mui/material/styles';
import TableFooter from '@mui/material/TableFooter';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import MuiTablePagination from '@mui/material/TablePagination';

const PREFIX = 'CustomFooter';
const classes = {};

const StyledTableFooter = styled(TableFooter)({});

class CustomFooter extends React.Component {
  handleRowChange = event => {
    this.props.changeRowsPerPage(event.target.value);
  };

  handlePageChange = (_, page) => {
    this.props.changePage(page);
  };

  render() {
    const { count, textLabels, rowsPerPage, page } = this.props;

    const footerStyle = {
      display: 'flex',
      justifyContent: 'flex-end',
      padding: '0px 24px 0px 24px',
    };

    return (
      <StyledTableFooter>
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
                'aria-label': textLabels.previous,
              }}
              nextIconButtonProps={{
                'aria-label': textLabels.next,
              }}
              rowsPerPageOptions={[10, 20, 100]}
              onChangePage={this.handlePageChange}
              onChangeRowsPerPage={this.handleRowChange}
            />
          </TableCell>
        </TableRow>
      </StyledTableFooter>
    );
  }
}

export default CustomFooter;
