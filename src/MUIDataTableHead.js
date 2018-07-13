import React from "react";
import classNames from "classnames";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import MUIDataTableHeadRow from "./MUIDataTableHeadRow";
import MUIDataTableHeadCell from "./MUIDataTableHeadCell";
import MUIDataTableSelectCell from "./MUIDataTableSelectCell";
import { withStyles } from "@material-ui/core/styles";

const defaultHeadStyles = {
  main: {},
  radioButton: {
    "@media screen and (max-width: 960px)": {
      display: "none",
    },
    width: "56px",
  },
  responsiveStacked: {
    "@media screen and (max-width: 960px)": {
      display: "none",
    },
  },
};

class MUIDataTableHead extends React.Component {
  state = {
    activeColumn: null,
  };

  componentDidMount() {
    this.props.handleHeadUpdateRef(this.handleUpdateCheck);
  }

  handleToggleColumn = index => {
    this.setState(() => ({
      activeColumn: index,
    }));
    this.props.toggleSort(index);
  };

  handleRowSelect = () => {
    this.props.selectRowUpdate("head", null);
  };

  render() {
    const { classes, columns, count, options, data, page, selectedRows } = this.props;

    const numSelected = (selectedRows && selectedRows.data.length) || 0;
    const isDeterminate = numSelected > 0 && numSelected < count;
    const isChecked = numSelected === count ? true : false;

    return (
      <TableHead
        className={classNames({ [classes.responsiveStacked]: options.responsive === "stacked", [classes.main]: true })}>
        <MUIDataTableHeadRow>
          {options.selectableRows ? (
            options.radio ? (
              <TableCell className={classes.radioButton} />
            ) : (
              <MUIDataTableSelectCell
                onChange={this.handleRowSelect.bind(null)}
                indeterminate={isDeterminate}
                checked={isChecked}
              />
            )
          ) : (
            false
          )}
          {columns.map(
            (column, index) =>
              column.display ? (
                <MUIDataTableHeadCell
                  key={index}
                  index={index}
                  type={"cell"}
                  sort={column.sort}
                  sortDirection={column.sortDirection}
                  toggleSort={this.handleToggleColumn}
                  options={options}>
                  {column.name}
                </MUIDataTableHeadCell>
              ) : (
                false
              ),
          )}
        </MUIDataTableHeadRow>
      </TableHead>
    );
  }
}

export default withStyles(defaultHeadStyles, { name: "MUIDataTableHead" })(MUIDataTableHead);
