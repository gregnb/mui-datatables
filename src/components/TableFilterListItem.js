import Chip from '@material-ui/core/Chip';
import PropTypes from 'prop-types';
import React from 'react';

class TableFilterListItem extends React.PureComponent {
  static propTypes = {
    label: PropTypes.node,
    onDelete: PropTypes.func.isRequired,
    className: PropTypes.string.isRequired,
  };

  render() {
    const { label, onDelete, className } = this.props;

    return <Chip label={label} onDelete={onDelete} className={className} />;
  }
}

export default TableFilterListItem;
