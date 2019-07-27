import React from 'react';
import classNames from 'classnames';
import TableRow from '@material-ui/core/TableRow';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';

const defaultHeadRowStyles = createStyles({
  root: {},
});

interface TableHeadRowProps extends WithStyles<typeof defaultHeadRowStyles> {}

class TableHeadRow extends React.Component<TableHeadRowProps> {
  render() {
    const { classes } = this.props;

    return (
      <TableRow
        className={classNames({
          [classes.root]: true,
        })}>
        {this.props.children}
      </TableRow>
    );
  }
}

export default withStyles(defaultHeadRowStyles, { name: 'MUIDataTableHeadRow' })(TableHeadRow);
