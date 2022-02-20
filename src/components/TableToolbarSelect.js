import React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import MuiTooltip from '@mui/material/Tooltip';

const PREFIX = 'MUIDataTableToolbarSelect';

const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  iconButton: `${PREFIX}-iconButton`,
  deleteIcon: `${PREFIX}-deleteIcon`
};

const StyledPaper = styled(Paper)((
  {
    theme
  }
) => ({
  [`&.${classes.root}`]: {
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

  [`& .${classes.title}`]: {
    paddingLeft: '26px',
  },

  [`& .${classes.iconButton}`]: {
    marginRight: '24px',
  },

  [`& .${classes.deleteIcon}`]: {}
}));

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

    const { options } = this.props;
    if (selectedRows.length > 1 && options.selectableRows === 'single') {
      throw new Error('Can not select more than one row when "selectableRows" is "single"');
    }
    this.props.selectRowUpdate('custom', selectedRows);
  };

  render() {
    const {  onRowsDelete, selectedRows, options, displayData, components = {} } = this.props;
    const textLabels = options.textLabels.selectedRows;
    const Tooltip = components.Tooltip || MuiTooltip;

    return (
      <StyledPaper className={classes.root}>
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
      </StyledPaper>
    );
  }
}

export default (TableToolbarSelect);
