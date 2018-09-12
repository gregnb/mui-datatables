import React from "react";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import { withStyles } from "@material-ui/core/styles";

const defaultFooterStyles = {
};

class CustomFooter extends React.Component {

  render() {
    const { classes } = this.props;

    return (
    <TableFooter>
      <TableRow>
        <TableCell>
          some content
        </TableCell>
      </TableRow>
    </TableFooter>
    );
  }

}

export default withStyles(defaultFooterStyles, { name: "CustomFooter" })(CustomFooter);
