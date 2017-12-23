import React from "react";
import PropTypes from "prop-types";
import Checkbox from "material-ui/Checkbox";
import Typography from "material-ui/Typography";
import { FormLabel, FormControl, FormGroup, FormControlLabel, FormHelperText } from "material-ui/Form";

class MUIDataTableViewCol extends React.Component {
  static propTypes = {
    /** Columns used to describe table */
    columns: PropTypes.array.isRequired,
    /** Options used to describe table */
    options: PropTypes.object.isRequired,
    /** Callback to trigger View column update */
    onColumnUpdate: PropTypes.func,
    /** Extend the style applied to components */
    viewColStyles: PropTypes.object,
  };

  handleColChange = index => {
    this.props.onColumnUpdate(index);
  };

  render() {
    const { classes, columns, options, viewColStyles } = this.props;

    return (
      <FormControl component={"fieldset"} className={viewColStyles.root}>
        <Typography type="caption" className={viewColStyles.title}>
          Show Columns
        </Typography>
        <FormGroup className={viewColStyles.formGroup}>
          {columns.map((column, index) => {
            return (
              <FormControlLabel
                key={index}
                classes={{
                  root: viewColStyles.formControl,
                  label: viewColStyles.label,
                }}
                control={
                  <Checkbox
                    className={viewColStyles.checkbox}
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

export default MUIDataTableViewCol;
