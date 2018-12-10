import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import MUIPopover from "./MUIPopover";
import MUIPopoverTarget from "./MUIPopoverTarget";
import MUIPopoverContent from "./MUIPopoverContent";

class MUIDataTablePopoverWrapper extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    const { label, tableRef, onClick, icon, children } = this.props;

    return (
      <MUIPopover container={tableRef}>
        <MUIPopoverTarget>
          <IconButton aria-label={label} onClick={onClick}>
            <Tooltip title={label}>{icon}</Tooltip>
          </IconButton>
        </MUIPopoverTarget>
        <MUIPopoverContent>{children}</MUIPopoverContent>
      </MUIPopover>
    );
  }
}

export default MUIDataTablePopoverWrapper;
