import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'tss-react/mui';

const defaultResizeStyles = {
  root: {
    position: 'absolute',
  },
  resizer: {
    position: 'absolute',
    width: '1px',
    height: '100%',
    left: '100px',
    cursor: 'ew-resize',
    border: '0.1px solid rgba(224, 224, 224, 1)',
  },
};

function getParentOffsetLeft(tableEl) {
  let ii = 0,
    parentOffsetLeft = 0,
    offsetParent = tableEl.offsetParent;
  while (offsetParent) {
    parentOffsetLeft = parentOffsetLeft + (offsetParent.offsetLeft || 0) - (offsetParent.scrollLeft || 0);
    offsetParent = offsetParent.offsetParent;
    ii++;
    if (ii > 1000) break;
  }
  return parentOffsetLeft;
}

class TableResize extends React.Component {
  static propTypes = {
    /** Extend the style applied to components */
    classes: PropTypes.object,
  };

  state = {
    resizeCoords: {},
    priorPosition: {},
    tableWidth: '100%',
    tableHeight: '100%',
  };

  handleResize = () => {
    if (window.innerWidth !== this.windowWidth) {
      this.windowWidth = window.innerWidth;
      this.setDividers();
    }
  };

  componentDidMount() {
    this.minWidths = [];
    this.windowWidth = null;
    this.props.setResizeable(this.setCellRefs);
    this.props.updateDividers(() => this.setState({ updateCoords: true }, () => this.updateWidths));
    window.addEventListener('resize', this.handleResize, false);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize, false);
  }

  setCellRefs = (cellsRef, tableRef) => {
    this.cellsRef = cellsRef;
    this.tableRef = tableRef;
    this.setDividers();
  };

  setDividers = () => {
    const tableEl = this.tableRef;
    const { width: tableWidth, height: tableHeight } = tableEl.getBoundingClientRect();
    const { resizeCoords } = this.state;

    for (let prop in resizeCoords) {
      delete resizeCoords[prop];
    }

    let parentOffsetLeft = getParentOffsetLeft(tableEl);
    let finalCells = Object.entries(this.cellsRef);
    let cellMinusOne = finalCells.filter((_item, ix) => ix + 1 < finalCells.length);

    cellMinusOne.forEach(([key, item], idx) => {
      if (!item) return;
      let elRect = item.getBoundingClientRect();
      let left = elRect.left;
      left = (left || 0) - parentOffsetLeft;
      const elStyle = window.getComputedStyle(item, null);
      resizeCoords[key] = { left: left + item.offsetWidth };
    });
    this.setState({ tableWidth, tableHeight, resizeCoords }, this.updateWidths);
  };

  updateWidths = () => {
    let lastPosition = 0;
    const { resizeCoords, tableWidth } = this.state;

    Object.entries(resizeCoords).forEach(([key, item]) => {
      let newWidth = Number(((item.left - lastPosition) / tableWidth) * 100);

      /*
        Using .toFixed(2) causes the columns to jitter when resized. On all browsers I (patrojk) have tested,
        a width with a floating point decimal works fine. It's unclear to me why the numbers were being rouned.
        However, I'm putting in an undocumented escape hatch to use toFixed in case the change introduces a bug.
        The below code will be removed in a later release if no problems with non-rounded widths are reported.
      */
      if (typeof this.props.resizableColumns === 'object' && this.props.resizableColumns.roundWidthPercentages) {
        newWidth = newWidth.toFixed(2);
      }

      lastPosition = item.left;

      const thCell = this.cellsRef[key];
      if (thCell) thCell.style.width = newWidth + '%';
    });
  };

  onResizeStart = (id, e) => {
    const tableEl = this.tableRef;
    const originalWidth = tableEl.style.width;
    let lastColumn = 0;
    tableEl.style.width = '1px';

    let finalCells = Object.entries(this.cellsRef);
    finalCells.forEach(([key, item], idx) => {
      let elRect = item ? item.getBoundingClientRect() : { width: 0, left: 0 };
      this.minWidths[key] = elRect.width;
      lastColumn = Math.max(key, lastColumn);
    });
    tableEl.style.width = originalWidth;

    this.setState({ isResize: true, id, lastColumn });
  };

  onResizeMove = (id, e) => {
    const { isResize, resizeCoords, lastColumn } = this.state;

    const prevCol = id => {
      let nextId = id - 1;
      while (typeof resizeCoords[nextId] === 'undefined' && nextId >= 0) {
        nextId--;
      }
      return nextId;
    };
    const nextCol = id => {
      let nextId = id + 1;
      let tries = 0;
      while (typeof resizeCoords[nextId] === 'undefined' && tries < 20) {
        nextId++;
        tries++;
      }
      return nextId;
    };

    const fixedMinWidth1 = this.minWidths[id];
    const fixedMinWidth2 = this.minWidths[nextCol(parseInt(id, 10))] || this.minWidths[id];
    const idNumber = parseInt(id, 10);
    const finalCells = Object.entries(this.cellsRef);
    const tableEl = this.tableRef;
    const { width: tableWidth, height: tableHeight } = tableEl.getBoundingClientRect();
    const { selectableRows } = this.props.options;

    let parentOffsetLeft = getParentOffsetLeft(tableEl);

    const nextCoord = id => {
      let nextId = id + 1;
      let tries = 0;
      while (typeof resizeCoords[nextId] === 'undefined' && tries < 20) {
        nextId++;
        tries++;
      }
      return resizeCoords[nextId];
    };
    const prevCoord = id => {
      let nextId = id - 1;
      while (typeof resizeCoords[nextId] === 'undefined' && nextId >= 0) {
        nextId--;
      }
      return resizeCoords[nextId];
    };

    if (isResize) {
      let leftPos = e.clientX - parentOffsetLeft;

      const handleMoveRightmostBoundary = (leftPos, tableWidth, fixedMinWidth) => {
        if (leftPos > tableWidth - fixedMinWidth) {
          return tableWidth - fixedMinWidth;
        }
        return leftPos;
      };

      const handleMoveLeftmostBoundary = (leftPos, fixedMinWidth) => {
        if (leftPos < fixedMinWidth) {
          return fixedMinWidth;
        }
        return leftPos;
      };

      const handleMoveRight = (leftPos, resizeCoords, id, fixedMinWidth) => {
        if (typeof nextCoord(id) === 'undefined') return leftPos;
        if (leftPos > nextCoord(id).left - fixedMinWidth) {
          return nextCoord(id).left - fixedMinWidth;
        }
        return leftPos;
      };

      const handleMoveLeft = (leftPos, resizeCoords, id, fixedMinWidth) => {
        if (typeof prevCoord(id) === 'undefined') return leftPos;
        if (leftPos < prevCoord(id).left + fixedMinWidth) {
          return prevCoord(id).left + fixedMinWidth;
        }
        return leftPos;
      };

      const isFirstColumn = (selectableRows, id) => {
        let firstColumn = 1;
        while (!resizeCoords[firstColumn] && firstColumn < 20) {
          firstColumn++;
        }

        return (selectableRows !== 'none' && id === 0) || (selectableRows === 'none' && id === firstColumn);
      };

      const isLastColumn = (id, finalCells) => {
        return id === prevCol(lastColumn);
      };

      if (isFirstColumn(selectableRows, idNumber) && isLastColumn(idNumber, finalCells)) {
        leftPos = handleMoveLeftmostBoundary(leftPos, fixedMinWidth1);
        leftPos = handleMoveRightmostBoundary(leftPos, tableWidth, fixedMinWidth2);
      } else if (!isFirstColumn(selectableRows, idNumber) && isLastColumn(idNumber, finalCells)) {
        leftPos = handleMoveRightmostBoundary(leftPos, tableWidth, fixedMinWidth2);
        leftPos = handleMoveLeft(leftPos, resizeCoords, idNumber, fixedMinWidth1);
      } else if (isFirstColumn(selectableRows, idNumber) && !isLastColumn(idNumber, finalCells)) {
        leftPos = handleMoveLeftmostBoundary(leftPos, fixedMinWidth1);
        leftPos = handleMoveRight(leftPos, resizeCoords, idNumber, fixedMinWidth2);
      } else if (!isFirstColumn(selectableRows, idNumber) && !isLastColumn(idNumber, finalCells)) {
        leftPos = handleMoveLeft(leftPos, resizeCoords, idNumber, fixedMinWidth1);
        leftPos = handleMoveRight(leftPos, resizeCoords, idNumber, fixedMinWidth2);
      }

      const curCoord = { ...resizeCoords[id], left: leftPos };
      const newResizeCoords = { ...resizeCoords, [id]: curCoord };
      this.setState({ resizeCoords: newResizeCoords, tableHeight }, this.updateWidths);
    }
  };

  onResizeEnd = (id, e) => {
    this.setState({ isResize: false, id: null });
  };

  render() {
    const { classes, tableId } = this.props;
    const { id, isResize, resizeCoords, tableWidth, tableHeight } = this.state;

    return (
      <div className={classes.root} style={{ width: tableWidth }}>
        {Object.entries(resizeCoords).map(([key, val]) => {
          return (
            <div
              data-divider-index={key}
              data-tableid={tableId}
              aria-hidden="true"
              key={key}
              onMouseMove={this.onResizeMove.bind(null, key)}
              onMouseUp={this.onResizeEnd.bind(null, key)}
              style={{
                width: isResize && id == key ? tableWidth : 'auto',
                position: 'absolute',
                height: tableHeight - 2,
                cursor: 'ew-resize',
                zIndex: 1000,
              }}>
              <div
                aria-hidden="true"
                onMouseDown={this.onResizeStart.bind(null, key)}
                className={classes.resizer}
                style={{ left: val.left }}
              />
            </div>
          );
        })}
      </div>
    );
  }
}

export default withStyles(TableResize, defaultResizeStyles, { name: 'MUIDataTableResize' });
