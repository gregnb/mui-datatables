import React from "react";
import { styled } from '@mui/material/styles';
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import BlockIcon from "@mui/icons-material/Block";
const PREFIX = 'CustomToolbarSelect';

const classes = {
  iconButton: `${PREFIX}-iconButton`,
  iconContainer: `${PREFIX}-iconContainer`,
  inverseIcon: `${PREFIX}-inverseIcon`
};

const Root = styled('div')({
  [`& .${classes.iconButton}`]: {
  },
  [`&.${classes.iconContainer}`]: {
    marginRight: "24px",
  },
  [`& .${classes.inverseIcon}`]: {
    transform: "rotate(90deg)",
  },
});

class CustomToolbarSelect extends React.Component {
  handleClickInverseSelection = () => {
    const nextSelectedRows = this.props.displayData.reduce((nextSelectedRows, _, index) => {
      if (!this.props.selectedRows.data.find(selectedRow => selectedRow.index === index)) {
        nextSelectedRows.push(index);
      }

      return nextSelectedRows;
    }, []);

    this.props.setSelectedRows(nextSelectedRows);
  };

  handleClickDeselectAll = () => {
    this.props.setSelectedRows([]);
  };

  handleClickBlockSelected = () => {
    console.log(`block users with dataIndexes: ${this.props.selectedRows.data.map(row => row.dataIndex)}`);
  };

  render() {
    const { } = this.props;

    return (
      <Root className={classes.iconContainer}>
        <Tooltip title={"Deselect ALL"}>
          <IconButton className={classes.iconButton} onClick={this.handleClickDeselectAll}>
            <IndeterminateCheckBoxIcon className={classes.icon} />
          </IconButton>
        </Tooltip>
        <Tooltip title={"Inverse selection"}>
          <IconButton className={classes.iconButton} onClick={this.handleClickInverseSelection}>
            <CompareArrowsIcon className={[classes.icon, classes.inverseIcon].join(" ")} />
          </IconButton>
        </Tooltip>
        <Tooltip title={"Block selected"}>
          <IconButton className={classes.iconButton} onClick={this.handleClickBlockSelected}>
            <BlockIcon className={classes.icon} />
          </IconButton>
        </Tooltip>
      </Root>
    );
  }
}

export default (CustomToolbarSelect);
