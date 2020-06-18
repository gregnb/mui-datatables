import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import HelpIcon from '@material-ui/icons/Help';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, {useState,useEffect} from 'react';
import MuiTooltip from '@material-ui/core/Tooltip';
import {useDrop, useDrag} from 'react-dnd';
import useColumnDrop from '../hooks/useColumnDrop.js';

const useStyles = makeStyles(theme => ({
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
  dragCursor: {
    cursor: 'grab'
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
}), { name: 'MUIDataTableHeadCell'});

function TableHeadCell(props) {

  const [sortTooltipOpen, setSortTooltipOpen] = useState(false);
  const [hintTooltipOpen, setHintTooltipOpen] = useState(false);
  
  const classes = useStyles();

  const handleKeyboardSortinput = e => {
    if (e.key === 'Enter') {
      props.toggleSort(props.index);
    }

    return false;
  };

  const handleSortClick = () => {
    props.toggleSort(props.index);
  };

  const {
    children,
    options,
    sortDirection,
    sort,
    hint,
    index,
    colPosition,
    print,
    column,
    updateColumnOrder,
    columnOrder = [],
    setCellRef,
    cellHeaderProps = {},
    draggableHeadCellRefs,
    tableRef,
    timers,
    components = {},
  } = props;
  const [dragging, setDragging] = props.draggingHook ? props.draggingHook : [];

  const { className, ...otherProps } = cellHeaderProps;
  const Tooltip = components.Tooltip || MuiTooltip;
  const sortActive = sortDirection !== 'none' && sortDirection !== undefined ? true : false;
  const ariaSortDirection = sortDirection === 'none' ? false : sortDirection;

  const sortLabelProps = {
    classes: { root: classes.sortLabelRoot },
    active: sortActive,
    hideSortIcon: true,
    ...(ariaSortDirection ? { direction: sortDirection } : {}),
  };

  const [{opacity}, dragRef, preview] = useDrag({
    item: {
      type: 'HEADER',
      colIndex: index
    },
    begin: (monitor) => {
      setHintTooltipOpen(false);
      setSortTooltipOpen(false);
      setDragging(true);
      return null;
    },
    end: (item, monitor) => {
      setDragging(false);
    },
    collect: monitor => {
      return {
        opacity: monitor.isDragging() ? 1 : 0,
      };
    }
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
    transitionTime: options.draggableColumns ? options.draggableColumns.transitionTime : 300,
    tableRef: tableRef ? tableRef() : null,
    timers
  });

  const isDraggingEnabled = () => {
    if (!props.draggingHook) return false;
    return options.draggableColumns && options.draggableColumns.enabled && column.draggable !== false;
  };

  const cellClass = classNames({
    [classes.root]: true,
    [classes.fixedHeader]: options.fixedHeader,
    'datatables-noprint': !print,
    [className]: className,
  });

  const showHintTooltip = () => {
    setSortTooltipOpen(false);
    setHintTooltipOpen(true);
  };

  let refProp = {};
  refProp.ref = el => {
    drop(el);
    setCellRef && setCellRef(index + 1, colPosition + 1, el);
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
    setDragging(true);
  };

  return (
    <TableCell className={cellClass} scope={'col'} sortDirection={ariaSortDirection} data-colindex={index} {...refProp} onMouseDown={closeTooltip} {...otherProps}>
      {options.sort && sort ? (
        <span
          role="button"
          onKeyUp={handleKeyboardSortinput}
          onClick={handleSortClick}
          className={classes.toolButton}
          data-testid={'headcol-' + props.index}
          ref={isDraggingEnabled() ? dragRef : null}
          tabIndex={0}>
          <Tooltip
            title={getTooltipTitle()}
            placement={'bottom-start'}
            open={sortTooltipOpen}
            onOpen={() => dragging ? setSortTooltipOpen(false) : setSortTooltipOpen(true)}
            onClose={() => setSortTooltipOpen(false)}
            classes={{
              tooltip: classes.tooltip,
              popper: classes.mypopper,
            }}>
            <div className={classes.sortAction}>
              <div
                className={classNames({
                  [classes.data]: true,
                  [classes.sortActive]: sortActive,
                  [classes.dragCursor]: isDraggingEnabled
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
}

TableHeadCell.propTypes = {
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
  /** Injectable component structure **/
  components: PropTypes.object,
};

export default TableHeadCell;
