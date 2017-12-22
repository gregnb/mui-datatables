import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import Popover from "material-ui/Popover";
import MUIPopoverContent from "./MUIPopoverContent";
import MUIPopoverTarget from "./MUIPopoverTarget";
import { findDOMNode } from "react-dom";

class MUIPopover extends React.Component {
  static propTypes = {
    /** Show indicating arrow. default: true */
    arrow: PropTypes.bool,
    /** How to position the popover */
    placement: PropTypes.oneOf([
      "top",
      "left",
      "right",
      "bottom",
      "top-left",
      "top-center",
      "top-right",
      "left-top",
      "left-center",
      "left-bottom",
      "right-top",
      "right-center",
      "right-bottom",
      "bottom-left",
      "bottom-center",
      "bottom-right",
    ]),
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
    let anchorOriginSpecs = {},
      transformOriginSpecs = {};

    React.Children.map(this.props.children, (child, index) => {
      if (child.type === MUIPopoverContent) {
        const directions = this.props.placement.split("-");

        const placement = directions[0];
        const placementOffset = directions[1] ? directions[1] : "center";

        switch (placement) {
          case "top":
            transformOriginSpecs = {
              vertical: "bottom",
              horizontal: "center",
            };

            anchorOriginSpecs = {
              vertical: "top",
              horizontal: placementOffset,
            };

            break;

          case "left":
            transformOriginSpecs = {
              vertical: "center",
              horizontal: "right",
            };

            anchorOriginSpecs = {
              vertical: placementOffset,
              horizontal: "left",
            };

            break;

          case "right":
            transformOriginSpecs = {
              vertical: "center",
              horizontal: "left",
            };

            anchorOriginSpecs = {
              vertical: placementOffset,
              horizontal: "right",
            };

            break;

          case "bottom":
            transformOriginSpecs = {
              vertical: "top",
              horizontal: "center",
            };

            anchorOriginSpecs = {
              vertical: "bottom",
              horizontal: placementOffset,
            };

            break;
        }

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
            transformOrigin={transformOriginSpecs}
            className={classnames({
              popover: true,
              [this.props.className]: this.props.className,
              [`placement-${this.props.placement}`]: this.props.placement,
              [`show-arrow`]: this.props.arrow,
            })}
            classes={{
              paper: "popover-paper",
            }}>
            {this.props.arrow && (
              <span className={"popover-arrow"}>
                <svg width="100%" viewBox="0 0 20 10">
                  <polygon points="0,10 20,10 10,0" />
                </svg>
              </span>
            )}
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
