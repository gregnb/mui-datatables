import Chip from '@material-ui/core/Chip';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';

const defaultFilterListStyles = {
  root: {
    display: 'flex',
    justifyContent: 'left',
    flexWrap: 'wrap',
    margin: '0px 16px 0px 16px',
  },
  chip: {
    margin: '8px 8px 0px 0px',
  },
};

class TableFilterList extends React.Component {
  static propTypes = {
    /** Data used to filter table against */
    filterList: PropTypes.array.isRequired,
    /** Filter List value renderers */
    filterListRenderers: PropTypes.array.isRequired,
    /** Columns used to describe table */
    columnNames: PropTypes.PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({ name: PropTypes.string.isRequired, filterType: PropTypes.string }),
      ]),
    ).isRequired,
    /** Callback to trigger filter update */
    onFilterUpdate: PropTypes.func,
    /** Extend the style applied to components */
    classes: PropTypes.object,
  };

  render() {
    const {
      classes,
      filterList,
      filterUpdate,
      filterListRenderers,
      columnNames,
      serverSideFilterList,
      customFilterListUpdate,
    } = this.props;
    const { serverSide } = this.props.options;

    const customFilterChip = (customFilterItem, index, customFilterItemIndex, item, isArray) => {
      let type;

      // If our custom filter list is an array, we need to check for custom update functions to determine
      // default type. Otherwise we use the supplied type in options.
      if (isArray) type = customFilterListUpdate[index] ? 'custom' : 'chip';
      else type = columnNames[index].filterType;

      return (
        <Chip
          label={customFilterItem}
          key={customFilterItemIndex}
          onDelete={filterUpdate.bind(
            null,
            index,
            item[customFilterItemIndex] || [],
            columnNames[index].name,
            type,
            customFilterListUpdate[index],
          )}
          className={classes.chip}
        />
      );
    };

    const filterChip = (index, data, colIndex) => (
      <Chip
        label={filterListRenderers[index](data)}
        key={colIndex}
        onDelete={filterUpdate.bind(null, index, data, columnNames[index].name, 'chip')}
        className={classes.chip}
      />
    );

    const getFilterList = filterList => {
      return filterList.map((item, index) => {
        if (columnNames[index].filterType === 'custom' && filterList[index].length) {
          const filterListRenderersValue = filterListRenderers[index](item);

          if (filterListRenderersValue) {
            if (Array.isArray(filterListRenderersValue)) {
              return filterListRenderersValue.map((customFilterItem, customFilterItemIndex) =>
                customFilterChip(customFilterItem, index, customFilterItemIndex, item, true),
              );
            } else {
              return customFilterChip(filterListRenderersValue, index, index, item, false);
            }
          }
        }

        return item.map((data, colIndex) => filterChip(index, data, colIndex));
      });
    };

    return (
      <div className={classes.root}>{serverSide ? getFilterList(serverSideFilterList) : getFilterList(filterList)}</div>
    );
  }
}

export default withStyles(defaultFilterListStyles, { name: 'MUIDataTableFilterList' })(TableFilterList);
