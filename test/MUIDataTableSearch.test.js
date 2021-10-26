import React from 'react';
import simulant from 'simulant';
import { spy, stub } from 'sinon';
import { mount, shallow } from 'enzyme';
import { assert, expect, should } from 'chai';
import TextField from '@mui/material/TextField';
import TableSearch from '../src/components/TableSearch';
import getTextLabels from '../src/textLabels';

describe('<TableSearch />', function() {
  it('should render a search bar', () => {
    const options = { textLabels: getTextLabels() };
    const onSearch = () => {};
    const onHide = () => {};

    const mountWrapper = mount(<TableSearch onSearch={onSearch} onHide={onHide} options={options} />);

    const actualResult = mountWrapper.find(TextField);
    assert.strictEqual(actualResult.length, 1);
  });

  it('should render a search bar with text initialized', () => {
    const options = { textLabels: getTextLabels() };
    const onSearch = () => {};
    const onHide = () => {};

    const mountWrapper = mount(
      <TableSearch onSearch={onSearch} onHide={onHide} options={options} searchText="searchText" />,
    );
    const actualResult = mountWrapper.find(TextField);
    assert.strictEqual(actualResult.length, 1);
    assert.strictEqual(actualResult.props().value, 'searchText');
  });

  it('should change search bar text when searchText changes', () => {
    const options = { textLabels: getTextLabels() };
    const onSearch = () => {};
    const onHide = () => {};

    const mountWrapper = mount(
      <TableSearch onSearch={onSearch} onHide={onHide} options={options} searchText="searchText" />,
    );
    const actualResult = mountWrapper.setProps({ searchText: 'nextText' }).update();
    assert.strictEqual(actualResult.length, 1);
    assert.strictEqual(actualResult.find(TextField).props().value, 'nextText');
  });

  it('should render a search bar with placeholder when searchPlaceholder is set', () => {
    const options = { textLabels: getTextLabels(), searchPlaceholder: 'TestingPlaceholder' };
    const onSearch = () => {};
    const onHide = () => {};

    const mountWrapper = mount(<TableSearch onSearch={onSearch} onHide={onHide} options={options} />);
    const actualResult = mountWrapper.find(TextField);
    assert.strictEqual(actualResult.length, 1);
    assert.strictEqual(actualResult.props().placeholder, 'TestingPlaceholder');
  });

  it('should trigger handleTextChange prop callback when calling method handleTextChange', () => {
    const options = { onSearchChange: () => true, textLabels: getTextLabels() };
    const onSearch = spy();
    const onHide = () => {};

    const wrapper = mount(<TableSearch onSearch={onSearch} onHide={onHide} options={options} />);

    wrapper
      .find('input')
      .at(0)
      .simulate('change', { target: { value: '' } });
    wrapper.unmount();

    assert.strictEqual(onSearch.callCount, 1);
  });

  it('should hide the search bar when hitting the ESCAPE key', () => {
    const options = { textLabels: getTextLabels() };
    const onHide = spy();

    const mountWrapper = mount(<TableSearch onHide={onHide} options={options} />, { attachTo: document.body });

    simulant.fire(document.body.querySelector('input'), 'keydown', { keyCode: 27 });
    assert.strictEqual(onHide.callCount, 1);
  });

  it('should hide not hide search bar when entering anything but the ESCAPE key', () => {
    const options = { textLabels: getTextLabels() };
    const onHide = spy();

    const mountWrapper = mount(<TableSearch onHide={onHide} options={options} />, { attachTo: document.body });

    simulant.fire(document.body.querySelector('input'), 'keydown', { keyCode: 25 });
    assert.strictEqual(onHide.callCount, 0);
  });
});
