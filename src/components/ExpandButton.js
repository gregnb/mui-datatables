import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Remove from '@material-ui/icons/Remove';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

export default function ExpandButton(props) {
  return (
    <React.Fragment>
      {props.isHeaderCell && !props.areAllRowsExpanded() && props.expandedRows && props.expandedRows.data.length > 0 ? (
        <IconButton
          onClick={props.onExpand}
          style={{ padding: 0 }}
          disabled={props.expandableRowsHeader === false}
          className={props.buttonClass}>
          <Remove id="expandable-button" className={props.iconIndeterminateClass} />
        </IconButton>
      ) : (
        <IconButton
          onClick={props.onExpand}
          style={{ padding: 0 }}
          disabled={props.expandableRowsHeader === false}
          className={props.buttonClass}>
          <KeyboardArrowRight id="expandable-button" className={props.iconClass} />
        </IconButton>
      )}
    </React.Fragment>
  );
}
