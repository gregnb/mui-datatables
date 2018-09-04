import React from "react";
import { findDOMNode } from "react-dom";
import classNames from "classnames";
import TableHead from "@material-ui/core/TableHead";
import MUIDataTableHeadRow from "./MUIDataTableHeadRow";
import MUIDataTableHeadCell from "./MUIDataTableHeadCell";
import MUIDataTableSelectCell from "./MUIDataTableSelectCell";
import { withStyles } from "@material-ui/core/styles";

const defaultHeadStyles = {
  main: {},
  responsiveStacked: {
    "@media screen and (max-width: 960px)": {
      display: "none",
    },
  },
};

class MUIDataTableHead extends React.Component {
  componentDidMount() {
    this.props.handleHeadUpdateRef(this.handleUpdateCheck);
  }

  handleToggleColumn = index => {
    this.props.toggleSort(index);
  };

  handleRowSelect = () => {
    this.props.selectRowUpdate("head", null);
  };

  render() {
    const { classes, columns, count, options, data, page, setCellRef, selectedRows } = this.props;

    const numSelected = (selectedRows && selectedRows.data.length) || 0;
    const isDeterminate = numSelected > 0 && numSelected < count;
    const isChecked = numSelected === count ? true : false;

    return (
      <TableHead
        className={classNames({ [classes.responsiveStacked]: options.responsive === "stacked", [classes.main]: true })}>
        <MUIDataTableHeadRow>
          {options.selectableRows && (
            <MUIDataTableSelectCell
              ref={el => setCellRef(0, findDOMNode(el))}
              onChange={this.handleRowSelect.bind(null)}
              indeterminate={isDeterminate}
              checked={isChecked}
            />
          )}
          {columns.map(
            (column, index) =>
              column.display === "true" &&
              (column.customHeadRender ? (
                column.customHeadRender({ index, ...column }, this.handleToggleColumn)
              ) : (
                <MUIDataTableHeadCell
                  key={index}
                  index={index}
                  type={"cell"}
                  ref={el => setCellRef(index + 1, findDOMNode(el))}
                  sort={column.sort}
                  sortDirection={column.sortDirection}
                  toggleSort={this.handleToggleColumn}
                  options={options}>
                  {column.name}
                </MUIDataTableHeadCell>
              )),
          )}
        </MUIDataTableHeadRow>
      </TableHead>
    );
  }
}

export default withStyles(defaultHeadStyles, { name: "MUIDataTableHead" })(MUIDataTableHead);
