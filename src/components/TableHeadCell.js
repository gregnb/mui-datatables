import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import HelpIcon from '@material-ui/icons/Help';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import MuiTooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles(
  theme => ({
    root: {},
    fixedHeader: {
      position: 'sticky',
      top: '0px',
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
  }),
  { name: 'MUIDataTableHeadCell' },
);

const TableHeadCell = ({
  children,
  options,
  sortDirection,
  sort,
  hint,
  print,
  column,
  cellHeaderProps = {},
  components = {},
  setCellRef,
  index,
  toggleSort,
}) => {
  const classes = useStyles();

  const { className, ...otherProps } = cellHeaderProps;
  const Tooltip = components.Tooltip || MuiTooltip;
  const sortActive = sortDirection !== 'none' && sortDirection !== undefined;
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
    [className]: className,
  });

  const handleKeyboardSortInput = event => {
    if (event.key === 'Enter') {
      toggleSort(index);
    }

    return false;
  };

  const handleSortClick = () => {
    toggleSort(index);
  };

  return (
    <TableCell
      ref={ref => !setCellRef || setCellRef(index + 1, ref)}
      className={cellClass}
      scope={'col'}
      sortDirection={ariaSortDirection}
      {...otherProps}>
      {options.sort && sort ? (
        <span
          role="button"
          onKeyUp={handleKeyboardSortInput}
          onClick={handleSortClick}
          className={classes.toolButton}
          data-testid={`headcol-${index}`}
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
};

TableHeadCell.propTypes = {
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
  /** Injectable component structure **/
  components: PropTypes.object,
};

export default TableHeadCell;
