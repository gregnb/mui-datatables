import React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import TableRow from '@mui/material/TableRow';

const PREFIX = 'MUIDataTableHeadRow';

const classes = {
  root: `${PREFIX}-root`,
};

const StyledTableRow = styled(TableRow)(() => ({
  [`&.${classes.root}`]: {},
}));

const TableHeadRow = ({ children }) => {
  return (
    <StyledTableRow
      className={clsx({
        [classes.root]: true,
      })}>
      {children}
    </StyledTableRow>
  );
};

TableHeadRow.propTypes = {
  children: PropTypes.node,
};

export default TableHeadRow;
