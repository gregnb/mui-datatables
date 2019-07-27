import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import TableCell, { SortDirection } from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles';
import HelpIcon from '@material-ui/icons/Help';

const defaultHeadCellStyles = (theme: Theme) => createStyles({
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

interface TableHeadCellProps extends WithStyles<typeof defaultHeadCellStyles> {
  /** Options used to describe table */
  options: any,
  /** Current sort direction */
  sortDirection: SortDirection,
  /** Callback to trigger column sort */
  toggleSort: (index: number) => void,
  /** Sort enabled / disabled for this column **/
  sort: boolean
  /** Hint tooltip text */
  hint: string,
  /** Column displayed in print */
  print: boolean,
  index: number;
}

class TableHeadCell extends React.Component<TableHeadCellProps> {

  private handleClickSort: (event: React.KeyboardEvent<HTMLSpanElement>) => void;

  state = {
    isSortTooltipOpen: false,
    isHintTooltipOpen: false,
  };

  handleSortClick = () => {
    this.props.toggleSort(this.props.index);
  };

  render() {
    const { isSortTooltipOpen, isHintTooltipOpen } = this.state;
    const { children, classes, options, sortDirection, sort, hint, print } = this.props;
    const sortActive = sortDirection !== null && sortDirection !== undefined ? true : false;

    const sortLabelProps = {
      classes: { root: classes.sortLabelRoot },
      active: sortActive,
      hideSortIcon: true,
      ...(sortDirection ? { direction: sortDirection } : {}),
    };

    const cellClass = classNames({
      [classes.root]: true,
      [classes.fixedHeader]: options.fixedHeader,
      'datatables-noprint': !print,
    });

    return (
      <TableCell className={cellClass} scope={'col'} sortDirection={sortDirection}>
        {options.sort && sort ? (
          <Tooltip
            title={options.textLabels.body.toolTip}
            placement={'bottom-start'}
            classes={{
              tooltip: classes.tooltip,
              popper: classes.mypopper
            }}
            enterDelay={300}
            open={isSortTooltipOpen}
            onOpen={() =>
              isHintTooltipOpen
                ? this.setState({ isSortTooltipOpen: false })
                : this.setState({ isSortTooltipOpen: true })
            }
            onClose={() => this.setState({ isSortTooltipOpen: false })}>
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
                {hint && (
                  <Tooltip
                    title={hint}
                    placement={'bottom-end'}
                    classes={{
                      tooltip: classes.tooltip,
                      popper: classes.mypopper
                    }}
                    enterDelay={300}
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
                  popper: classes.mypopper
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
