import React from 'react';
import { spy, stub } from 'sinon';
import { mount, shallow } from 'enzyme';
import { assert, expect, should } from 'chai';
import textLabels from '../src/textLabels';
import TableBody from '../src/components/TableBody';
import TableSelectCell from '../src/components/TableSelectCell';
import Checkbox from '@material-ui/core/Checkbox';

describe('<TableBody />', function() {
  let data;
  let displayData;
  let columns;

  before(() => {
    columns = [{ name: 'First Name' }, { name: 'Company' }, { name: 'City' }, { name: 'State' }];
    data = [
      ['Joe James', 'Test Corp', 'Yonkers', 'NY'],
      ['John Walsh', 'Test Corp', null, 'CT'],
      ['Bob Herm', 'Test Corp', 'Tampa', 'FL'],
      ['James Houston', 'Test Corp', 'Dallas', 'TX'],
    ];
    displayData = [
      {
        data: ['Joe James', 'Test Corp', 'Yonkers', 'NY'],
        dataIndex: 0,
      },
      {
        data: ['John Walsh', 'Test Corp', null, 'CT'],
        dataIndex: 1,
      },
      {
        data: ['Bob Herm', 'Test Corp', 'Tampa', 'FL'],
        dataIndex: 2,
      },
      {
        data: ['James Houston', 'Test Corp', 'Dallas', 'TX'],
        dataIndex: 3,
      },
    ];
  });

  it('should render a table body with no selectable cells if selectableRows = none', () => {
    const options = { selectableRows: 'none' };
    const selectRowUpdate = () => {};
    const toggleExpandRow = () => {};

    const mountWrapper = mount(
      <TableBody
        data={displayData}
        count={displayData.length}
        columns={columns}
        page={0}
        rowsPerPage={10}
        selectedRows={[]}
        selectRowUpdate={selectRowUpdate}
        expandedRows={[]}
        toggleExpandRow={toggleExpandRow}
        options={options}
        searchText={''}
        filterList={[]}
      />,
    );

    const actualResult = mountWrapper.find(Checkbox);
    assert.strictEqual(actualResult.length, 0);
  });

  it('should render a table body with no records if no data provided', () => {
    const options = { selectableRows: false, textLabels };
    const selectRowUpdate = () => {};
    const toggleExpandRow = () => {};

    const mountWrapper = mount(
      <TableBody
        data={[]}
        columns={columns}
        page={0}
        rowsPerPage={10}
        selectedRows={[]}
        selectRowUpdate={selectRowUpdate}
        expandedRows={[]}
        toggleExpandRow={toggleExpandRow}
        options={options}
        searchText={''}
        filterList={[]}
      />,
    );

    const actualResult = mountWrapper.html();
    assert.include(actualResult, 'Sorry, no matching records found');
  });

  it('should render a table body with selectable cells if selectableRows = true', () => {
    const options = { selectableRows: true };
    const selectRowUpdate = () => {};
    const toggleExpandRow = () => {};

    const mountWrapper = mount(
      <TableBody
        data={displayData}
        count={displayData.length}
        columns={columns}
        page={0}
        rowsPerPage={10}
        selectedRows={[]}
        selectRowUpdate={selectRowUpdate}
        expandedRows={[]}
        toggleExpandRow={toggleExpandRow}
        options={options}
        searchText={''}
        filterList={[]}
      />,
    );

    const actualResult = mountWrapper.find(TableSelectCell);
    assert.strictEqual(actualResult.length, 4);
  });

  it('should return the correct rowIndex when calling instance method getRowIndex', () => {
    const options = { sort: true, selectableRows: true };
    const selectRowUpdate = () => {};
    const toggleExpandRow = () => {};

    const shallowWrapper = shallow(
      <TableBody
        data={displayData}
        count={displayData.length}
        columns={columns}
        page={1}
        rowsPerPage={2}
        selectedRows={[1, 2, 3]}
        selectRowUpdate={selectRowUpdate}
        expandedRows={[]}
        toggleExpandRow={toggleExpandRow}
        options={options}
        searchText={''}
        filterList={[]}
      />,
    ).dive();

    const instance = shallowWrapper.instance();
    const actualResult = instance.getRowIndex(2);

    assert.strictEqual(actualResult, 4);
  });

  it('should return correctly if row exists in selectedRows when calling instance method isRowSelected', () => {
    const options = { sort: true, selectableRows: true };
    const selectRowUpdate = () => {};
    const toggleExpandRow = () => {};

    const shallowWrapper = shallow(
      <TableBody
        data={displayData}
        count={displayData.length}
        columns={columns}
        page={0}
        rowsPerPage={15}
        selectedRows={[1, 2, 3]}
        selectRowUpdate={selectRowUpdate}
        expandedRows={[]}
        toggleExpandRow={toggleExpandRow}
        options={options}
        searchText={''}
        filterList={[]}
      />,
    ).dive();

    const instance = shallowWrapper.instance();
    const actualResult = instance.isRowSelected(5);

    assert.strictEqual(actualResult, false);
  });

  it('should trigger selectRowUpdate prop callback when calling method handleRowSelect', () => {
    const options = { sort: true, selectableRows: true };
    const selectRowUpdate = spy();
    const toggleExpandRow = () => {};

    const shallowWrapper = shallow(
      <TableBody
        data={displayData}
        count={displayData.length}
        columns={columns}
        page={0}
        rowsPerPage={10}
        selectedRows={[]}
        selectRowUpdate={selectRowUpdate}
        expandedRows={[]}
        toggleExpandRow={toggleExpandRow}
        options={options}
        searchText={''}
        filterList={[]}
      />,
    ).dive();

    const instance = shallowWrapper.instance();
    instance.handleRowSelect(2);
    shallowWrapper.update();

    assert.strictEqual(selectRowUpdate.callCount, 1);
  });

  it('should select the adjacent rows when a row is shift+clicked and a previous row has been selected.', () => {
    let adjacentRows = [];
    const options = { sort: true, selectableRows: true, selectableRowsOnClick: true };
    const previousSelectedRow = { index: 0, dataIndex: 0 };
    const selectRowUpdate = (type, data, adjacent) => {
      adjacentRows = adjacent;
    };
    const selectedRows = { data: [], lookup: {} };
    const toggleExpandRow = () => {};

    const mountWrapper = mount(
      <TableBody
        data={displayData}
        count={displayData.length}
        columns={columns}
        page={0}
        rowsPerPage={10}
        selectedRows={selectedRows}
        selectRowUpdate={selectRowUpdate}
        previousSelectedRow={previousSelectedRow}
        expandedRows={[]}
        toggleExpandRow={toggleExpandRow}
        options={options}
        searchText={''}
        filterList={[]}
      />,
    );

    mountWrapper
      .find('#MUIDataTableBodyRow-3')
      .first()
      .simulate('click', { nativeEvent: { shiftKey: true } });

    assert.strictEqual(adjacentRows.length, 3);
  });

  it('should gather selected row data when clicking row with selectableRowsOnClick=true.', () => {
    let selectedRowData;
    const options = { selectableRows: true, selectableRowsOnClick: true };
    const selectRowUpdate = (type, data) => (selectedRowData = data);
    const toggleExpandRow = spy();

    const mountWrapper = mount(
      <TableBody
        data={displayData}
        count={displayData.length}
        columns={columns}
        page={0}
        rowsPerPage={10}
        selectedRows={[]}
        selectRowUpdate={selectRowUpdate}
        expandedRows={[]}
        toggleExpandRow={toggleExpandRow}
        options={options}
        searchText={''}
        filterList={[]}
      />,
    );

    mountWrapper
      .find('#MUIDataTableBodyRow-2')
      .first()
      .simulate('click');

    const expectedResult = { index: 2, dataIndex: 2 };
    assert.deepEqual(selectedRowData, expectedResult);
    assert.strictEqual(toggleExpandRow.callCount, 0);
  });

  it('should not gather selected row data when clicking row with selectableRowsOnClick=true when it is disabled with isRowSelectable via index.', () => {
    let selectedRowData;
    const options = {
      selectableRows: true,
      selectableRowsOnClick: true,
      isRowSelectable: dataIndex => (dataIndex === 2 ? false : true),
    };
    const selectRowUpdate = (_, data) => (selectedRowData = data);
    const toggleExpandRow = spy();

    const mountWrapper = mount(
      <TableBody
        data={displayData}
        count={displayData.length}
        columns={columns}
        page={0}
        rowsPerPage={10}
        selectedRows={[]}
        selectRowUpdate={selectRowUpdate}
        expandedRows={[]}
        toggleExpandRow={toggleExpandRow}
        options={options}
        searchText={''}
        filterList={[]}
      />,
    );

    mountWrapper
      .find('#MUIDataTableBodyRow-2')
      .first()
      .simulate('click');

    assert.isUndefined(selectedRowData);
    assert.strictEqual(toggleExpandRow.callCount, 0);
  });

  it('should not gather selected row data when clicking row with selectableRowsOnClick=true when it is disabled with isRowSelectable via selectedRows.', () => {
    let selectedRowData;
    const options = {
      selectableRows: true,
      selectableRowsOnClick: true,
      isRowSelectable: (index, selectedRows) => selectedRows.lookup[index] || selectedRows.data.length < 1,
    };
    const selectRowUpdate = (_, data) => (selectedRowData = data);
    const toggleExpandRow = spy();
    const initialSelectedRows = {
      data: [{ index: 1, dataIndex: 1 }],
      lookup: { 1: true },
    };

    const mountWrapper = mount(
      <TableBody
        data={displayData}
        count={displayData.length}
        columns={columns}
        page={0}
        rowsPerPage={10}
        selectedRows={initialSelectedRows}
        selectRowUpdate={selectRowUpdate}
        expandedRows={[]}
        toggleExpandRow={toggleExpandRow}
        options={options}
        searchText={''}
        filterList={[]}
      />,
    );

    mountWrapper
      .find('#MUIDataTableBodyRow-2')
      .first()
      .simulate('click');

    assert.isUndefined(selectedRowData);
    assert.strictEqual(toggleExpandRow.callCount, 0);
  });

  it('should gather selected row data when clicking row with selectableRowsOnClick=true when it is enabled with isRowSelectable via index.', () => {
    let selectedRowData;
    const options = {
      selectableRows: true,
      selectableRowsOnClick: true,
      isRowSelectable: (index, selectedRows) => selectedRows.lookup[index] || selectedRows.data.length < 1,
    };
    const selectRowUpdate = (_, data) => (selectedRowData = data);
    const toggleExpandRow = spy();
    const initialSelectedRows = {
      data: [{ index: 1, dataIndex: 1 }],
      lookup: { 1: true },
    };

    const mountWrapper = mount(
      <TableBody
        data={displayData}
        count={displayData.length}
        columns={columns}
        page={0}
        rowsPerPage={10}
        selectedRows={initialSelectedRows}
        selectRowUpdate={selectRowUpdate}
        expandedRows={[]}
        toggleExpandRow={toggleExpandRow}
        options={options}
        searchText={''}
        filterList={[]}
      />,
    );

    mountWrapper
      .find('#MUIDataTableBodyRow-1')
      .first()
      .simulate('click');

    assert.isDefined(selectedRowData);
    assert.strictEqual(toggleExpandRow.callCount, 0);
  });

  it('should gather expanded row data when clicking row with expandableRows=true and expandableRowsOnClick=true.', () => {
    let expandedRowData;
    const options = { selectableRows: true, expandableRows: true, expandableRowsOnClick: true };
    const selectRowUpdate = spy();
    const toggleExpandRow = data => (expandedRowData = data);

    const mountWrapper = mount(
      <TableBody
        data={displayData}
        count={displayData.length}
        columns={columns}
        page={0}
        rowsPerPage={10}
        selectedRows={[]}
        selectRowUpdate={selectRowUpdate}
        expandedRows={[]}
        toggleExpandRow={toggleExpandRow}
        options={options}
        searchText={''}
        filterList={[]}
      />,
    );

    mountWrapper
      .find('#MUIDataTableBodyRow-2')
      .first()
      .simulate('click');

    const expectedResult = { index: 2, dataIndex: 2 };
    assert.deepEqual(expandedRowData, expectedResult);
    assert.strictEqual(selectRowUpdate.callCount, 0);
  });

  it('should gather both selected and expanded row data when clicking row with expandableRows=true, selectableRowsOnClick=true, and expandableRowsOnClick=true.', () => {
    let expandedRowData;
    let selectedRowData;
    const options = {
      selectableRows: true,
      selectableRowsOnClick: true,
      expandableRows: true,
      expandableRowsOnClick: true,
    };
    const selectRowUpdate = (type, data) => (selectedRowData = data);
    const toggleExpandRow = data => (expandedRowData = data);

    const mountWrapper = mount(
      <TableBody
        data={displayData}
        count={displayData.length}
        columns={columns}
        page={0}
        rowsPerPage={10}
        selectedRows={[]}
        selectRowUpdate={selectRowUpdate}
        expandedRows={[]}
        toggleExpandRow={toggleExpandRow}
        options={options}
        searchText={''}
        filterList={[]}
      />,
    );

    mountWrapper
      .find('#MUIDataTableBodyRow-2')
      .first()
      .simulate('click');

    const expectedResult = { index: 2, dataIndex: 2 };
    assert.deepEqual(selectedRowData, expectedResult);
    assert.deepEqual(expandedRowData, expectedResult);
  });

  it('should not call onRowClick when clicking on checkbox for selectable row', () => {
    const options = { selectableRows: true, onRowClick: spy() };
    const selectRowUpdate = spy();
    const toggleExpandRow = spy();

    const mountWrapper = mount(
      <TableBody
        data={displayData}
        count={displayData.length}
        columns={columns}
        page={0}
        rowsPerPage={10}
        selectedRows={[]}
        selectRowUpdate={selectRowUpdate}
        expandedRows={[]}
        toggleExpandRow={toggleExpandRow}
        options={options}
        searchText={''}
        filterList={[]}
      />,
    );

    mountWrapper
      .find('TableSelectCell')
      .first()
      .find('input')
      .simulate('click');

    assert.strictEqual(options.onRowClick.callCount, 0);
  });

  it('should not call onRowClick when clicking to select a row', () => {
    const options = { selectableRows: true, selectableRowsOnClick: true, onRowClick: spy() };
    const selectRowUpdate = spy();
    const toggleExpandRow = spy();

    const mountWrapper = mount(
      <TableBody
        data={displayData}
        count={displayData.length}
        columns={columns}
        page={0}
        rowsPerPage={10}
        selectedRows={[]}
        selectRowUpdate={selectRowUpdate}
        expandedRows={[]}
        toggleExpandRow={toggleExpandRow}
        options={options}
        searchText={''}
        filterList={[]}
      />,
    );

    mountWrapper
      .find('TableSelectCell')
      .first()
      .simulate('click');

    assert.strictEqual(options.onRowClick.callCount, 0);
  });

  it('should call onRowClick when Row is clicked', () => {
    const options = { selectableRows: true, onRowClick: spy() };
    const selectRowUpdate = stub();
    const toggleExpandRow = () => {};

    const mountWrapper = mount(
      <TableBody
        data={displayData}
        count={displayData.length}
        columns={columns}
        page={0}
        rowsPerPage={10}
        selectedRows={[]}
        selectRowUpdate={selectRowUpdate}
        expandedRows={[]}
        toggleExpandRow={toggleExpandRow}
        options={options}
        searchText={''}
        filterList={[]}
      />,
    );

    mountWrapper
      .find('#MUIDataTableBodyRow-2')
      .first()
      .simulate('click');

    assert.strictEqual(options.onRowClick.callCount, 1);
    assert(options.onRowClick.calledWith(data[2], { rowIndex: 2, dataIndex: 2 }));
  });

  it("should add custom props to rows if 'setRowProps' provided", () => {
    const options = { setRowProps: stub().returns({ className: 'testClass' }) };
    const selectRowUpdate = stub();
    const toggleExpandRow = () => {};

    const mountWrapper = mount(
      <TableBody
        data={displayData}
        count={displayData.length}
        columns={columns}
        page={0}
        rowsPerPage={10}
        selectedRows={[]}
        selectRowUpdate={selectRowUpdate}
        expandedRows={[]}
        toggleExpandRow={toggleExpandRow}
        options={options}
        searchText={''}
        filterList={[]}
      />,
    );

    const props = mountWrapper
      .find('#MUIDataTableBodyRow-1')
      .first()
      .props();

    assert.strictEqual(props.className, 'testClass');
    assert.isAtLeast(options.setRowProps.callCount, 1);
    assert(options.setRowProps.calledWith(data[1]));
  });

  it("should use 'customRowRender' when provided", () => {
    const options = { customRowRender: () => <div>Test_Text</div> };
    const selectRowUpdate = stub();
    const toggleExpandRow = () => {};

    const mountWrapper = mount(
      <TableBody
        data={displayData}
        count={displayData.length}
        columns={columns}
        page={0}
        rowsPerPage={10}
        selectedRows={[]}
        selectRowUpdate={selectRowUpdate}
        expandedRows={[]}
        toggleExpandRow={toggleExpandRow}
        options={options}
        searchText={''}
        filterList={[]}
      />,
    );

    const html = mountWrapper.html();

    expect(html).to.contain('Test_Text');
  });

  it('should pass in selectedRows to isRowSelectable', () => {
    const selectedIndex = 2;
    const originalSelectedRows = {
      data: [{ index: selectedIndex, dataIndex: selectedIndex }],
      lookup: { [selectedIndex]: true },
    };
    const isRowSelectable = spy((_, selectedRows) => {
      assert.deepEqual(selectedRows, originalSelectedRows);
      return true;
    });

    const options = { selectableRows: true, isRowSelectable };

    mount(
      <TableBody
        data={displayData}
        count={displayData.length}
        columns={columns}
        page={0}
        selectedRows={originalSelectedRows}
        rowsPerPage={10}
        expandedRows={[]}
        options={options}
        searchText={''}
        filterList={[]}
      />,
    );

    assert.equal(isRowSelectable.callCount, displayData.length);
  });
});
