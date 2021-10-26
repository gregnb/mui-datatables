import Chip from '@mui/material/Chip';
import PropTypes from 'prop-types';
import React from 'react';
import clsx from 'clsx';

const TableFilterListItem = ({ label, onDelete, className, filterProps }) => {
  filterProps = filterProps || {};
  if (filterProps.className) {
    className = clsx(className, filterProps.className);
  }
  return <Chip label={label} onDelete={onDelete} className={className} {...filterProps} />;
};

TableFilterListItem.propTypes = {
  label: PropTypes.node,
  onDelete: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired,
};

export default TableFilterListItem;
