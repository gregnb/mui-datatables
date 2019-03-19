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
    startPosition: 0,
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
    const { priorPosition, resizeCoords } = this.state;

    let finalCells = Object.entries(this.cellsRef);

    finalCells.forEach(([key, item]) => {
      if (!item) return;

      const elRect = item.getBoundingClientRect();
      const elStyle = window.getComputedStyle(item, null);
      const left = resizeCoords[key] !== undefined ? resizeCoords[key].left : undefined;
      const oldLeft = priorPosition[key] || 0;
      let newLeft = elRect.left + item.offsetWidth - parseInt(elStyle.paddingLeft) / 2;

      if (left === oldLeft) return;

      resizeCoords[key] = { left: newLeft };
      priorPosition[key] = newLeft;
    });

    this.setState({ tableWidth, tableHeight, resizeCoords, priorPosition }, this.updateWidths);
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
    this.setState({ isResize: true, id, startPosition: e.clientX });
  };

  onResizeMove = (id, e) => {
    const { startPosition, isResize, resizeCoords } = this.state;

    if (isResize) {
      const leftPos = startPosition - (startPosition - e.clientX);

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
