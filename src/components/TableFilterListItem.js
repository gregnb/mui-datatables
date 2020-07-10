import Chip from '@material-ui/core/Chip';
import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';

const TableFilterListItem = ({ label, onDelete, className, filterProps }) => {
  filterProps = filterProps || {};
  if (filterProps.className) {
    className = classnames(className, filterProps.className);
  }
  return <Chip label={label} onDelete={onDelete} className={className} {...filterProps} />;
};

TableFilterListItem.propTypes = {
  label: PropTypes.node,
  onDelete: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired,
};

export default TableFilterListItem;
