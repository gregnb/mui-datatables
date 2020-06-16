import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(
  () => ({
    root: {},
  }),
  { name: 'MUIDataTableHeadRow' },
);

const TableHeadRow = ({ children }) => {
  const classes = useStyles();

  return (
    <TableRow
      className={classNames({
        [classes.root]: true,
      })}>
      {children}
    </TableRow>
  );
};

TableHeadRow.propTypes = {
  children: PropTypes.node,
};

export default TableHeadRow;
