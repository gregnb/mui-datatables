import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles';

export const defaultViewColStyles = (theme: Theme) =>
  createStyles({
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

interface TableViewColProps extends WithStyles<typeof defaultViewColStyles> {
  /** Columns used to describe table */
  columns: any[];
  /** Options used to describe table */
  options: any;
  /** Callback to trigger View column update */
  onColumnUpdate: (index: number) => void;
  data: any;
}

class TableViewCol extends React.Component<TableViewColProps> {
  handleColChange = index => {
    this.props.onColumnUpdate(index);
  };

  render() {
    const { classes, columns, options } = this.props;
    const textLabels = options.textLabels.viewColumns;

    return (
      <FormControl
        // TODO fix this ignore statement.
        // @ts-ignore
        component="fieldset"
        className={classes.root}
        aria-label={textLabels.titleAria}>
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
                    <Checkbox
                      className={classes.checkbox}
                      classes={{
                        root: classes.checkboxRoot,
                        checked: classes.checked,
                      }}
                      onChange={this.handleColChange.bind(null, index)}
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
      </FormControl>
    );
  }
}

export default withStyles(defaultViewColStyles, { name: 'MUIDataTableViewCol' })(TableViewCol);
