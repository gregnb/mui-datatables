import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import HelpIcon from '@material-ui/icons/Help';
import MuiTooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import useColumnDrop from '../hooks/useColumnDrop.js';
import { makeStyles } from '@material-ui/styles';
import { useDrag } from 'react-dnd';

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
      cursor: 'pointer',
    },
    dragCursor: {
      cursor: 'grab',
    },
    sortLabelRoot: {
      height: '20px',
    },
    sortActive: {
      color: theme.palette.text.primary,
    },
    toolButton: {
      textTransform: 'none',
      marginLeft: '-8px',
      minWidth: 0,
      marginRight: '8px',
    },
    contentWrapper: {
      display: 'flex',
      alignItems: 'center',
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
  cellHeaderProps = {},
  children,
  colPosition,
  column,
  columns,
  columnOrder = [],
  components = {},
  draggableHeadCellRefs,
  draggingHook,
  hint,
  index,
  options,
  print,
  setCellRef,
  sort,
  sortDirection,
  tableRef,
  tableId,
  timers,
  toggleSort,
  updateColumnOrder,
}) => {
  const [sortTooltipOpen, setSortTooltipOpen] = useState(false);
  const [hintTooltipOpen, setHintTooltipOpen] = useState(false);

  const classes = useStyles();

  const handleKeyboardSortInput = e => {
    if (e.key === 'Enter') {
      toggleSort(index);
    }

    return false;
  };

  const handleSortClick = () => {
    toggleSort(index);
  };

  const [dragging, setDragging] = draggingHook ? draggingHook : [];

  const { className, ...otherProps } = cellHeaderProps;
  const Tooltip = components.Tooltip || MuiTooltip;
  const sortActive = sortDirection !== 'none' && sortDirection !== undefined;
  const ariaSortDirection = sortDirection === 'none' ? false : sortDirection;

  const isDraggingEnabled = () => {
    if (!draggingHook) return false;
    return options.draggableColumns && options.draggableColumns.enabled && column.draggable !== false;
  };

  const sortLabelProps = {
    classes: { root: classes.sortLabelRoot },
    tabIndex: -1,
    active: sortActive,
    hideSortIcon: true,
    ...(ariaSortDirection ? { direction: sortDirection } : {}),
  };

  const [{ opacity }, dragRef, preview] = useDrag({
    item: {
      type: 'HEADER',
      colIndex: index,
      headCellRefs: draggableHeadCellRefs,
    },
    begin: monitor => {
      setTimeout(() => {
        setHintTooltipOpen(false);
        setSortTooltipOpen(false);
        setDragging(true);
      }, 0);
      return null;
    },
    end: (item, monitor) => {
      setDragging(false);
    },
    collect: monitor => {
      return {
        opacity: monitor.isDragging() ? 1 : 0,
      };
    },
  });

  const [drop] = useColumnDrop({
    drop: (item, mon) => {
      setSortTooltipOpen(false);
      setHintTooltipOpen(false);
      setDragging(false);
    },
    index,
    headCellRefs: draggableHeadCellRefs,
    updateColumnOrder,
    columnOrder,
    columns,
    transitionTime: options.draggableColumns ? options.draggableColumns.transitionTime : 300,
    tableRef: tableRef ? tableRef() : null,
    tableId: tableId || 'none',
    timers,
  });

  const cellClass = clsx({
    [classes.root]: true,
    [classes.fixedHeader]: options.fixedHeader,
    'datatables-noprint': !print,
    [className]: className,
  });

  const showHintTooltip = () => {
    setSortTooltipOpen(false);
    setHintTooltipOpen(true);
  };

  const getTooltipTitle = () => {
    if (dragging) return '';
    if (!options.textLabels) return '';
    return options.textLabels.body.columnHeaderTooltip
      ? options.textLabels.body.columnHeaderTooltip(column)
      : options.textLabels.body.toolTip;
  };

  const closeTooltip = () => {
    setSortTooltipOpen(false);
  };

  return (
    <TableCell
      ref={ref => {
        drop && drop(ref);
        setCellRef && setCellRef(index + 1, colPosition + 1, ref);
      }}
      className={cellClass}
      scope={'col'}
      sortDirection={ariaSortDirection}
      data-colindex={index}
      data-tableid={tableId}
      onMouseDown={closeTooltip}
      {...otherProps}>
      {options.sort && sort ? (
        <span className={classes.contentWrapper}>
          <Tooltip
            title={getTooltipTitle()}
            placement="bottom"
            open={sortTooltipOpen}
            onOpen={() => (dragging ? setSortTooltipOpen(false) : setSortTooltipOpen(true))}
            onClose={() => setSortTooltipOpen(false)}
            classes={{
              tooltip: classes.tooltip,
              popper: classes.mypopper,
            }}>
            <Button
              variant="text"
              onKeyUp={handleKeyboardSortInput}
              onClick={handleSortClick}
              className={classes.toolButton}
              data-testid={`headcol-${index}`}
              ref={isDraggingEnabled() ? dragRef : null}>
              <div className={classes.sortAction}>
                <div
                  className={clsx({
                    [classes.data]: true,
                    [classes.sortActive]: sortActive,
                    [classes.dragCursor]: isDraggingEnabled(),
                  })}>
                  {children}
                </div>
                <div className={classes.sortAction}>
                  <TableSortLabel {...sortLabelProps} />
                </div>
              </div>
            </Button>
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
        <div className={hint ? classes.sortAction : null} ref={isDraggingEnabled() ? dragRef : null}>
          {children}
          {hint && (
            <Tooltip
              title={hint}
              placement={'bottom-end'}
              open={hintTooltipOpen}
              onOpen={() => showHintTooltip()}
              onClose={() => setHintTooltipOpen(false)}
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
