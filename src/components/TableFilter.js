import { Grid, TextField } from '@material-ui/core';

import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';
import React from 'react';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import cloneDeep from 'lodash.clonedeep';

export const defaultFilterStyles = theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    padding: '24px 24px 36px 24px',
    fontFamily: 'Roboto',
  },
  header: {
    flex: '0 0 auto',
    marginBottom: '16px',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  title: {
    display: 'inline-block',
    marginLeft: '7px',
    color: theme.palette.text.primary,
    fontSize: '14px',
    fontWeight: 500,
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
  },
  checkbox: {},
  checked: {},
  gridListTile: {
    marginTop: '16px',
  },
});

class TableFilter extends React.Component {
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
    onFilterReset: PropTypes.func,
    /** Extend the style applied to components */
    classes: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      filterList: cloneDeep(props.filterList),
    };
  }

  filterUpdate = (index, value, column, type, customUpdate) => {
    let newFilterList = this.state.filterList.slice(0);

    this.props.updateFilterByType(newFilterList, index, value, type, customUpdate);
    this.setState({
      filterList: newFilterList,
    });
  };

  handleCheckboxChange = (index, value, column) => {
    this.filterUpdate(index, value, column, 'checkbox');

    if (this.props.options.confirmFilters !== true) {
      this.props.onFilterUpdate(index, value, column, 'checkbox');
    }
  };

  handleDropdownChange = (event, index, column) => {
    const labelFilterAll = this.props.options.textLabels.filter.all;
    const value = event.target.value === labelFilterAll ? [] : [event.target.value];
    this.filterUpdate(index, value, column, 'dropdown');

    if (this.props.options.confirmFilters !== true) {
      this.props.onFilterUpdate(index, value, column, 'dropdown');
    }
  };

  handleMultiselectChange = (index, value, column) => {
    this.filterUpdate(index, value, column, 'multiselect');

    if (this.props.options.confirmFilters !== true) {
      this.props.onFilterUpdate(index, value, column, 'multiselect');
    }
  };

  handleTextFieldChange = (event, index, column) => {
    this.filterUpdate(index, event.target.value, column, 'textField');

    if (this.props.options.confirmFilters !== true) {
      this.props.onFilterUpdate(index, event.target.value, column, 'textField');
    }
  };

  handleCustomChange = (value, index, column) => {
    this.filterUpdate(index, value, column.name, column.filterType);

    if (this.props.options.confirmFilters !== true) {
      this.props.onFilterUpdate(index, value, column.name, column.filterType);
    }
  };

  renderCheckbox(column, index, components = {}) {
    const CheckboxComponent = components.Checkbox || Checkbox;

    const { classes, filterData } = this.props;
    const { filterList } = this.state;
    const renderItem =
      column.filterOptions && column.filterOptions.renderValue ? column.filterOptions.renderValue : v => v;

    return (
      <Grid item key={index} xs={6}>
        <FormGroup>
          <Grid item xs={12}>
            <Typography variant="body2" className={classes.checkboxListTitle}>
              {column.label}
            </Typography>
          </Grid>
          <Grid container>
            {filterData[index].map((filterValue, filterIndex) => (
              <Grid item key={filterIndex}>
                <FormControlLabel
                  key={filterIndex}
                  classes={{
                    root: classes.checkboxFormControl,
                    label: classes.checkboxFormControlLabel,
                  }}
                  control={
                    <CheckboxComponent
                      data-description="table-filter"
                      color="primary"
                      className={classes.checkboxIcon}
                      onChange={this.handleCheckboxChange.bind(null, index, filterValue, column.name)}
                      checked={filterList[index].indexOf(filterValue) >= 0}
                      classes={{
                        root: classes.checkbox,
                        checked: classes.checked,
                      }}
                      value={filterValue != null ? filterValue.toString() : ''}
                    />
                  }
                  label={renderItem(filterValue)}
                />
              </Grid>
            ))}
          </Grid>
        </FormGroup>
      </Grid>
    );
  }

  renderSelect(column, index) {
    const { classes, filterData, options } = this.props;
    const { filterList } = this.state;
    const textLabels = options.textLabels.filter;
    const renderItem =
      column.filterOptions && column.filterOptions.renderValue
        ? column.filterOptions.renderValue
        : v => (v != null ? v.toString() : '');
    const width = (column.filterOptions && column.filterOptions.fullWidth) === true ? 12 : 6;

    return (
      <Grid
        item
        key={index}
        xs={width}
        classes={{ 'grid-xs-12': classes.gridListTile, 'grid-xs-6': classes.gridListTile }}>
        <FormControl key={index} fullWidth>
          <InputLabel htmlFor={column.name}>{column.label}</InputLabel>
          <Select
            fullWidth
            value={filterList[index].length ? filterList[index].toString() : textLabels.all}
            name={column.name}
            onChange={event => this.handleDropdownChange(event, index, column.name)}
            input={<Input name={column.name} id={column.name} />}>
            <MenuItem value={textLabels.all} key={0}>
              {textLabels.all}
            </MenuItem>
            {filterData[index].map((filterValue, filterIndex) => (
              <MenuItem value={filterValue} key={filterIndex + 1}>
                {renderItem(filterValue)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    );
  }

  renderTextField(column, index) {
    const { classes } = this.props;
    const { filterList } = this.state;
    if (column.filterOptions && column.filterOptions.renderValue) {
      console.warn('Custom renderValue not supported for textField filters');
    }
    const width = (column.filterOptions && column.filterOptions.fullWidth) === true ? 12 : 6;

    return (
      <Grid
        item
        key={index}
        xs={width}
        classes={{ 'grid-xs-12': classes.gridListTile, 'grid-xs-6': classes.gridListTile }}>
        <FormControl key={index} fullWidth>
          <TextField
            fullWidth
            label={column.label}
            value={filterList[index].toString() || ''}
            data-testid={'filtertextfield-' + column.name}
            onChange={event => this.handleTextFieldChange(event, index, column.name)}
          />
        </FormControl>
      </Grid>
    );
  }

  renderMultiselect(column, index, components = {}) {
    const CheckboxComponent = components.Checkbox || Checkbox;

    const { classes, filterData } = this.props;
    const { filterList } = this.state;
    const renderItem =
      column.filterOptions && column.filterOptions.renderValue ? column.filterOptions.renderValue : v => v;
    const width = (column.filterOptions && column.filterOptions.fullWidth) === true ? 12 : 6;
    return (
      <Grid
        item
        key={index}
        xs={width}
        classes={{ 'grid-xs-12': classes.gridListTile, 'grid-xs-6': classes.gridListTile }}>
        <FormControl key={index} fullWidth>
          <InputLabel htmlFor={column.name}>{column.label}</InputLabel>
          <Select
            multiple
            fullWidth
            value={filterList[index] || []}
            renderValue={selected => selected.map(renderItem).join(', ')}
            name={column.name}
            onChange={event => this.handleMultiselectChange(index, event.target.value, column.name)}
            input={<Input name={column.name} id={column.name} />}>
            {filterData[index].map((filterValue, filterIndex) => (
              <MenuItem value={filterValue} key={filterIndex + 1}>
                <CheckboxComponent
                  data-description="table-filter"
                  color="primary"
                  checked={filterList[index].indexOf(filterValue) >= 0}
                  value={filterValue != null ? filterValue.toString() : ''}
                  className={classes.checkboxIcon}
                  classes={{
                    root: classes.checkbox,
                    checked: classes.checked,
                  }}
                />
                <ListItemText primary={renderItem(filterValue)} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    );
  }

  renderCustomField(column, index) {
    const { classes, filterData, options } = this.props;
    const { filterList } = this.state;
    const width = (column.filterOptions && column.filterOptions.fullWidth) === true ? 12 : 6;
    const display =
      (column.filterOptions && column.filterOptions.display) ||
      (options.filterOptions && options.filterOptions.display);

    if (!display) {
      console.error('Property "display" is required when using custom filter type.');
      return;
    }
    if (column.filterListOptions && column.filterListOptions.renderValue) {
      console.warning('"renderValue" is ignored for custom filter fields');
    }

    return (
      <Grid
        item
        key={index}
        xs={width}
        classes={{ 'grid-xs-12': classes.gridListTile, 'grid-xs-6': classes.gridListTile }}>
        <FormControl key={index} fullWidth>
          {display(filterList, this.handleCustomChange, index, column, filterData)}
        </FormControl>
      </Grid>
    );
  }

  applyFilters = () => {
    this.state.filterList.forEach((filter, index) => {
      this.props.onFilterUpdate(index, filter, this.props.columns[index], 'custom');
    });

    this.props.handleClose(); // close filter dialog popover

    if (this.props.options.onFilterConfirm) {
      this.props.options.onFilterConfirm(this.state.filterList);
    }

    return this.state.filterList;
  };

  resetFilters = () => {
    this.setState({
      filterList: this.props.columns.map(() => []),
    });
    if (this.props.options.confirmFilters !== true) {
      this.props.onFilterReset();
    }
  };

  render() {
    const { classes, columns, options, customFooter, filterList, components = {} } = this.props;
    const textLabels = options.textLabels.filter;

    return (
      <div className={classes.root}>
        <div className={classes.header}>
          <div className={classes.reset}>
            <Typography
              variant="body2"
              className={clsx({
                [classes.title]: true,
              })}>
              {textLabels.title}
            </Typography>
            <Button
              color="primary"
              className={classes.resetLink}
              tabIndex={0}
              aria-label={textLabels.reset}
              data-testid={'filterReset-button'}
              onClick={this.resetFilters}>
              {textLabels.reset}
            </Button>
          </div>
          <div className={classes.filtersSelected} />
        </div>
        <Grid container direction="row" justify="flex-start" alignItems="center" spacing={4}>
          {columns.map((column, index) => {
            if (column.filter) {
              const filterType = column.filterType || options.filterType;
              return filterType === 'checkbox'
                ? this.renderCheckbox(column, index, components)
                : filterType === 'multiselect'
                ? this.renderMultiselect(column, index, components)
                : filterType === 'textField'
                ? this.renderTextField(column, index)
                : filterType === 'custom'
                ? this.renderCustomField(column, index)
                : this.renderSelect(column, index);
            }
          })}
        </Grid>
        {customFooter ? customFooter(filterList, this.applyFilters) : ''}
      </div>
    );
  }
}

export default withStyles(defaultFilterStyles, { name: 'MUIDataTableFilter' })(TableFilter);
