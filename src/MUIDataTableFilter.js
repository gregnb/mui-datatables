import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Typography from "material-ui/Typography";
import Button from "material-ui/Button";
import { FormLabel, FormControl, FormGroup, FormControlLabel, FormHelperText } from "material-ui/Form";
import Input, { InputLabel } from "material-ui/Input";
import { MenuItem } from "material-ui/Menu";
import Select from "material-ui/Select";
import Checkbox from "material-ui/Checkbox";
import { getStyle, DataStyles } from "./DataStyles";

class MUIDataTableFilter extends React.Component {
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
    filterStyles: PropTypes.object,
  };

  handleCheckboxChange = (index, column) => {
    this.props.onFilterUpdate(index, column, "checkbox");
  };

  handleDropdownChange = (event, index) => {
    const value = event.target.value === "All" ? "" : event.target.value;
    this.props.onFilterUpdate(index, value, "dropdown");
  };

  renderCheckbox(columns) {
    const { filterStyles, filterData, filterList } = this.props;

    return columns.map((column, index) => {
      <div className={filterStyles.checkboxList} key={index}>
        <FormGroup>
          <Typography type="caption" className={filterStyles.checkboxListTitle}>
            {column.name}
          </Typography>
          {filterData[index].map((filterColumn, filterIndex) => (
            <FormControlLabel
              key={filterIndex}
              classes={{
                root: filterStyles.checkboxFormControl,
                label: filterStyles.checkboxFormControlLabel,
              }}
              control={
                <Checkbox
                  className={filterStyles.checkboxIcon}
                  onChange={this.handleCheckboxChange.bind(null, index, filterColumn)}
                  checked={filterList[index].indexOf(filterColumn) >= 0 ? true : false}
                  classes={{
                    checked: filterStyles.checked,
                  }}
                  value={filterColumn}
                />
              }
              label={filterColumn}
            />
          ))}
        </FormGroup>
      </div>;
    });
  }

  renderSelect(columns) {
    const { filterStyles, filterData, filterList } = this.props;

    return (
      <div className={filterStyles.selectRoot}>
        {columns.map((column, index) => (
          <FormControl className={filterStyles.selectFormControl} key={index}>
            <InputLabel htmlFor={column.name}>{column.name}</InputLabel>
            <Select
              value={filterList[index] && filterList[index][0] ? filterList[index][0] : "All"}
              name={column.name}
              onChange={event => this.handleDropdownChange(event, index)}
              input={<Input name={column.name} id={column.name} />}>
              <MenuItem value="All" key={0}>
                All
              </MenuItem>
              {filterData[index].map((filterColumn, filterIndex) => (
                <MenuItem value={filterColumn} key={filterIndex + 1}>
                  {filterColumn}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ))}
      </div>
    );
  }

  render() {
    const { columns, options, filterStyles, onFilterReset } = this.props;
    const dislayColumns = columns.filter(item => item.filter);

    return (
      <div className={filterStyles.root}>
        <div className={filterStyles.header}>
          <div className={filterStyles.reset}>
            <Typography
              type="caption"
              className={classNames({
                [filterStyles.title]: true,
                [filterStyles.noMargin]: options.filterType === "dropdown" ? true : false,
              })}>
              FILTERS
            </Typography>
            <button className={filterStyles.resetLink} tabIndex={0} aria-label="Reset Filters" onClick={onFilterReset}>
              RESET
            </button>
          </div>
          <div className={filterStyles.filtersSelected} />
        </div>
        {options.filterType === "checkbox" ? this.renderCheckbox(dislayColumns) : this.renderSelect(dislayColumns)}
      </div>
    );
  }
}

export default MUIDataTableFilter;
