import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';
import HelpIcon from '@material-ui/icons/Help';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

const defaultHeadCellStyles = theme => ({
  root: {},
  fixedHeader: {
    position: 'sticky',
    top: '0px',
    left: '0px',
    zIndex: 100,
    backgroundColor: theme.palette.background.paper,
  },
  fixedHeaderCommon: {
    position: 'sticky',
    zIndex: 100,
    backgroundColor: theme.palette.background.paper,
  },
  fixedHeaderXAxis: {
    left: '0px',
  },
  fixedHeaderYAxis: {
    top: '0px',
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
    display: 'flex',
    verticalAlign: 'top',
    cursor: 'pointer',
  },
  sortLabelRoot: {
    height: '10px',
  },
  sortActive: {
    color: theme.palette.text.primary,
  },
  toolButton: {
    display: 'flex',
    outline: 'none',
    cursor: 'pointer',
  },
  hintIconAlone: {
    marginTop: '-3px',
    marginLeft: '3px',
  },
  hintIconWithSortIcon: {
    marginTop: '-3px',
  },
});

class TableHeadCell extends React.Component {
  static propTypes = {
    /** Extend the style applied to components */
    classes: PropTypes.object,
    /** Options used to describe table */
    options: PropTypes.object.isRequired,
    /** Current sort direction */
    sortDirection: PropTypes.oneOf(['asc', 'desc', 'none']),
    /** Callback to trigger column sort */
    toggleSort: PropTypes.func.isRequired,
    /** Sort enabled / disabled for this column **/
    sort: PropTypes.bool.isRequired,
    /** Hint tooltip text */
    hint: PropTypes.string,
    /** Column displayed in print */
    print: PropTypes.bool.isRequired,
    /** Optional to be used with `textLabels.body.columnHeaderTooltip` */
    column: PropTypes.object,
  };

  handleKeyboardSortinput = e => {
    if (e.key === 'Enter') {
      this.props.toggleSort(this.props.index);
    }

    return false;
  };

  handleSortClick = () => {
    this.props.toggleSort(this.props.index);
  };

  render() {
    const { children, classes, options, sortDirection, sort, hint, print, column, cellHeaderProps = {} } = this.props;
    const { className, ...otherProps } = cellHeaderProps;

    const sortActive = sortDirection !== 'none' && sortDirection !== undefined ? true : false;
    const ariaSortDirection = sortDirection === 'none' ? false : sortDirection;
    let fixedHeaderClasses;

    const sortLabelProps = {
      classes: { root: classes.sortLabelRoot },
      active: sortActive,
      hideSortIcon: true,
      ...(ariaSortDirection ? { direction: sortDirection } : {}),
    };

    // DEPRECATED, make sure to replace defaults with new options when removing
    if (options.fixedHeader) fixedHeaderClasses = classes.fixedHeader;

    if (options.fixedHeaderOptions) {
      fixedHeaderClasses = classes.fixedHeaderCommon;
      if (options.fixedHeaderOptions.xAxis) fixedHeaderClasses += ` ${classes.fixedHeaderXAxis}`;
      if (options.fixedHeaderOptions.yAxis) fixedHeaderClasses += ` ${classes.fixedHeaderYAxis}`;
    }

    const cellClass = classNames({
      [classes.root]: true,
      [fixedHeaderClasses]: true,
      'datatables-noprint': !print,
      [className]: className,
    });

    return (
      <TableCell className={cellClass} scope={'col'} sortDirection={ariaSortDirection} {...otherProps}>
        {options.sort && sort ? (
          <span
            role="button"
            onKeyUp={this.handleKeyboardSortinput}
            onClick={this.handleSortClick}
            className={classes.toolButton}
            tabIndex={0}>
            <Tooltip
              title={
                options.textLabels.body.columnHeaderTooltip
                  ? options.textLabels.body.columnHeaderTooltip(column)
                  : options.textLabels.body.toolTip
              }
              placement={'bottom-start'}
              classes={{
                tooltip: classes.tooltip,
                popper: classes.mypopper,
              }}>
              <div className={classes.sortAction}>
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
              </div>
            </Tooltip>
            {hint && (
              <Tooltip title={hint}>
                <HelpIcon
                  className={!sortActive ? classes.hintIconAlone : classes.hintIconWithSortIcon}
                  fontSize="small"
                />
              </Tooltip>
            )}
          </span>
        ) : (
          <div className={hint ? classes.sortAction : null}>
            {children}
            {hint && (
              <Tooltip
                title={hint}
                placement={'bottom-end'}
                classes={{
                  tooltip: classes.tooltip,
                  popper: classes.mypopper,
                }}
                enterDelay={300}>
                <HelpIcon className={classes.hintIconAlone} fontSize="small" />
              </Tooltip>
            )}
          </div>
        )}
      </TableCell>
    );
  }
}

export default withStyles(defaultHeadCellStyles, { name: 'MUIDataTableHeadCell' })(TableHeadCell);
