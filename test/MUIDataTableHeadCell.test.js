import React from 'react';
import { spy, stub } from 'sinon';
import { mount, shallow } from 'enzyme';
import { assert, expect, should } from 'chai';
import getTextLabels from '../src/textLabels';
import TableHeadCell from '../src/components/TableHeadCell';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';
import HelpIcon from '@mui/icons-material/Help';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

describe('<TableHeadCell />', function() {
  let classes;

  before(() => {
    classes = {
      root: {},
    };
  });

  it('should add custom props to header cell if "setCellHeaderProps" provided', () => {
    const options = { sort: true, textLabels: getTextLabels() };
    const toggleSort = () => {};
    const setCellHeaderProps = { myProp: 'test', className: 'testClass' };
    const selectRowUpdate = stub();
    const toggleExpandRow = () => {};

    const mountWrapper = mount(
      <DndProvider backend={HTML5Backend}>
        <TableHeadCell
          cellHeaderProps={setCellHeaderProps}
          options={options}
          sortDirection={'asc'}
          sort={true}
          toggleSort={toggleSort}
          classes={classes}>
          some content
        </TableHeadCell>
      </DndProvider>,
    );

    const props = mountWrapper.find(TableCell).props();
    const classNames = props.className.split(' ');
    const finalClass = classNames[classNames.length - 1];

    assert.strictEqual(props.myProp, 'test');
    assert.strictEqual(finalClass, 'testClass');
  });

  it('should render a table head cell with sort label when options.sort = true provided', () => {
    const options = { sort: true, textLabels: getTextLabels() };
    const toggleSort = () => {};

    const wrapper = mount(
      <DndProvider backend={HTML5Backend}>
        <TableHeadCell options={options} sortDirection={'asc'} sort={true} toggleSort={toggleSort} classes={classes}>
          some content
        </TableHeadCell>
      </DndProvider>,
    );

    const actualResult = wrapper.find(TableSortLabel);
    assert.strictEqual(actualResult.length, 1);
  });

  it('should render a table head cell without sort label when options.sort = false provided', () => {
    const options = { sort: false, textLabels: getTextLabels() };
    const toggleSort = () => {};

    const shallowWrapper = shallow(
      <DndProvider backend={HTML5Backend}>
        <TableHeadCell options={options} sortDirection={'asc'} sort={true} toggleSort={toggleSort} classes={classes}>
          some content
        </TableHeadCell>
      </DndProvider>,
    );

    const actualResult = shallowWrapper.find(TableSortLabel);
    assert.strictEqual(actualResult.length, 0);
  });

  it('should render a table help icon when hint provided', () => {
    const options = { sort: true, textLabels: getTextLabels() };

    const wrapper = mount(
      <DndProvider backend={HTML5Backend}>
        <TableHeadCell options={options} hint={'hint text'} classes={classes}>
          some content
        </TableHeadCell>
      </DndProvider>,
    );

    const actualResult = wrapper.find(HelpIcon);
    assert.strictEqual(actualResult.length, 1);
  });

  it('should render a table head cell without custom tooltip when hint provided', () => {
    const options = { sort: true, textLabels: getTextLabels() };

    const shallowWrapper = shallow(
      <DndProvider backend={HTML5Backend}>
        <TableHeadCell options={options} classes={classes}>
          some content
        </TableHeadCell>
      </DndProvider>,
    ).dive();

    const actualResult = shallowWrapper.find(HelpIcon);
    assert.strictEqual(actualResult.length, 0);
  });

  it('should trigger toggleSort prop callback when calling method handleSortClick', () => {
    const options = { sort: true, textLabels: getTextLabels() };
    const toggleSort = spy();

    const wrapper = mount(
      <DndProvider backend={HTML5Backend}>
        <TableHeadCell
          options={options}
          sort={true}
          index={0}
          sortDirection={'asc'}
          toggleSort={toggleSort}
          classes={classes}>
          some content
        </TableHeadCell>
      </DndProvider>,
    );

    const instance = wrapper
      .find('td')
      .at(0)
      .childAt(0);
    const event = { target: { value: 'All' } };
    instance.simulate('click');
    assert.strictEqual(toggleSort.callCount, 1);
  });
});
