import React from 'react';
import PropTypes from 'prop-types';
import MuiPopover from '@material-ui/core/Popover';
import IconButton from '@material-ui/core/IconButton';
import { findDOMNode } from 'react-dom';
import CloseIcon from '@material-ui/icons/Close';

class Popover extends React.Component {
  state = {
    open: false,
  };

  UNSAFE_componentWillMount() {
    this.anchorEl = null;
  }

  componentDidMount() {
    if (this.props.refClose) {
      this.props.refClose(this.handleRequestClose);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    /*
     * Update Popover position if a filter removes data from the table because
     * it affects the window height which would cause the Popover to in the wrong place
     */
    if (this.state.open === true) {
      this.anchorEl = findDOMNode(this.anchorEl);
      this.popoverActions.updatePosition();
    }
  }

  handleClick = () => {
    this.anchorEl = findDOMNode(this.anchorEl);
    this.setState({ open: true });
  };

  handleRequestClose = cb => {
    this.setState({ open: false }, cb && typeof cb === 'function' ? cb() : () => {});
  };

  handleOnExit = () => {
    if (this.props.refExit) {
      this.props.refExit();
    }
  };

  render() {
    const { className, placement, trigger, refExit, content, ...providedProps } = this.props;
    let closeIconClass;
    if (providedProps.classes && providedProps.classes.closeIcon) {
      closeIconClass = providedProps.classes.closeIcon;
      delete providedProps.classes.closeIcon;
    }

    const transformOriginSpecs = {
      vertical: 'top',
      horizontal: 'center',
    };

    const anchorOriginSpecs = {
      vertical: 'bottom',
      horizontal: 'center',
    };

    const triggerEl = React.cloneElement(<span>{trigger}</span>, {
      key: 'content',
      ref: el => (this.anchorEl = el),
      onClick: () => {
        if (trigger.props.onClick) trigger.props.onClick();
        this.handleClick();
      },
    });

    return (
      <React.Fragment>
        <MuiPopover
          action={actions => (this.popoverActions = actions)}
          elevation={2}
          open={this.state.open}
          onClose={this.handleRequestClose}
          onExited={this.handleOnExit}
          anchorEl={this.anchorEl}
          ref={el => this.popoverEl}
          anchorOrigin={anchorOriginSpecs}
          transformOrigin={transformOriginSpecs}
          {...providedProps}>
          <IconButton aria-label="Close" onClick={this.handleRequestClose} className={closeIconClass} style={{position:'absolute',right:'4px',top:'4px'}}>
            <CloseIcon />
          </IconButton>
          {content}
        </MuiPopover>
        {triggerEl}
      </React.Fragment>
    );
  }
}

export default Popover;
