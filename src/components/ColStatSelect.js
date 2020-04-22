import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core/styles';

export const defaultViewColStyles = theme => ({
  root: {
    padding: '16px 24px 16px 24px',
    fontFamily: 'Roboto',
  },
  title: {
    marginLeft: '-7px',
    fontSize: '14px',
    color: theme.palette.text.secondary,
    textAlign: 'left',
    fontWeight: 500,
  },
  formGroup: {
    marginTop: '8px',
  },
  formControl: {},
  checkbox: {
    padding: '0px',
    width: '32px',
    height: '32px',
  },
  checkboxRoot: {
    '&$checked': {
      color: theme.palette.primary.main,
    },
  },
  checked: {},
  label: {
    fontSize: '15px',
    marginLeft: '8px',
    color: theme.palette.text.primary,
  },
});

const ColStatSelect = ({ classes, dataType, selections, options, onFilterClick }) => {

  const handleStatSelChange = statName => e => {
    onFilterClick(statName, e.target.checked);
  };

  const textLabels = options.textLabels.stats;

  const statList = Object.entries(options.textLabels.stats.types);

  return (
    <FormControl component={'fieldset'} className={classes.root} aria-label={textLabels.tooltip}>
      <Typography variant="caption" className={classes.title}>
        {textLabels.title}
      </Typography>
      <FormGroup className={classes.formGroup}>
        {statList.map((column, index) => {
          return (
            <FormControlLabel
              key={index}
              classes={{
                root: classes.formControl,
                label: classes.label,
              }}
              control={
                <Checkbox
                  className={classes.checkbox}
                  classes={{
                    root: classes.checkboxRoot,
                    checked: classes.checked,
                  }}
                  disabled={dataType !== 'number' && column[0] !== 'qty'}
                  onClick={handleStatSelChange(column[0])}
                  checked={selections && selections[column[0]] === true ? true : false}
                  value={column[0]}
                />
              }
              label={column[1]}
            />
          );
        })}
      </FormGroup>
    </FormControl>
  );
};

ColStatSelect.propTypes = {
  /** Options used to describe table */
  options: PropTypes.object.isRequired,
  /** Extend the style applied to components */
  classes: PropTypes.object,
};

export default withStyles(defaultViewColStyles, { name: 'MUIDataTableViewCol' })(ColStatSelect);
