import React from "react";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import { withStyles } from "@material-ui/core/styles";

const defaultToolbarSelectStyles = {
  root: {
    backgroundColor: "#f7f7f7",
    flex: "1 1 100%",
    display: "flex",
    height: "64px",
    justifyContent: "space-between",
  },
  title: {
    paddingLeft: "26px",
    top: "50%",
    position: "relative",
    transform: "translateY(-50%)",
  },
  iconButton: {
    marginRight: "24px",
    top: "50%",
    display: "block",
    position: "relative",
    transform: "translateY(-50%)",
  },
  deleteIcon: {
    color: "#000",
  },
};

class MUIDataTableToolbarSelect extends React.Component {
  static propTypes = {
    /** Options used to describe table */
    options: PropTypes.object.isRequired,
    /** Current row selected or not */
    rowSelected: PropTypes.bool,
    /** Callback to trigger selected rows delete */
    onRowsDelete: PropTypes.func,
    /** Extend the style applied to components */
    classes: PropTypes.object,
  };

  render() {
    const { classes, onRowsDelete, selectedRows, options } = this.props;
    const textLabels = options.textLabels.selectedRows;

    return (
      <Paper className={classes.root}>
        <div>
          <Typography variant="subtitle1" className={classes.title}>
            {selectedRows.data.length} {textLabels.text}
          </Typography>
        </div>
        {options.customToolbarSelect ? (
          options.customToolbarSelect(selectedRows)
        ) : (
          <Tooltip title={textLabels.delete}>
            <IconButton className={classes.iconButton} onClick={onRowsDelete} aria-label={textLabels.deleteAria}>
              <DeleteIcon className={classes.deleteIcon} />
            </IconButton>
          </Tooltip>
        )}
      </Paper>
    );
  }
}

export default withStyles(defaultToolbarSelectStyles, { name: "MUIDataTableToolbarSelect" })(MUIDataTableToolbarSelect);
