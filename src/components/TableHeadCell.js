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

  state = {
    isSortTooltipOpen: false,
    isHintTooltipOpen: false,
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
    const { isSortTooltipOpen, isHintTooltipOpen } = this.state;
    const { children, classes, options, sortDirection, sort, hint, print, column } = this.props;
    const sortActive = sortDirection !== 'none' && sortDirection !== undefined ? true : false;
    const ariaSortDirection = sortDirection === 'none' ? false : sortDirection;

    const sortLabelProps = {
      classes: { root: classes.sortLabelRoot },
      active: sortActive,
      hideSortIcon: true,
      ...(ariaSortDirection ? { direction: sortDirection } : {}),
    };

    const cellClass = classNames({
      [classes.root]: true,
      [classes.fixedHeader]: options.fixedHeader,
      'datatables-noprint': !print,
    });

    return (
      <TableCell className={cellClass} scope={'col'} sortDirection={ariaSortDirection}>
        {options.sort && sort ? (
          <Tooltip
            title={
              options.textLabels.body.columnHeaderTooltip
                ? options.textLabels.body.columnHeaderTooltip(column)
                : options.textLabels.body.toolTip
            }
            placement={'bottom-start'}
            classes={{
              tooltip: classes.tooltip,
            }}
            enterDelay={300}
            classes={{ popper: classes.mypopper }}
            open={isSortTooltipOpen}
            onOpen={() =>
              isHintTooltipOpen
                ? this.setState({ isSortTooltipOpen: false })
                : this.setState({ isSortTooltipOpen: true })
            }
            onClose={() => this.setState({ isSortTooltipOpen: false })}>
            <span
              role="button"
              onKeyUp={this.handleKeyboardSortinput}
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
                {hint && (
                  <Tooltip
                    title={hint}
                    placement={'bottom-end'}
                    classes={{
                      tooltip: classes.tooltip,
                    }}
                    enterDelay={300}
                    classes={{ popper: classes.mypopper }}
                    open={isHintTooltipOpen}
                    onOpen={() => this.setState({ isSortTooltipOpen: false, isHintTooltipOpen: true })}
                    onClose={() => this.setState({ isHintTooltipOpen: false })}>
                    <HelpIcon
                      className={!sortActive ? classes.hintIconAlone : classes.hintIconWithSortIcon}
                      fontSize="small"
                    />
                  </Tooltip>
                )}
              </div>
            </span>
          </Tooltip>
        ) : (
          <div className={classes.sortAction}>
            {children}
            {hint && (
              <Tooltip
                title={hint}
                placement={'bottom-end'}
                classes={{
                  tooltip: classes.tooltip,
                }}
                enterDelay={300}
                classes={{ popper: classes.mypopper }}>
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
