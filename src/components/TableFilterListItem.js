import Chip from '@material-ui/core/Chip';
import PropTypes from 'prop-types';
import React from 'react';

const TableFilterListItem = ({ label, onDelete, className }) => {
  return <Chip label={label} onDelete={onDelete} className={className} />;
};

TableFilterListItem.propTypes = {
  label: PropTypes.node,
  onDelete: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired,
};

export default TableFilterListItem;
