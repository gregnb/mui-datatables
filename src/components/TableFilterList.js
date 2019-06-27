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
    const { classes, filterList, filterUpdate, filterListRenderers, columnNames } = this.props;

    return (
      <div className={classes.root}>
        {filterList.map((item, index) => {
          if (columnNames[index].filterType === 'custom' && filterListRenderers[index](item)) {
            return (
              <Chip
                label={filterListRenderers[index](item)}
                key={index}
                onDelete={filterUpdate.bind(null, index, [], columnNames[index].name, columnNames[index].filterType)}
                className={classes.chip}
              />
            );
          }

          return item.map((data, colIndex) => (
            <Chip
              label={filterListRenderers[index](data)}
              key={colIndex}
              onDelete={filterUpdate.bind(null, index, data, columnNames[index].name, 'checkbox')}
              className={classes.chip}
            />
          ));
        })}
      </div>
    );
  }
}

export default withStyles(defaultFilterListStyles, { name: 'MUIDataTableFilterList' })(TableFilterList);
