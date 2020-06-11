import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import MuiPopover from '@material-ui/core/Popover';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const Popover = ({ className, trigger, refExit, content, ...providedProps }) => {
  const [isOpen, open] = useState(false);
  const anchorEl = useRef(null);

  const handleClick = event => {
    anchorEl.current = event.currentTarget;
    open(true);
  };

  const handleRequestClose = () => {
    open(false);
  };

  const closeIconClass = providedProps.classes.closeIcon;

  const transformOriginSpecs = {
    vertical: 'top',
    horizontal: 'center',
  };

  const anchorOriginSpecs = {
    vertical: 'bottom',
    horizontal: 'center',
  };

  const handleOnExit = () => {
    if (refExit) {
      refExit();
    }
  };

  const triggerProps = {
    key: 'content',
    onClick: event => {
      if (trigger.props.onClick) trigger.props.onClick();
      handleClick(event);
    },
  };

  return (
    <>
      <span {...triggerProps}>{trigger}</span>
      <MuiPopover
        elevation={2}
        open={isOpen}
        onClose={handleRequestClose}
        onExited={handleOnExit}
        anchorEl={anchorEl.current}
        anchorOrigin={anchorOriginSpecs}
        transformOrigin={transformOriginSpecs}
        {...providedProps}>
        <IconButton
          aria-label="Close"
          onClick={handleRequestClose}
          className={closeIconClass}
          style={{ position: 'absolute', right: '4px', top: '4px' }}>
          <CloseIcon />
        </IconButton>
        {content}
      </MuiPopover>
    </>
  );
};

Popover.propTypes = {
  refExit: PropTypes.func,
  trigger: PropTypes.node.isRequired,
  content: PropTypes.node.isRequired,
};

export default Popover;
