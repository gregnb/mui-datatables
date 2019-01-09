import React from 'react';
import { match, spy, stub } from 'sinon';
import { mount, shallow } from 'enzyme';
import { assert, expect, should } from 'chai';
import DeleteIcon from '@material-ui/icons/Delete';
import TableToolbarSelect from '../src/components/TableToolbarSelect';
import textLabels from '../src/textLabels';

describe('<TableToolbarSelect />', function() {
  before(() => {});

  it('should render table toolbar select', () => {
    const onRowsDelete = () => {};
    const mountWrapper = mount(
      <TableToolbarSelect options={{ textLabels }} selectedRows={{ data: [1] }} onRowsDelete={onRowsDelete} />,
    );

    const actualResult = mountWrapper.find(DeleteIcon);
    assert.strictEqual(actualResult.length, 1);
  });

  it('should call customToolbarSelect with 3 arguments', () => {
    const onRowsDelete = () => {};
    const customToolbarSelect = spy();
    const selectedRows = { data: [1] };
    const displayData = [1];

    const mountWrapper = mount(
      <TableToolbarSelect
        options={{ textLabels, customToolbarSelect }}
        selectedRows={selectedRows}
        onRowsDelete={onRowsDelete}
        displayData={displayData}
      />,
    );

    assert.strictEqual(customToolbarSelect.calledWith(selectedRows, displayData, match.typeOf('function')), true);
  });

  it('should throw TypeError if selectedRows is not an array of numbers', done => {
    const onRowsDelete = () => {};
    const selectRowUpdate = () => {};
    const customToolbarSelect = (_, __, setSelectedRows) => {
      const spySetSelectedRows = spy(setSelectedRows);
      try {
        spySetSelectedRows('');
      } catch (error) {
        //do nothing
      }
      try {
        spySetSelectedRows(['1']);
      } catch (error) {
        //do nothing
      }

      spySetSelectedRows.exceptions.forEach(error => assert.strictEqual(error instanceof TypeError, true));

      done();
    };
    const selectedRows = { data: [1] };
    const displayData = [1];

    const mountWrapper = mount(
      <TableToolbarSelect
        options={{ textLabels, customToolbarSelect }}
        selectedRows={selectedRows}
        onRowsDelete={onRowsDelete}
        displayData={displayData}
        selectRowUpdate={selectRowUpdate}
      />,
    );
  });

  it('should call selectRowUpdate when customToolbarSelect passed and setSelectedRows was called', () => {
    const onRowsDelete = () => {};
    const selectRowUpdate = spy();
    const customToolbarSelect = (_, __, setSelectedRows) => {
      setSelectedRows([1]);
    };
    const selectedRows = { data: [1] };
    const displayData = [1];

    const mountWrapper = mount(
      <TableToolbarSelect
        options={{ textLabels, customToolbarSelect }}
        selectedRows={selectedRows}
        onRowsDelete={onRowsDelete}
        displayData={displayData}
        selectRowUpdate={selectRowUpdate}
      />,
    );

    assert.strictEqual(selectRowUpdate.calledOnce, true);
  });
});
