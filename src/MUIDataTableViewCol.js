import React from "react";
import PropTypes from "prop-types";
import Checkbox from "material-ui/Checkbox";
import Typography from "material-ui/Typography";
import { FormLabel, FormControl, FormGroup, FormControlLabel, FormHelperText } from "material-ui/Form";
import { withStyles } from "material-ui/styles";

export const defaultViewColStyles = {
  root: {
    padding: "16px 24px 16px 24px",
    fontFamily: "Roboto",
  },
  title: {
    marginLeft: "-7px",
    fontSize: "14px",
    color: "#424242",
    textAlign: "left",
    fontWeight: 500,
  },
  formGroup: {
    marginTop: "8px",
  },
  formControl: {},
  checkbox: {
    color: "#027cb5",
    width: "32px",
    height: "32px",
  },
  label: {
    fontSize: "15px",
    marginLeft: "8px",
    color: "#4a4a4a",
  },
};

class MUIDataTableViewCol extends React.Component {
  static propTypes = {
    /** Columns used to describe table */
    columns: PropTypes.array.isRequired,
    /** Options used to describe table */
    options: PropTypes.object.isRequired,
    /** Callback to trigger View column update */
    onColumnUpdate: PropTypes.func,
    /** Extend the style applied to components */
    classes: PropTypes.object,
  };

  handleColChange = index => {
    this.props.onColumnUpdate(index);
  };

  render() {
    const { classes, columns, options } = this.props;

    return (
      <FormControl component={"fieldset"} className={classes.root} aria-label="Show/Hide Table Columns">
        <Typography variant="caption" className={classes.title}>
          Show Columns
        </Typography>
        <FormGroup className={classes.formGroup}>
          {columns.map((column, index) => {
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
                    onChange={this.handleColChange.bind(null, index)}
                    checked={column.display}
                    value={column.name}
                  />
                }
                label={column.name}
              />
            );
          })}
        </FormGroup>
      </FormControl>
    );
  }
}

export default withStyles(defaultViewColStyles, { name: "MUIDataTableViewCol" })(MUIDataTableViewCol);
