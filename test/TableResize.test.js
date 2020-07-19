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

    assert.strictEqual(colCoordCount, 5);
  });
});
