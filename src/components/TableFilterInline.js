import { Grid, TableCell, TextField } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Input from '@material-ui/core/Input';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';
import TableHeadRow from './TableHeadRow';


export const defaultFilterInlineStyles = theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    padding: '24px 24px 36px 24px',
    fontFamily: 'Roboto',
  },
  input: {
    fontSize: '0.8125rem',
    fontWeight: '400',
  },
  noMargin: {
    marginLeft: '0px',
  },
  reset: {
    alignSelf: 'left',
  },
  resetLink: {
    marginLeft: '16px',
    fontSize: '12px',
    cursor: 'pointer',
  },
  filtersSelected: {
    alignSelf: 'right',
  },
  /* checkbox */
  checkboxListTitle: {
    marginLeft: '7px',
    marginBottom: '8px',
    fontSize: '14px',
    color: theme.palette.text.secondary,
    textAlign: 'left',
    fontWeight: 500,
  },
  checkboxFormGroup: {
    marginTop: '8px',
  },
  checkboxFormControl: {
    margin: '0px',
  },
  checkboxFormControlLabel: {
    fontSize: '15px',
    marginLeft: '8px',
    color: theme.palette.text.primary,
  },
  checkboxIcon: {
    width: '32px',
    height: '32px',
    padding: '0px',
  },
  checkbox: {
    '&$checked': {
      color: theme.palette.primary.main,
    },
  },
  checked: {},
});

class TableFilterInline extends React.Component {
  static propTypes = {
    /** Data used to populate filter dropdown/checkbox */
    filterData: PropTypes.array.isRequired,
    /** Data selected to be filtered against dropdown/checkbox */
    filterList: PropTypes.array.isRequired,
    /** Options used to describe table */
    options: PropTypes.object.isRequired,
    /** Callback to trigger filter update */
    onFilterUpdate: PropTypes.func,
    /** Callback to trigger filter reset */
    onFilterRest: PropTypes.func,
    /** Extend the style applied to components */
    classes: PropTypes.object,
  };

  handleCheckboxChange = (index, value, column) => {
    this.props.onFilterUpdate(index, value, column, 'checkbox');
  };

  handleDropdownChange = (event, index, column) => {
    const labelFilterAll = this.props.options.textLabels.filter.all;
    const value = event.target.value === labelFilterAll ? [] : [event.target.value];
    this.props.onFilterUpdate(index, value, column, 'dropdown');
  };

  handleMultiselectChange = (index, value, column) => {
    this.props.onFilterUpdate(index, value, column, 'multiselect');
  };

  handleTextFieldChange = (event, index, column) => {
    this.props.onFilterUpdate(index, event.target.value, column, 'textField');
  };

  handleCustomChange = (value, index, column) => {
    this.props.onFilterUpdate(index, value, column.name, column.filterType);
  };

  // TODO extend TableFilter
  renderCheckbox(column, index) {
    const { classes, filterData, filterList } = this.props;

    return (
      <Grid container direction={'column'}>
        {filterData[index].map((filterValue, filterIndex) => (
          <Grid item key={filterIndex}>
            <FormControlLabel
              key={filterIndex}
              classes={{
                root: classes.checkboxFormControl,
                label: classes.checkboxFormControlLabel,
              }}
              control={
                <Checkbox
                  className={classes.checkboxIcon}
                  onChange={this.handleCheckboxChange.bind(null, index, filterValue, column.name)}
                  checked={filterList[index].indexOf(filterValue) >= 0 ? true : false}
                  classes={{
                    root: classes.checkbox,
                    checked: classes.checked,
                  }}
                  value={filterValue != null ? filterValue.toString() : ''}
                />
              }
              label={filterValue}
            />
          </Grid>
        ))}
      </Grid>
    );
  }

  renderSelect(column, index) {
    const { classes, filterData, filterList, options } = this.props;
    const textLabels = options.textLabels.filter;

    return (
      <FormControl key={index} fullWidth>
        <Select
          fullWidth
          value={filterList[index].length ? filterList[index].toString() : textLabels.all}
          name={column.name}
          onChange={event => this.handleDropdownChange(event, index, column.name)}
          input={<Input name={column.name} id={column.name} className={classes.input} />}>
          <MenuItem value={textLabels.all} key={0}>
            {textLabels.all}
          </MenuItem>
          {filterData[index].map((filterValue, filterIndex) => (
            <MenuItem value={filterValue} key={filterIndex + 1}>
              {filterValue != null ? filterValue.toString() : ''}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  renderTextField(column, index) {
    const { classes, filterList } = this.props;

    return (
      <FormControl key={index} fullWidth>
        <TextField
          inputProps={{ className: classes.input }}
          fullWidth
          value={filterList[index].toString() || ''}
          onChange={event => this.handleTextFieldChange(event, index, column.name)}
        />
      </FormControl>
    );
  }

  renderMultiselect(column, index) {
    const { classes, filterData, filterList } = this.props;

    return (
      <FormControl key={index} fullWidth>
        <Select
          multiple
          fullWidth
          value={filterList[index] || []}
          renderValue={selected => selected.join(', ')}
          name={column.name}
          onChange={event => this.handleMultiselectChange(index, event.target.value, column.name)}
          input={<Input name={column.name} id={column.name} className={classes.input} />}>
          {filterData[index].map((filterValue, filterIndex) => (
            <MenuItem value={filterValue} key={filterIndex + 1}>
              <Checkbox
                checked={filterList[index].indexOf(filterValue) >= 0 ? true : false}
                value={filterValue != null ? filterValue.toString() : ''}
                className={classes.checkboxIcon}
                classes={{
                  root: classes.checkbox,
                  checked: classes.checked,
                }}
              />
              <ListItemText primary={filterValue} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  renderCustomField(column, index) {
    const { classes, filterList, options } = this.props;
    const display =
      (column.filterOptions && column.filterOptions.display) ||
      (options.filterOptions && options.filterOptions.display);

    if (!display) {
      console.error('Property "display" is required when using custom filter type.');
      return;
    }

    return (
      <FormControl key={index} fullWidth>
        {display(filterList, this.handleCustomChange, index, column)}
      </FormControl>
    );
  }

  render() {
    const { columns, options, expandableOn, selectableOn } = this.props;
    // TODO do we want to put somewhere "Reset" filters button?

    return <TableHeadRow>
      {!expandableOn && selectableOn === 'none' ? false : <TableCell />}
      {columns.map(
        (column, index) => {
          if (column.display !== 'true') {
            return false;

          } else if (!column.filter) {
            return <TableCell key={index}/>;

          } else {
            const filterType = column.filterType || options.filterType;
            return <TableCell key={index}>
              {filterType === 'checkbox'
                ? this.renderCheckbox(column, index)
                : filterType === 'multiselect'
                  ? this.renderMultiselect(column, index)
                  : filterType === 'textField'
                    ? this.renderTextField(column, index)
                    : filterType === 'custom'
                      ? this.renderCustomField(column, index)
                      : this.renderSelect(column, index)}
            </TableCell>;
          }
        })}
    </TableHeadRow>;
  }
}

export default withStyles(defaultFilterInlineStyles, { name: 'MUIDataTableFilterInline' })(TableFilterInline);
