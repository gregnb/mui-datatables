import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import MuiPopover from '@mui/material/Popover';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const Popover = ({ className, trigger, refExit, hide, content, ...providedProps }) => {
  const [isOpen, open] = useState(false);
  const anchorEl = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const shouldHide = typeof hide === 'boolean' ? hide : false;
      if (shouldHide) {
        open(false);
      }
    }
  }, [hide, isOpen, open]);

  const handleClick = event => {
    anchorEl.current = event.currentTarget;
    open(true);
  };

  const handleRequestClose = () => {
    open(false);
  };

  const closeIconClass = providedProps.classes.closeIcon;
  delete providedProps.classes.closeIcon; // remove non-standard class from being passed to the popover component

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
        TransitionProps={{ onExited: handleOnExit }}
        onClose={handleRequestClose}
        anchorEl={anchorEl.current}
        anchorOrigin={anchorOriginSpecs}
        transformOrigin={transformOriginSpecs}
        {...providedProps}>
        <IconButton
          aria-label="Close"
          onClick={handleRequestClose}
          className={closeIconClass}
          style={{ position: 'absolute', right: '4px', top: '4px', zIndex: '1000' }}>
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
  hide: PropTypes.bool,
};

export default Popover;
