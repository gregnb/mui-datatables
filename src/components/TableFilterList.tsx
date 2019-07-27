import Chip from '@material-ui/core/Chip';
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles';
import React from 'react';

const defaultFilterListStyles = createStyles({
  root: {
    display: 'flex',
    justifyContent: 'left',
    flexWrap: 'wrap',
    margin: '0px 16px 0px 16px',
  },
  chip: {
    margin: '8px 8px 0px 0px',
  },
});

interface TableFilterListProps extends WithStyles<typeof defaultFilterListStyles> {
  /** Data used to filter table against */
  filterList: any[];
  filterUpdate: any;
  /** Callback to trigger filter update */
  onFilterUpdate: () => void;
  filterListRenderers: ((arg: any) => string)[];
  columnNames: any[];
}

class TableFilterList extends React.Component<TableFilterListProps> {
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
