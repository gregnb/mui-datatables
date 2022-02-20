import React from 'react';
import PropTypes from 'prop-types';
import MuiTableCell from '@mui/material/TableCell';
import MuiTableRow from '@mui/material/TableRow';
import MuiTableFooter from '@mui/material/TableFooter';
import MuiTablePagination from '@mui/material/TablePagination';
import JumpToPage from './JumpToPage';
import { getPageValue } from '../utils';
import { styled } from '@mui/material/styles';

const PREFIX = 'MUIDataTablePagination';

const classes = {
  root: `${PREFIX}-root`,
  tableCellContainer: `${PREFIX}-tableCellContainer`,
  paperResponsiveScrollFullHeightFullWidth: `${PREFIX}-paperResponsiveScrollFullHeightFullWidth`,
  navContainer: `${PREFIX}-navContainer`,
  toolbar: `${PREFIX}-toolbar`,
  selectRoot: `${PREFIX}-selectRoot`,
};

const StyledMuiTablePagination = styled(MuiTableFooter)(({ theme }) => ({
  [`& .${classes.root}`]: {},
  [`& .${classes.tableCellContainer}`]: {
    padding: '0px 24px 0px 24px',
  },
  [`& .${classes.navContainer}`]: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  [`& .${classes.toolbar}`]: {},
  [`& .${classes.selectRoot}`]: {},
  '@media screen and (max-width: 400px)': {
    [`& .${classes.toolbar}`]: {
      '& span:nth-of-type(2)': {
        display: 'none',
      },
    },
    [`& .${classes.selectRoot}`]: {
      marginRight: '8px',
    },
  },
}));

function TablePagination(props) {
  const handleRowChange = event => {
    props.changeRowsPerPage(event.target.value);
  };

  const handlePageChange = (_, page) => {
    props.changePage(page);
  };

  const { count, options, rowsPerPage, page } = props;
  const textLabels = options.textLabels.pagination;

  return (
    <StyledMuiTablePagination>
      <MuiTableRow>
        <MuiTableCell colSpan="1000" sx={{ p: '0px 24px' }}>
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
    </StyledMuiTablePagination>
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
