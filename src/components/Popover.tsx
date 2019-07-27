import React from 'react';
import MuiPopover, { PopoverOrigin } from '@material-ui/core/Popover';
import { findDOMNode } from 'react-dom';

interface PopoverProps {
  refClose?: any;
  refExit: any;
  className?: any;
  placement?: any;
  trigger: any;
  content: any;
}

class Popover extends React.Component<PopoverProps> {
  anchorEl: any;
  popoverActions: any;
  popoverEl: any;

  state = {
    open: false,
  };

  componentWillMount() {
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

    const transformOriginSpecs: PopoverOrigin = {
      vertical: 'top',
      horizontal: 'center',
    };

    const anchorOriginSpecs: PopoverOrigin = {
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
        {/* 
  // @ts-ignore */}
        <MuiPopover
          action={actions => (this.popoverActions = actions)}
          elevation={2}
          open={this.state.open}
          onClose={this.handleRequestClose}
          onExited={this.handleOnExit}
          anchorEl={this.anchorEl}
          // TODO fix this error
          ref={el => this.popoverEl}
          anchorOrigin={anchorOriginSpecs}
          transformOrigin={transformOriginSpecs}
          {...providedProps}>
          {content}
        </MuiPopover>
        {triggerEl}
      </React.Fragment>
    );
  }
}

export default Popover;
