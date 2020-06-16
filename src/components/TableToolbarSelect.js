import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';
import MuiTooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles(
  theme => ({
    root: {
      backgroundColor: theme.palette.background.default,
      flex: '1 1 100%',
      display: 'flex',
      position: 'relative',
      zIndex: 120,
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: typeof theme.spacing === 'function' ? theme.spacing(1) : theme.spacing.unit,
      paddingBottom: typeof theme.spacing === 'function' ? theme.spacing(1) : theme.spacing.unit,
      '@media print': {
        display: 'none',
      },
    },
    title: {
      paddingLeft: '26px',
    },
    iconButton: {
      marginRight: '24px',
    },
    deleteIcon: {},
  }),
  { name: 'MUIDataTableToolbarSelect' },
);

const TableToolbarSelect = ({ onRowsDelete, selectedRows, options, displayData, components = {}, selectRowUpdate }) => {
  const classes = useStyles();
  const textLabels = options.textLabels.selectedRows;
  const Tooltip = components.Tooltip || MuiTooltip;

  /**
   * @param {number[]} selectedRows Array of rows indexes that are selected, e.g. [0, 2] will select first and third rows in table
   */
  const handleCustomSelectedRows = selectedRows => {
    if (!Array.isArray(selectedRows)) {
      throw new TypeError(`"selectedRows" must be an "array", but it's "${typeof selectedRows}"`);
    }

    if (selectedRows.some(row => typeof row !== 'number')) {
      throw new TypeError(`Array "selectedRows" must contain only numbers`);
    }

    if (selectedRows.length > 1 && options.selectableRows === 'single') {
      throw new Error('Can not select more than one row when "selectableRows" is "single"');
    }
    selectRowUpdate('custom', selectedRows);
  };

  return (
    <Paper className={classes.root}>
      <div>
        <Typography variant="subtitle1" className={classes.title}>
          {selectedRows.data.length} {textLabels.text}
        </Typography>
      </div>
      {options.customToolbarSelect ? (
        options.customToolbarSelect(selectedRows, displayData, handleCustomSelectedRows)
      ) : (
        <Tooltip title={textLabels.delete}>
          <IconButton className={classes.iconButton} onClick={onRowsDelete} aria-label={textLabels.deleteAria}>
            <DeleteIcon className={classes.deleteIcon} />
          </IconButton>
        </Tooltip>
      )}
    </Paper>
  );
};

TableToolbarSelect.propTypes = {
  /** Options used to describe table */
  options: PropTypes.object.isRequired,
  /** Current row selected or not */
  rowSelected: PropTypes.bool,
  /** Callback to trigger selected rows delete */
  onRowsDelete: PropTypes.func,
  /** Extend the style applied to components */
  classes: PropTypes.object,
};

export default TableToolbarSelect;
