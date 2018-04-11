import React from "react";

class MUIPopoverTarget extends React.Component {
  render() {
    const targetContent = React.Children.map(this.props.children, (child, index) => {
      return React.cloneElement(child, {
        key: index,
        ref: this.props.targetRef,
        onClick: this.props.onClick,
      });
    });

    return targetContent;
  }
}

export default MUIPopoverTarget;
