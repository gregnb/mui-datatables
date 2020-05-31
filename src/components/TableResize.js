import React from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { withStyles } from '@material-ui/core/styles';

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
    const tableEl = findDOMNode(this.tableRef);
    const { width: tableWidth, height: tableHeight } = tableEl.getBoundingClientRect();
    const { resizeCoords } = this.state;

    let finalCells = Object.entries(this.cellsRef);
    finalCells.pop();
    finalCells.forEach(([key, item]) => {
      if (!item) return;

      const elRect = item.getBoundingClientRect();
      const elStyle = window.getComputedStyle(item, null);
      resizeCoords[key] = { left: elRect.left + item.offsetWidth - parseInt(elStyle.paddingLeft) / 2 };
    });

    this.setState({ tableWidth, tableHeight, resizeCoords }, this.updateWidths);
  };

  updateWidths = () => {
    let lastPosition = 0;
    const { resizeCoords, tableWidth } = this.state;

    Object.entries(resizeCoords).forEach(([key, item]) => {
      let newWidth = Number(((item.left - lastPosition) / tableWidth) * 100).toFixed(2);
      lastPosition = item.left;

      const thCell = this.cellsRef[key];
      if (thCell) thCell.style.width = newWidth + '%';
    });
  };

  onResizeStart = (id, e) => {
    this.setState({ isResize: true, id });
  };

  onResizeMove = (id, e) => {
    const { isResize, resizeCoords } = this.state;
    const fixedMinWidth = 100;
    const idNumber = parseInt(id, 10);
    const finalCells = Object.entries(this.cellsRef);
    const tableEl = findDOMNode(this.tableRef);
    const { width: tableWidth } = tableEl.getBoundingClientRect();
    const { selectableRows } = this.props.options;

    if (isResize) {
      let leftPos = e.clientX;

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
        if (leftPos > resizeCoords[id + 1].left - fixedMinWidth) {
          return resizeCoords[id + 1].left - fixedMinWidth;
        }
        return leftPos;
      };

      const handleMoveLeft = (leftPos, resizeCoords, id, fixedMinWidth) => {
        if (leftPos < resizeCoords[id - 1].left + fixedMinWidth) {
          return resizeCoords[id - 1].left + fixedMinWidth;
        }
        return leftPos;
      };

      const isFirstColumn = (selectableRows, id) => {
        return (selectableRows !== 'none' && id === 0) || (selectableRows === 'none' && id === 1);
      };

      const isLastColumn = (id, finalCells) => {
        return id === finalCells.length - 2;
      };

      if (isFirstColumn(selectableRows, idNumber) && isLastColumn(idNumber, finalCells)) {
        leftPos = handleMoveLeftmostBoundary(leftPos, fixedMinWidth);
        leftPos = handleMoveRightmostBoundary(leftPos, tableWidth, fixedMinWidth);
      } else if (!isFirstColumn(selectableRows, idNumber) && isLastColumn(idNumber, finalCells)) {
        leftPos = handleMoveRightmostBoundary(leftPos, tableWidth, fixedMinWidth);
        leftPos = handleMoveLeft(leftPos, resizeCoords, idNumber, fixedMinWidth);
      } else if (isFirstColumn(selectableRows, idNumber) && !isLastColumn(idNumber, finalCells)) {
        leftPos = handleMoveLeftmostBoundary(leftPos, fixedMinWidth);
        leftPos = handleMoveRight(leftPos, resizeCoords, idNumber, fixedMinWidth);
      } else if (!isFirstColumn(selectableRows, idNumber) && !isLastColumn(idNumber, finalCells)) {
        leftPos = handleMoveLeft(leftPos, resizeCoords, idNumber, fixedMinWidth);
        leftPos = handleMoveRight(leftPos, resizeCoords, idNumber, fixedMinWidth);
      }

      const curCoord = { ...resizeCoords[id], left: leftPos };
      const newResizeCoords = { ...resizeCoords, [id]: curCoord };
      this.setState({ resizeCoords: newResizeCoords }, this.updateWidths);
    }
  };

  onResizeEnd = (id, e) => {
    this.setState({ isResize: false, id: null });
  };

  render() {
    const { classes } = this.props;
    const { id, isResize, resizeCoords, tableWidth, tableHeight } = this.state;

    return (
      <div className={classes.root} style={{ width: tableWidth }}>
        {Object.entries(resizeCoords).map(([key, val]) => {
          return (
            <div
              aria-hidden="true"
              key={key}
              onMouseMove={this.onResizeMove.bind(null, key)}
              onMouseUp={this.onResizeEnd.bind(null, key)}
              style={{
                width: isResize && id == key ? tableWidth : 'auto',
                position: 'absolute',
                height: tableHeight,
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

export default withStyles(defaultResizeStyles, { name: 'MUIDataTableResize' })(TableResize);
