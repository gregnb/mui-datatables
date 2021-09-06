import React from 'react';
import { spy, stub } from 'sinon';
import { mount, shallow } from 'enzyme';
import { assert, expect, should } from 'chai';
import TableHead from '../src/components/TableHead';
import TableHeadCell from '../src/components/TableHeadCell';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

describe('<TableHead />', function() {
  let columns;
  let handleHeadUpdateRef;

  before(() => {
    columns = [
      { name: 'First Name', label: 'First Name', display: 'true', sort: true },
      { name: 'Company', label: 'Company', display: 'true', sort: null },
      { name: 'City', label: 'City Label', display: 'true', sort: null },
      {
        name: 'State',
        label: 'State',
        display: 'true',
        options: { fixedHeaderOptions: { xAxis: true, yAxis: true }, selectableRows: 'multiple' },
        customHeadRender: columnMeta => <TableHeadCell {...columnMeta}>{columnMeta.name + 's'}</TableHeadCell>,
        sort: null,
      },
    ];

    handleHeadUpdateRef = () => {};
  });

  it('should render a table head', () => {
    const options = {};
    const toggleSort = () => {};
    const mountWrapper = mount(
      <DndProvider backend={HTML5Backend}>
        <TableHead
          columns={columns}
          options={options}
          setCellRef={() => {}}
          handleHeadUpdateRef={handleHeadUpdateRef}
          toggleSort={toggleSort}
        />
      </DndProvider>,
    );
    const actualResult = mountWrapper.find(TableHeadCell);
    assert.strictEqual(actualResult.length, 4);
  });

  it('should render the label in the table head cell', () => {
    const options = {};
    const toggleSort = () => {};

    const mountWrapper = mount(
      <DndProvider backend={HTML5Backend}>
        <TableHead
          columns={columns}
          options={options}
          setCellRef={() => {}}
          handleHeadUpdateRef={handleHeadUpdateRef}
          toggleSort={toggleSort}
        />
      </DndProvider>,
    );
    const labels = mountWrapper.find(TableHeadCell).map(n => n.text());
    assert.deepEqual(labels, ['First Name', 'Company', 'City Label', 'States']);
  });

  it('should render a table head with no cells', () => {
    const options = {};
    const toggleSort = () => {};

    const newColumns = columns.map(column => ({ ...column, display: false }));
    const mountWrapper = mount(
      <DndProvider backend={HTML5Backend}>
        <TableHead
          columns={newColumns}
          options={options}
          setCellRef={() => {}}
          handleHeadUpdateRef={handleHeadUpdateRef}
          toggleSort={toggleSort}
        />
      </DndProvider>,
    );
    const actualResult = mountWrapper.find(TableHeadCell);
    assert.strictEqual(actualResult.length, 0);
  });

  it('should trigger toggleSort prop callback when calling method handleToggleColumn', () => {
    const options = { sort: true };
    const toggleSort = spy();

    const wrapper = mount(
      <DndProvider backend={HTML5Backend}>
        <TableHead
          columns={columns}
          options={options}
          setCellRef={() => {}}
          handleHeadUpdateRef={handleHeadUpdateRef}
          toggleSort={toggleSort}
        />
      </DndProvider>,
    );

    const instance = wrapper.find('th span').at(0);
    instance.simulate('click');

    assert.strictEqual(toggleSort.callCount, 1);
  });

  it('should trigger selectRowUpdate prop callback and selectChecked state update when calling method handleRowSelect', () => {
    const options = { sort: true, selectableRows: 'multiple' };
    const rowSelectUpdate = spy();

    const wrapper = mount(
      <DndProvider backend={HTML5Backend}>
        <TableHead
          columns={columns}
          options={options}
          setCellRef={() => {}}
          handleHeadUpdateRef={handleHeadUpdateRef}
          selectRowUpdate={rowSelectUpdate}
        />
      </DndProvider>,
    );

    const instance = wrapper.find('input[type="checkbox"]');
    instance.simulate('change', { target: { value: 'checked' } });

    assert.strictEqual(rowSelectUpdate.callCount, 1);
  });

  it('should render a table head with checkbox if selectableRows = multiple', () => {
    const options = { selectableRows: 'multiple' };

    const mountWrapper = mount(
      <DndProvider backend={HTML5Backend}>
        <TableHead
          columns={columns}
          options={options}
          setCellRef={() => {}}
          handleHeadUpdateRef={handleHeadUpdateRef}
        />
      </DndProvider>,
    );

    const actualResult = mountWrapper.find(Checkbox);
    assert.strictEqual(actualResult.length, 1);
  });

  it('should render a table head with no checkbox if selectableRows = single', () => {
    const options = { selectableRows: 'single' };

    const mountWrapper = mount(
      <DndProvider backend={HTML5Backend}>
        <TableHead
          columns={columns}
          options={options}
          setCellRef={() => {}}
          handleHeadUpdateRef={handleHeadUpdateRef}
        />
      </DndProvider>,
    );

    const actualResult = mountWrapper.find(Checkbox);
    assert.strictEqual(actualResult.length, 0);
  });

  it('should render a table head with no checkbox if selectableRows = none', () => {
    const options = { selectableRows: 'none' };

    const mountWrapper = mount(
      <DndProvider backend={HTML5Backend}>
        <TableHead
          columns={columns}
          options={options}
          setCellRef={() => {}}
          handleHeadUpdateRef={handleHeadUpdateRef}
        />
      </DndProvider>,
    );

    const actualResult = mountWrapper.find(Checkbox);
    assert.strictEqual(actualResult.length, 0);
  });
});
