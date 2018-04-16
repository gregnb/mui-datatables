import React from "react";
import classNames from "classnames";
import { TableHead } from "material-ui/Table";
import MUIDataTableHeadRow from "./MUIDataTableHeadRow";
import MUIDataTableHeadCell from "./MUIDataTableHeadCell";
import MUIDataTableSelectCell from "./MUIDataTableSelectCell";
import { withStyles } from "material-ui/styles";

const defaultHeadStyles = {
  main: {},
  responsiveStacked: {
    "@media screen and (max-width: 960px)": {
      display: "none",
    },
  },
};

class MUIDataTableHead extends React.Component {
  state = {
    activeColumn: null,
    selectChecked: false,
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
    this.setState(
      prevState => ({
        selectChecked: !prevState.selectChecked,
      }),
      () => this.props.selectRowUpdate("head", this.state.selectChecked),
    );
  };

  handleUpdateCheck = status => {
    this.setState(() => ({
      selectChecked: status,
    }));
  };

  render() {
    const { classes, columns, options } = this.props;
    const { selectChecked } = this.state;

    return (
      <TableHead className={classNames({ [classes.responsiveStacked]: options.responsive==="stacked", [classes.main]: true })}>
        <MUIDataTableHeadRow>
          {options.selectableRows ? (
            <MUIDataTableSelectCell onChange={this.handleRowSelect.bind(null)} checked={selectChecked} />
          ) : (
            false
          )}
          {columns.map(
            (column, index) =>
              column.display ? (
                <MUIDataTableHeadCell
                  key={index}
                  index={index}
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
