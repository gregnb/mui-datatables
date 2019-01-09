import React from 'react';
import { spy, stub } from 'sinon';
import { mount, shallow } from 'enzyme';
import { assert, expect, should } from 'chai';
import textLabels from '../src/textLabels';
import TableHeadCell from '../src/components/TableHeadCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import HelpIcon from '@material-ui/icons/Help';

describe('<TableHeadCell />', function() {
  let classes;

  before(() => {
    classes = {
      root: {},
    };
  });

  it('should render a table head cell with sort label when options.sort = true provided', () => {
    const options = { sort: true, textLabels };
    const toggleSort = () => {};

    const shallowWrapper = shallow(
      <TableHeadCell options={options} sortDirection={'asc'} sort={true} toggleSort={toggleSort} classes={classes}>
        some content
      </TableHeadCell>,
    ).dive();

    const actualResult = shallowWrapper.find(TableSortLabel);
    assert.strictEqual(actualResult.length, 1);
  });

  it('should render a table head cell without sort label when options.sort = false provided', () => {
    const options = { sort: false, textLabels };
    const toggleSort = () => {};

    const shallowWrapper = shallow(
      <TableHeadCell options={options} sortDirection={'asc'} sort={true} toggleSort={toggleSort} classes={classes}>
        some content
      </TableHeadCell>,
    );

    const actualResult = shallowWrapper.find(TableSortLabel);
    assert.strictEqual(actualResult.length, 0);
  });

  it('should render a table help icon when hint provided', () => {
    const options = { sort: true, textLabels };

    const shallowWrapper = shallow(
      <TableHeadCell options={options} hint={'hint text'} classes={classes}>
        some content
      </TableHeadCell>,
    ).dive();

    const actualResult = shallowWrapper.find(HelpIcon);
    assert.strictEqual(actualResult.length, 1);
  });

  it('should render a table head cell without custom tooltip when hint provided', () => {
    const options = { sort: true, textLabels };

    const shallowWrapper = shallow(
      <TableHeadCell options={options} classes={classes}>
        some content
      </TableHeadCell>,
    ).dive();

    const actualResult = shallowWrapper.find(HelpIcon);
    assert.strictEqual(actualResult.length, 0);
  });

  it('should trigger toggleSort prop callback when calling method handleSortClick', () => {
    const options = { sort: true, textLabels };
    const toggleSort = spy();

    const shallowWrapper = shallow(
      <TableHeadCell options={options} index={0} sortDirection={'asc'} toggleSort={toggleSort} classes={classes}>
        some content
      </TableHeadCell>,
    ).dive();

    const instance = shallowWrapper.instance();

    const event = { target: { value: 'All' } };
    instance.handleSortClick();
    assert.strictEqual(toggleSort.callCount, 1);
  });
});
