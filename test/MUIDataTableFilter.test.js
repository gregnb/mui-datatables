import React from 'react';
import { spy, stub } from 'sinon';
import { mount, shallow } from 'enzyme';
import { assert, expect, should } from 'chai';
import textLabels from '../src/textLabels';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import TableFilter from '../src/components/TableFilter';
import Typography from '@material-ui/core/Typography';

describe('<TableFilter />', function() {
  let data;
  let columns;
  let filterData;

  beforeEach(() => {
    columns = [
      { name: 'First Name', label: 'First Name', display: true, sort: true, filter: true, sortDirection: 'desc' },
      { name: 'Company', label: 'Company', display: true, sort: true, filter: true, sortDirection: 'desc' },
      { name: 'City', label: 'City Label', display: true, sort: true, filter: true, sortDirection: 'desc' },
      { name: 'State', label: 'State', display: true, sort: true, filter: true, sortDirection: 'desc' },
    ];

    data = [
      ['Joe James', 'Test Corp', 'Yonkers', 'NY'],
      ['John Walsh', 'Test Corp', 'Hartford', 'CT'],
      ['Bob Herm', 'Test Corp', 'Tampa', 'FL'],
      ['James Houston', 'Test Corp', 'Dallas', 'TX'],
    ];

    filterData = [
      ['Joe James', 'John Walsh', 'Bob Herm', 'James Houston'],
      ['Test Corp'],
      ['Yonkers', 'Hartford', 'Tampa', 'Dallas'],
      ['NY', 'CT', 'FL', 'TX'],
    ];
  });

  it('should render label as filter name', () => {
    const options = { filterType: 'checkbox', textLabels };
    const filterList = [[], [], [], []];
    const shallowWrapper = mount(
      <TableFilter columns={columns} filterData={filterData} filterList={filterList} options={options} />,
    );
    const labels = shallowWrapper
      .find(Typography)
      .filterWhere(n => n.html().match(/MUIDataTableFilter-checkboxListTitle/))
      .map(n => n.text());
    assert.deepEqual(labels, ['First Name', 'Company', 'City Label', 'State']);
  });

  it("should data table filter view with checkboxes if filterType = 'checkbox'", () => {
    const options = { filterType: 'checkbox', textLabels };
    const filterList = [[], [], [], []];
    const shallowWrapper = mount(
      <TableFilter columns={columns} filterData={filterData} filterList={filterList} options={options} />,
    );

    const actualResult = shallowWrapper.find(Checkbox);
    assert.strictEqual(actualResult.length, 13);
  });

  it('should data table filter view with no checkboxes if filter=false for each column', () => {
    const options = { filterType: 'checkbox', textLabels };
    const filterList = [[], [], [], []];
    columns = columns.map(item => (item.filter = false));

    const shallowWrapper = mount(
      <TableFilter columns={columns} filterData={filterData} filterList={filterList} options={options} />,
    );

    const actualResult = shallowWrapper.find(Checkbox);
    assert.strictEqual(actualResult.length, 0);
  });

  it("should data table filter view with selects if filterType = 'select'", () => {
    const options = { filterType: 'select', textLabels };
    const filterList = [['Joe James'], [], [], []];

    const mountWrapper = mount(
      <TableFilter columns={columns} filterData={filterData} filterList={filterList} options={options} />,
    );

    const actualResult = mountWrapper.find(Select);
    assert.strictEqual(actualResult.length, 4);
  });

  it('should data table filter view no selects if filter=false for each column', () => {
    const options = { filterType: 'select', textLabels };
    const filterList = [['Joe James'], [], [], []];
    columns = columns.map(item => (item.filter = false));

    const mountWrapper = mount(
      <TableFilter columns={columns} filterData={filterData} filterList={filterList} options={options} />,
    );

    const actualResult = mountWrapper.find(Select);
    assert.strictEqual(actualResult.length, 0);
  });

  it("should data table filter view with checkbox selects if filterType = 'multiselect'", () => {
    const options = { filterType: 'multiselect', textLabels };
    const filterList = [['Joe James', 'John Walsh'], [], [], []];

    const mountWrapper = mount(
      <TableFilter columns={columns} filterData={filterData} filterList={filterList} options={options} />,
    );

    const actualResult = mountWrapper.find(Select);
    assert.strictEqual(actualResult.length, 4);
  });

  it("should data table filter view with TextFields if filterType = 'textfield'", () => {
    const options = { filterType: 'textField', textLabels };
    const filterList = [[], [], [], []];
    const shallowWrapper = mount(
      <TableFilter columns={columns} filterData={filterData} filterList={filterList} options={options} />,
    );

    const actualResult = shallowWrapper.find(TextField);
    assert.strictEqual(actualResult.length, 4);
  });

  it("should data table filter view with no TextFields if filter=false when filterType = 'textField'", () => {
    const options = { filterType: 'textField', textLabels };
    const filterList = [[], [], [], []];
    columns = columns.map(item => (item.filter = false));

    const shallowWrapper = mount(
      <TableFilter columns={columns} filterData={filterData} filterList={filterList} options={options} />,
    );

    const actualResult = shallowWrapper.find(TextField);
    assert.strictEqual(actualResult.length, 0);
  });

  it('should trigger onFilterUpdate prop callback when calling method handleCheckboxChange', () => {
    const options = { filterType: 'checkbox', textLabels };
    const filterList = [[], [], [], []];
    const onFilterUpdate = spy();

    const shallowWrapper = shallow(
      <TableFilter
        columns={columns}
        onFilterUpdate={onFilterUpdate}
        filterData={filterData}
        filterList={filterList}
        options={options}
      />,
    ).dive();
    const instance = shallowWrapper.instance();

    //const event = { target: { value: 0 }};
    instance.handleCheckboxChange(0, 0);
    assert.strictEqual(onFilterUpdate.callCount, 1);
  });

  it('should trigger onFilterUpdate prop callback when calling method handleDropdownChange', () => {
    const options = { filterType: 'select', textLabels };
    const filterList = [[], [], [], []];
    const onFilterUpdate = spy();

    const shallowWrapper = shallow(
      <TableFilter
        columns={columns}
        onFilterUpdate={onFilterUpdate}
        filterData={filterData}
        filterList={filterList}
        options={options}
      />,
    ).dive();
    const instance = shallowWrapper.instance();

    let event = { target: { value: 'All' } };
    instance.handleDropdownChange(event, 0);
    assert.strictEqual(onFilterUpdate.callCount, 1);

    event = { target: { value: 'test' } };
    instance.handleDropdownChange(event, 0);
    assert.strictEqual(onFilterUpdate.callCount, 2);
  });
});
