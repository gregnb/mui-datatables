import React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

const PREFIX = 'MUIDataTableViewCol';

const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  formGroup: `${PREFIX}-formGroup`,
  formControl: `${PREFIX}-formControl`,
  checkbox: `${PREFIX}-checkbox`,
  checkboxRoot: `${PREFIX}-checkboxRoot`,
  checked: `${PREFIX}-checked`,
  label: `${PREFIX}-label`,
};

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  [`&.${classes.root}`]: {
    padding: '16px 24px 16px 24px',
    fontFamily: 'Roboto',
  },

  [`& .${classes.title}`]: {
    marginLeft: '-7px',
    marginRight: '24px',
    fontSize: '14px',
    color: theme.palette.text.secondary,
    textAlign: 'left',
    fontWeight: 500,
  },

  [`& .${classes.formGroup}`]: {
    marginTop: '8px',
  },

  [`& .${classes.formControl}`]: {},

  [`& .${classes.checkbox}`]: {
    padding: '0px',
    width: '32px',
    height: '32px',
  },

  [`& .${classes.checkboxRoot}`]: {},
  [`& .${classes.checked}`]: {},

  [`& .${classes.label}`]: {
    fontSize: '15px',
    marginLeft: '8px',
    color: theme.palette.text.primary,
  },
}));

const TableViewCol = ({ columns, options, components = {}, onColumnUpdate, updateColumns }) => {
  const textLabels = options.textLabels.viewColumns;
  const CheckboxComponent = components.Checkbox || Checkbox;

  const handleColChange = index => {
    onColumnUpdate(index);
  };

  return (
    <StyledFormControl component={'fieldset'} className={classes.root} aria-label={textLabels.titleAria}>
      <Typography variant="caption" className={classes.title}>
        {textLabels.title}
      </Typography>
      <FormGroup className={classes.formGroup}>
        {columns.map((column, index) => {
          return (
            column.display !== 'excluded' &&
            column.viewColumns !== false && (
              <FormControlLabel
                key={index}
                classes={{
                  root: classes.formControl,
                  label: classes.label,
                }}
                control={
                  <CheckboxComponent
                    color="primary"
                    data-description="table-view-col"
                    className={classes.checkbox}
                    classes={{
                      root: classes.checkboxRoot,
                      checked: classes.checked,
                    }}
                    onChange={() => handleColChange(index)}
                    checked={column.display === 'true'}
                    value={column.name}
                  />
                }
                label={column.label}
              />
            )
          );
        })}
      </FormGroup>
    </StyledFormControl>
  );
};

TableViewCol.propTypes = {
  /** Columns used to describe table */
  columns: PropTypes.array.isRequired,
  /** Options used to describe table */
  options: PropTypes.object.isRequired,
  /** Callback to trigger View column update */
  onColumnUpdate: PropTypes.func,
  /** Extend the style applied to components */
  classes: PropTypes.object,
};

export default TableViewCol;
