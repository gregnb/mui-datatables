import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';
import HelpIcon from '@material-ui/icons/Help';

const defaultHeadCellStyles = theme => ({
  root: {},
  fixedHeader: {
    position: 'sticky',
    top: '0px',
    left: '0px',
    zIndex: 100,
    backgroundColor: theme.palette.background.paper,
  },
  tooltip: {
    cursor: 'pointer',
  },
  mypopper: {
    '&[data-x-out-of-boundaries]': {
      display: 'none',
    },
  },
  data: {
    display: 'inline-block',
  },
  sortAction: {
    display: 'inline-block',
    verticalAlign: 'top',
    cursor: 'pointer',
    paddingLeft: '4px',
    height: '10px',
  },
  sortActive: {
    color: theme.palette.text.primary,
  },
  toolButton: {
    height: '10px',
    outline: 'none',
    cursor: 'pointer',
  },
});

class TableHeadCell extends React.Component {
  static propTypes = {
    /** Extend the style applied to components */
    classes: PropTypes.object,
    /** Options used to describe table */
    options: PropTypes.object.isRequired,
    /** Current sort direction */
    sortDirection: PropTypes.string,
    /** Callback to trigger column sort */
    toggleSort: PropTypes.func.isRequired,
    /** Sort enabled / disabled for this column **/
    sort: PropTypes.bool.isRequired,
    /** Hint tooltip text */
    hint: PropTypes.string,
  };

  handleSortClick = () => {
    this.props.toggleSort(this.props.index);
  };

  render() {
    const { children, classes, options, sortDirection, sort, hint } = this.props;
    const sortActive = sortDirection !== null && sortDirection !== undefined ? true : false;

    const sortLabelProps = {
      active: sortActive,
      ...(sortDirection ? { direction: sortDirection } : {}),
    };

    const cellClass = classNames({
      [classes.root]: true,
      [classes.fixedHeader]: options.fixedHeader,
    });

    return (
      <TableCell className={cellClass} scope={'col'} sortDirection={sortDirection}>
        {options.sort && sort ? (
          <Tooltip
            title={options.textLabels.body.toolTip}
            placement={'bottom-end'}
            classes={{
              tooltip: classes.tooltip,
            }}
            enterDelay={300}
            classes={{ popper: classes.mypopper }}>
            <span
              role="button"
              onKeyUp={this.handleClickSort}
              onClick={this.handleSortClick}
              className={classes.toolButton}
              tabIndex={0}>
              <div
                className={classNames({
                  [classes.data]: true,
                  [classes.sortActive]: sortActive,
                })}>
                {children}
              </div>
              <div className={classes.sortAction}>
                <TableSortLabel {...sortLabelProps} />
              </div>
            </span>
          </Tooltip>
        ) : (
          children
        )}
        {hint && (
          <Tooltip
            title={hint}
            placement={'bottom-end'}
            classes={{
              tooltip: classes.tooltip,
            }}
            enterDelay={300}
            classes={{ popper: classes.mypopper }}>
            <HelpIcon fontSize="small" />
          </Tooltip>
        )}
      </TableCell>
    );
  }
}

export default withStyles(defaultHeadCellStyles, { name: 'MUIDataTableHeadCell' })(TableHeadCell);
