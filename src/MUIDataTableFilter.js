import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import { withStyles } from "@material-ui/core/styles";

export const defaultFilterStyles = {
  root: {
    padding: "16px 24px 16px 24px",
    fontFamily: "Roboto",
  },
  header: {
    flex: "0 0 auto",
    marginBottom: "16px",
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
  },
  title: {
    display: "inline-block",
    marginLeft: "7px",
    color: "#424242",
    fontSize: "14px",
    fontWeight: 500,
  },
  noMargin: {
    marginLeft: "0px",
  },
  reset: {
    alignSelf: "left",
  },
  resetLink: {
    color: "#027cb5",
    backgroundColor: "#FFF",
    display: "inline-block",
    marginLeft: "24px",
    fontSize: "12px",
    cursor: "pointer",
    border: "none",
    "&:hover": {
      color: "#FF0000",
    },
  },
  filtersSelected: {
    alignSelf: "right",
  },
  /* checkbox */
  checkboxList: {
    flex: "1 1 100%",
    display: "inline-flex",
    marginRight: "24px",
  },
  checkboxListTitle: {
    marginLeft: "7px",
    marginBottom: "8px",
    fontSize: "14px",
    color: "#424242",
    textAlign: "left",
    fontWeight: 500,
  },
  checkboxFormGroup: {
    marginTop: "8px",
  },
  checkboxFormControl: {
    margin: "0px",
  },
  checkboxFormControlLabel: {
    fontSize: "15px",
    marginLeft: "8px",
    color: "#4a4a4a",
  },
  checkboxIcon: {
    //color: "#027cb5",
    width: "32px",
    height: "32px",
  },
  checkbox: {
    "&$checked": {
      color: "#027cB5",
    },
  },
  checked: {},
  /* selects */
  selectRoot: {
    display: "flex",
    marginTop: "16px",
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    height: "80%",
    justifyContent: "space-between",
  },
  selectFormControl: {
    flex: "1 1 calc(50% - 24px)",
    marginRight: "24px",
    marginBottom: "24px",
  },
};

class MUIDataTableFilter extends React.PureComponent {
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

  handleCheckboxChange = (index, column) => {
    this.props.onFilterUpdate(index, column, "checkbox");
  };

  handleDropdownChange = (index, value) => {
    value = value === this.props.options.textLabels.filter.all ? "" : value;
    this.props.onFilterUpdate(index, value, "dropdown");
  };

  handleMultiselectChange = (index, column) => {
    this.props.onFilterUpdate(index, column, "multiselect");
  };

  renderCheckbox(columns) {
    const { classes, filterData, filterList } = this.props;

    return columns.map((column, index) =>
      column.filter ? (
        <div className={classes.checkboxList} key={index}>
          <FormGroup>
            <Typography variant="caption" className={classes.checkboxListTitle}>
              {column.name}
            </Typography>
            {filterData[index].map((filterColumn, filterIndex) => (
              <FormControlLabel
                key={filterIndex}
                classes={{
                  root: classes.checkboxFormControl,
                  label: classes.checkboxFormControlLabel,
                }}
                control={
                  <Checkbox
                    className={classes.checkboxIcon}
                    onChange={this.handleCheckboxChange.bind(null, index, filterColumn)}
                    checked={filterList[index].indexOf(filterColumn) >= 0 ? true : false}
                    classes={{
                      root: classes.checkbox,
                      checked: classes.checked,
                    }}
                    value={filterColumn !== null ? filterColumn.toString() : ""}
                  />
                }
                label={filterColumn}
              />
            ))}
          </FormGroup>
        </div>
      ) : (
        false
      ),
    );
  }

  renderSelectItem(column, index) {
    const { classes, filterData, filterList, options } = this.props;
    const textLabels = options.textLabels.filter;
    const filterValues = filterList[index].map(x => (x ? x.props.rawValue : undefined));

    if (column.customFilterRender) {
      return column.customFilterRender(
        filterValues,
        value => this.handleDropdownChange(index, value),
        classes.selectFormControl,
      );
    }

    return (
      <FormControl className={classes.selectFormControl} key={index}>
        <InputLabel htmlFor={column.name}>{column.name}</InputLabel>
        <Select
          value={filterValues.toString() || textLabels.all}
          name={column.name}
          onChange={event => this.handleDropdownChange(index, event.target.value)}
          input={<Input name={column.name} id={column.name} />}>
          <MenuItem value={textLabels.all} key={0}>
            {textLabels.all}
          </MenuItem>
          {filterData[index].map((filterColumn, filterIndex) => (
            <MenuItem value={filterColumn} key={filterIndex + 1}>
              {filterColumn !== null ? filterColumn.toString() : ""}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  renderSelect(columns) {
    const { classes } = this.props;

    return (
      <div className={classes.selectRoot}>
        {columns.map((column, index) => column.filter && this.renderSelectItem(column, index))}
      </div>
    );
  }

  renderMultiselectItem(column, index) {
    const { classes, filterData, filterList } = this.props;
    const filterValues = filterList[index].map(x => (x ? x.props.rawValue : undefined));

    if (column.customFilterRender) {
      return column.customFilterRender(
        filterValues,
        value => this.handleMultiselectChange(index, value),
        classes.selectFormControl,
      );
    }

    return (
      <FormControl className={classes.selectFormControl} key={index}>
        <InputLabel htmlFor={column.name}>{column.name}</InputLabel>
        <Select
          multiple
          value={filterValues || []}
          renderValue={selected => selected.join(", ")}
          name={column.name}
          onChange={event => this.handleMultiselectChange(index, event.target.value)}
          input={<Input name={column.name} id={column.name} />}>
          {filterData[index].map((filterColumn, filterIndex) => (
            <MenuItem value={filterColumn} key={filterIndex + 1}>
              <Checkbox
                checked={filterValues.indexOf(filterColumn) >= 0 ? true : false}
                value={filterColumn.toString()}
                className={classes.checkboxIcon}
                classes={{
                  root: classes.checkbox,
                  checked: classes.checked,
                }}
              />
              <ListItemText primary={filterColumn} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  renderMultiselect(columns) {
    const { classes } = this.props;

    return (
      <div className={classes.selectRoot}>
        {columns.map((column, index) => column.filter && this.renderMultiselectItem(column, index))}
      </div>
    );
  }

  renderFilters(type, columns) {
    switch (type) {
      case "checkbox":
        return this.renderCheckbox(columns);
      case "multiselect":
        return this.renderMultiselect(columns);
      default:
        return this.renderSelect(columns);
    }
  }

  render() {
    const { classes, columns, options, onFilterReset } = this.props;
    const textLabels = options.textLabels.filter;

    return (
      <div className={classes.root}>
        <div className={classes.header}>
          <div className={classes.reset}>
            <Typography
              variant="caption"
              className={classNames({
                [classes.title]: true,
                [classes.noMargin]: options.filterType !== "checkbox" ? true : false,
              })}>
              {textLabels.title}
            </Typography>
            <button className={classes.resetLink} tabIndex={0} aria-label={textLabels.reset} onClick={onFilterReset}>
              {textLabels.reset}
            </button>
          </div>
          <div className={classes.filtersSelected} />
        </div>
        {this.renderFilters(options.filterType, columns)}
      </div>
    );
  }
}

export default withStyles(defaultFilterStyles, { name: "MUIDataTableFilter" })(MUIDataTableFilter);
