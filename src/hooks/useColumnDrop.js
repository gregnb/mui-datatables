/*
  This hook handles the dragging and dropping effects that occur for columns.
*/

import { useDrop } from 'react-dnd';

const getColModel = (headCellRefs, columnOrder, columns) => {
  let colModel = [];
  let leftMostCell = headCellRefs[0] ? headCellRefs[0] : null; // left most cell is the select cell, if it exists

  if (leftMostCell === null) {
    leftMostCell = { offsetLeft: Infinity };
    let headCells = Object.entries(headCellRefs);
    headCells.forEach(([key, item], idx) => {
      if (item && item.offsetLeft < leftMostCell.offsetLeft) {
        leftMostCell = item;
      }
    });

    if (leftMostCell.offsetLeft === Infinity) {
      leftMostCell = { offsetParent: 0, offsetWidth: 0, offsetLeft: 0 };
    }
  }

  let ii = 0,
    parentOffsetLeft = 0,
    offsetParent = leftMostCell.offsetParent;
  while (offsetParent) {
    parentOffsetLeft = parentOffsetLeft + (offsetParent.offsetLeft || 0) - (offsetParent.scrollLeft || 0);
    offsetParent = offsetParent.offsetParent;
    ii++;
    if (ii > 1000) break;
  }

  // if the select cell is present, make sure it is apart of the column model
  if (headCellRefs[0]) {
    colModel[0] = {
      left: parentOffsetLeft + leftMostCell.offsetLeft,
      width: leftMostCell.offsetWidth,
      columnIndex: null,
      ref: leftMostCell,
    };
  }

  columnOrder.forEach((colIdx, idx) => {
    let col = headCellRefs[colIdx + 1];
    let cmIndx = colModel.length - 1;
    if (!(columns[colIdx] && columns[colIdx].display !== 'true')) {
      let prevLeft =
        cmIndx !== -1 ? colModel[cmIndx].left + colModel[cmIndx].width : parentOffsetLeft + leftMostCell.offsetLeft;
      colModel.push({
        left: prevLeft,
        width: col.offsetWidth,
        columnIndex: colIdx,
        ref: col,
      });
    }
  });

  return colModel;
};

const reorderColumns = (prevColumnOrder, columnIndex, newPosition) => {
  let columnOrder = prevColumnOrder.slice();
  let srcIndex = columnOrder.indexOf(columnIndex);
  let targetIndex = columnOrder.indexOf(newPosition);

  if (srcIndex !== -1 && targetIndex !== -1) {
    let newItem = columnOrder[srcIndex];
    columnOrder = [...columnOrder.slice(0, srcIndex), ...columnOrder.slice(srcIndex + 1)];
    columnOrder = [...columnOrder.slice(0, targetIndex), newItem, ...columnOrder.slice(targetIndex)];
  }
  return columnOrder;
};

const handleHover = opts => {
  const {
    item,
    mon,
    index,
    headCellRefs,
    updateColumnOrder,
    columnOrder,
    transitionTime = 300,
    tableRef,
    tableId,
    timers,
    columns,
  } = opts;

  let hoverIdx = mon.getItem().colIndex;

  if (headCellRefs !== mon.getItem().headCellRefs) return;

  if (hoverIdx !== index) {
    let reorderedCols = reorderColumns(columnOrder, mon.getItem().colIndex, index);
    let newColModel = getColModel(headCellRefs, reorderedCols, columns);

    let newX = mon.getClientOffset().x;
    let modelIdx = -1;
    for (let ii = 0; ii < newColModel.length; ii++) {
      if (newX > newColModel[ii].left && newX < newColModel[ii].left + newColModel[ii].width) {
        modelIdx = newColModel[ii].columnIndex;
        break;
      }
    }

    if (modelIdx === mon.getItem().colIndex) {
      clearTimeout(timers.columnShift);

      let curColModel = getColModel(headCellRefs, columnOrder, columns);

      let transitions = [];
      newColModel.forEach(item => {
        transitions[item.columnIndex] = item.left;
      });
      curColModel.forEach(item => {
        transitions[item.columnIndex] = transitions[item.columnIndex] - item.left;
      });

      for (let idx = 1; idx < columnOrder.length; idx++) {
        let colIndex = columnOrder[idx];
        if (columns[colIndex] && columns[colIndex].display !== 'true') {
          // skip
        } else {
          if (headCellRefs[idx]) headCellRefs[idx].style.transition = '280ms';
          if (headCellRefs[idx]) headCellRefs[idx].style.transform = 'translateX(' + transitions[idx - 1] + 'px)';
        }
      }

      let allElms = [];
      let dividers = [];
      for (let ii = 0; ii < columnOrder.length; ii++) {
        let elms = tableRef
          ? tableRef.querySelectorAll('[data-colindex="' + ii + '"][data-tableid="' + tableId + '"]')
          : [];
        for (let jj = 0; jj < elms.length; jj++) {
          elms[jj].style.transition = transitionTime + 'ms';
          elms[jj].style.transform = 'translateX(' + transitions[ii] + 'px)';
          allElms.push(elms[jj]);
        }

        let divider = tableRef
          ? tableRef.querySelectorAll('[data-divider-index="' + (ii + 1) + '"][data-tableid="' + tableId + '"]')
          : [];
        for (let jj = 0; jj < divider.length; jj++) {
          divider[jj].style.transition = transitionTime + 'ms';
          divider[jj].style.transform = 'translateX(' + transitions[columnOrder[ii]] + 'px)';
          dividers.push(divider[jj]);
        }
      }

      let newColIndex = mon.getItem().colIndex;
      timers.columnShift = setTimeout(() => {
        allElms.forEach(item => {
          item.style.transition = '0s';
          item.style.transform = 'translateX(0)';
        });
        dividers.forEach(item => {
          item.style.transition = '0s';
          item.style.transform = 'translateX(0)';
        });
        updateColumnOrder(reorderedCols, newColIndex, index);
      }, transitionTime);
    }
  }
};

const useColumnDrop = opts => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'HEADER',
    drop: drop,
    hover: (item, mon) => handleHover(Object.assign({}, opts, { item, mon })),
    collect: mon => ({
      isOver: !!mon.isOver(),
      canDrop: !!mon.canDrop(),
    }),
  });

  return [drop];
};

export { getColModel, reorderColumns, handleHover };
export default useColumnDrop;
