import React from 'react';
import PropTypes from 'prop-types';
import MuiTableCell from '@material-ui/core/TableCell';
import MuiTableRow from '@material-ui/core/TableRow';
import MuiTableFooter from '@material-ui/core/TableFooter';
import MuiTablePagination from '@material-ui/core/TablePagination';
import JumpToPage from './JumpToPage';
import { makeStyles } from '@material-ui/core/styles';
import { getPageValue } from '../utils';

const useStyles = makeStyles(
  theme => ({
    root: {},
    tableCellContainer: {
      padding: '0px 24px 0px 24px',
    },
    navContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    toolbar: {},
    selectRoot: {},
    '@media screen and (max-width: 400px)': {
      toolbar: {
        '& span:nth-child(2)': {
          display: 'none',
        },
      },
      selectRoot: {
        marginRight: '8px',
      },
    },
  }),
  { name: 'MUIDataTablePagination' },
);

function TablePagination(props) {
  const classes = useStyles();

  const handleRowChange = event => {
    props.changeRowsPerPage(event.target.value);
  };

  const handlePageChange = (_, page) => {
    props.changePage(page);
  };

  const { count, options, rowsPerPage, page } = props;
  const textLabels = options.textLabels.pagination;

  return (
    <MuiTableFooter>
      <MuiTableRow>
        <MuiTableCell colSpan="1000" className={classes.tableCellContainer}>
          <div className={classes.navContainer}>
            {options.jumpToPage ? (
              <JumpToPage
                count={count}
                page={page}
                rowsPerPage={rowsPerPage}
                textLabels={options.textLabels}
                changePage={props.changePage}
                changeRowsPerPage={props.changeRowsPerPage}
              />
            ) : null}
            <MuiTablePagination
              component="div"
              className={classes.root}
              classes={{
                caption: classes.caption,
                toolbar: classes.toolbar,
                selectRoot: classes.selectRoot,
              }}
              count={count}
              rowsPerPage={rowsPerPage}
              page={getPageValue(count, rowsPerPage, page)}
              labelRowsPerPage={textLabels.rowsPerPage}
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} ${textLabels.displayRows} ${count}`}
              backIconButtonProps={{
                id: 'pagination-back',
                'data-testid': 'pagination-back',
                'aria-label': textLabels.previous,
                title: textLabels.previous || '',
              }}
              nextIconButtonProps={{
                id: 'pagination-next',
                'data-testid': 'pagination-next',
                'aria-label': textLabels.next,
                title: textLabels.next || '',
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
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowChange}
            />
          </div>
        </MuiTableCell>
      </MuiTableRow>
    </MuiTableFooter>
  );
}

TablePagination.propTypes = {
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

export default TablePagination;
