import React from "react";
import PropTypes from "prop-types";
import Chip from "material-ui/Chip";
import { getStyle, DataStyles } from "./DataStyles";

const defaultFilterListStyles = {
  root: {
    display: "flex",
    justifyContent: "left",
    flexWrap: "wrap",
    margin: "0px 16px 0px 16px",
  },
  chip: {
    margin: "8px 8px 0px 0px",
  },
};

class MUIDataTableFilterList extends React.Component {
  static propTypes = {
    /** Data used to filter table against */
    filterList: PropTypes.array.isRequired,
    /** Callback to trigger filter update */
    onFilterUpdate: PropTypes.func,
  };

  render() {
    const { filterList, filterUpdate, options } = this.props;

    return (
      <DataStyles
        defaultStyles={defaultFilterListStyles}
        name="MUIDataTableFilterList"
        styles={getStyle(options, "table.filterList")}>
        {filterListStyles => (
          <div className={filterListStyles.root}>
            {filterList.map((item, index) =>
              item.map((data, colIndex) => (
                <Chip
                  label={data}
                  key={colIndex}
                  onDelete={filterUpdate.bind(null, index, data, "checkbox")}
                  className={filterListStyles.chip}
                />
              )),
            )}
          </div>
        )}
      </DataStyles>
    );
  }
}

export default MUIDataTableFilterList;
