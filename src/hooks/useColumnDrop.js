/*
  This hook handles the dragging and dropping effects that occur for columns.
*/

import { useDrop } from 'react-dnd';

const getColModel = (headCellRefs, columnOrder) => {
  let colModel = [];

  let ii = 0,
    parentOffsetLeft = 0,
    offsetParent = headCellRefs[0].offsetParent;
  while (offsetParent) {
    parentOffsetLeft = parentOffsetLeft + (offsetParent.offsetLeft || 0);
    offsetParent = offsetParent.offsetParent;
    ii++;
    if (ii > 1000) {
      console.warn('Table nested within 1000 divs. Maybe an error.');
      break;
    }
  }

  colModel[0] = {
    left: parentOffsetLeft + headCellRefs[0].offsetLeft,
    width: headCellRefs[0].offsetWidth,
    columnIndex: null,
    ref: headCellRefs[0],
  };

  columnOrder.forEach((colIdx, idx) => {
    let col = headCellRefs[colIdx + 1];
    let cmIndx = colModel.length - 1;
    colModel.push({
      left: colModel[cmIndx].left + colModel[cmIndx].width,
      width: col.offsetWidth,
      columnIndex: colIdx,
      ref: col,
    });
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

const useColumnDrop = opts => {
  const { index, headCellRefs, updateColumnOrder, columnOrder, transitionTime = 300, tableRef, timers } = opts;

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'HEADER',
    drop: opts.drop,
    hover: (item, mon) => {
      let hoverIdx = mon.getItem().colIndex;

      if (hoverIdx !== index) {
        let reorderedCols = reorderColumns(columnOrder, mon.getItem().colIndex, index);
        let newColModel = getColModel(headCellRefs, reorderedCols);

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

          let curColModel = getColModel(headCellRefs, columnOrder);

          let transitions = [];
          newColModel.forEach(item => {
            transitions[item.columnIndex] = item.left;
          });
          curColModel.forEach(item => {
            transitions[item.columnIndex] = transitions[item.columnIndex] - item.left;
          });

          for (let idx = 1; idx < columnOrder.length; idx++) {
            headCellRefs[idx].style.transition = '280ms';
            headCellRefs[idx].style.transform = 'translateX(' + transitions[idx - 1] + 'px)';
          }

          let allElms = [];
          let dividers = [];
          for (let ii = 0; ii < columnOrder.length; ii++) {
            let elms = tableRef ? tableRef.querySelectorAll('[data-colindex="' + ii + '"]') : [];
            for (let jj = 0; jj < elms.length; jj++) {
              elms[jj].style.transition = transitionTime + 'ms';
              elms[jj].style.transform = 'translateX(' + transitions[ii] + 'px)';
              allElms.push(elms[jj]);
            }

            let divider = tableRef ? tableRef.querySelectorAll('[data-divider-index="' + (ii + 1) + '"]') : [];
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
    },
    collect: mon => ({
      isOver: !!mon.isOver(),
      canDrop: !!mon.canDrop(),
    }),
  });

  return [drop];
};

export default useColumnDrop;
