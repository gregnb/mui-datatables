import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import { withStyles } from '@material-ui/core/styles';

const defaultToolbarSelectStyles = theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    flex: '1 1 100%',
    display: 'flex',
    height: '64px',
    position: 'relative',
    zIndex: 120,
    justifyContent: 'space-between',
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  title: {
    paddingLeft: '26px',
    top: '50%',
    position: 'relative',
    transform: 'translateY(-50%)',
  },
  iconButton: {
    marginRight: '24px',
    top: '50%',
    display: 'block',
    position: 'relative',
    transform: 'translateY(-50%)',
  },
  deleteIcon: {},
});

class TableToolbarSelect extends React.Component {
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

  /**
   * @param {number[]} selectedRows Array of rows indexes that are selected, e.g. [0, 2] will select first and third rows in table
   */
  handleCustomSelectedRows = selectedRows => {
    if (!Array.isArray(selectedRows)) {
      throw new TypeError(`"selectedRows" must be an "array", but it's "${typeof selectedRows}"`);
    }

    if (selectedRows.some(row => typeof row !== 'number')) {
      throw new TypeError(`Array "selectedRows" must contain only numbers`);
    }

    this.props.selectRowUpdate('custom', selectedRows);
  };

  render() {
    const { classes, onRowsDelete, selectedRows, options, displayData } = this.props;
    const textLabels = options.textLabels.selectedRows;

    return (
      <Paper className={classes.root}>
        <div>
          <Typography variant="subtitle1" className={classes.title}>
            {selectedRows.data.length} {textLabels.text}
          </Typography>
        </div>
        {options.customToolbarSelect ? (
          options.customToolbarSelect(selectedRows, displayData, this.handleCustomSelectedRows)
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

export default withStyles(defaultToolbarSelectStyles, { name: 'MUIDataTableToolbarSelect' })(TableToolbarSelect);
