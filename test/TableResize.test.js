import React from 'react';
import { spy, stub } from 'sinon';
import { mount, shallow } from 'enzyme';
import { assert, expect, should } from 'chai';
import TableResize from '../src/components/TableResize';
import MUIDataTable from '../src/MUIDataTable';

describe('<TableResize />', function() {
  let options;

  before(() => {
    options = {
      resizableColumns: true,
      tableBodyHeight: '500px',
    };
  });

  it('should render a table resize component', () => {
    const updateDividers = spy();
    const setResizeable = spy();

    const mountWrapper = mount(
      <TableResize options={options} updateDividers={updateDividers} setResizeable={setResizeable} />,
    );

    const actualResult = mountWrapper.find(TableResize);
    assert.strictEqual(actualResult.length, 1);

    assert.strictEqual(updateDividers.callCount, 1);
    assert.strictEqual(setResizeable.callCount, 1);
  });

  it('should create a coordinate map for each column', () => {
    const columns = ['Name', 'Age', 'Location', 'Phone'];
    const data = [['Joe', 26, 'Chile', '555-5555']];

    const shallowWrapper = mount(<MUIDataTable columns={columns} data={data} options={options} />);

    var state = shallowWrapper
      .find(TableResize)
      .childAt(0)
      .state();

    var colCoordCount = 0;
    for (let prop in state.resizeCoords) {
      colCoordCount++;
    }

    shallowWrapper.unmount();

    assert.strictEqual(colCoordCount, 5);
  });

  it('should execute resize methods correctly', () => {
    const updateDividers = spy();
    let cellsRef = {
      0: {
        left: 0,
        width: 50,
        getBoundingClientRect: () => ({
          left: 0,
          width: 50,
          height: 100,
        }),
        style: {},
      },
      1: {
        left: 50,
        width: 50,
        getBoundingClientRect: () => ({
          left: 50,
          width: 50,
          height: 100,
        }),
        style: {},
      },
    };
    let tableRef = {
      style: {
        width: '100px',
      },
      getBoundingClientRect: () => ({
        width: 100,
        height: 100,
      }),
      offsetParent: {
        offsetLeft: 0,
      },
    };

    const setResizeable = next => {
      next(cellsRef, tableRef);
    };

    const shallowWrapper = shallow(
      <TableResize options={options} updateDividers={updateDividers} setResizeable={setResizeable} />,
    );
    const instance = shallowWrapper.dive().instance();

    instance.handleResize();

    let evt = {
      clientX: 48,
    };
    instance.onResizeStart(0, evt);
    instance.onResizeMove(0, evt);
    instance.onResizeEnd(0, evt);

    evt = {
      clientX: 52,
    };
    instance.onResizeStart(0, evt);
    instance.onResizeMove(0, evt);
    instance.onResizeEnd(0, evt);

    let endState = shallowWrapper.dive().state();
    //console.dir(endState);

    assert.strictEqual(endState.tableWidth, 100);
    assert.strictEqual(endState.tableHeight, 100);
  });
});
