import React from "react";
import PropTypes from "prop-types";
import Popover from "material-ui/Popover";
import MUIPopoverContent from "./MUIPopoverContent";
import MUIPopoverTarget from "./MUIPopoverTarget";
import { findDOMNode } from "react-dom";

class MUIPopover extends React.Component {
  static propTypes = {
    /** Show indicating arrow. default: true */
    arrow: PropTypes.bool,
    /** Reference callback to handleRequestClose() to trigger manual close of MUIPopover */
    refClose: PropTypes.func,
    /** Reference callback to onExited() to trigger manual close of MUIPopover */
    refExit: PropTypes.func,
    /** MUIPopoverTarget and MUIPopoverContent are required children */
    children: (props, propName, componentName) => {
      let childMatch = true;
      const expectedComponents = [MUIPopoverContent, MUIPopoverTarget];

      React.Children.map(props.children, (child, index) => {
        if (expectedComponents.indexOf(child.type) === -1) childMatch = false;
      });

      if (!childMatch) {
        return new Error(
          "`" +
            componentName +
            "` " +
            "should only have children of the following types: `MUIPopoverTarget`, `MUIPopoverContent`.",
        );
      }
    },
  };

  state = {
    open: false,
  };

  componentWillMount() {
    this.anchorEl = false;
  }

  componentDidMount() {
    /*
     * expose close method to the parent
     */
    if (this.props.refClose) {
      this.props.refClose(this.handleRequestClose);
    }
  }

  handleClick = () => {
    this.anchorEl = findDOMNode(this.anchorEl);
    this.setState({ open: true });
  };

  handleRequestClose = cb => {
    this.setState({ open: false }, cb && typeof cb === "function" ? cb() : () => {});
  };

  handleOnExit = () => {
    if (this.props.refExit) {
      this.props.refExit();
    }
  };

  render() {
    let popoverRender = [];

    React.Children.map(this.props.children, (child, index) => {
      if (child.type === MUIPopoverContent) {
        const transformOriginSpecs = {
          vertical: "top",
          horizontal: "center",
        };

        const anchorOriginSpecs = {
          vertical: "bottom",
          horizontal: "center",
        };

        const popoverContent = (
          <Popover
            key={index}
            elevation={2}
            open={this.state.open}
            onClose={this.handleRequestClose}
            onExited={this.handleOnExit}
            anchorEl={this.anchorEl}
            ref={el => this.popoverEl}
            anchorOrigin={anchorOriginSpecs}
            transformOrigin={transformOriginSpecs}>
            {child}
          </Popover>
        );

        popoverRender.push(popoverContent);
      } else if (child.type === MUIPopoverTarget) {
        const targetContent = React.cloneElement(child, {
          key: index,
          targetRef: el => (this.anchorEl = el),
          onClick: this.handleClick,
        });

        popoverRender.push(targetContent);
      }
    });

    return popoverRender;
  }
}

export default MUIPopover;
