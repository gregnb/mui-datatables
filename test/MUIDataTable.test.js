import React from "react";
import { spy } from "sinon";
import { mount, shallow } from "enzyme";
import { assert, expect, should } from "chai";
import MUIDataTable from "../src/MUIDataTable";
import MUIDataTablePagination from "../src/MUIDataTablePagination";

describe("<MUIDataTable />", function() {
  let data;
  let columns;

  before(() => {
    columns = ["First Name", "Company", "City", "State"];
    data = [
      ["Joe James", "Test Corp", "Yonkers", "NY"],
      ["John Walsh", "Test Corp", "Hartford", "CT"],
      ["Bob Herm", "Test Corp", "Tampa", "FL"],
      ["James Houston", "Test Corp", "Dallas", "TX"],
    ];
  });

  it("should render a table", () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    assert.strictEqual(
      shallowWrapper
        .dive()
        .dive()
        .name(),
      "MUIDataTable",
    );
  });

  it("should correctly build internal columns data structure", () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    const actualResult = shallowWrapper.state().columns;
    const expectedResult = [
      { display: true, name: "First Name", sort: null },
      { display: true, name: "Company", sort: null },
      { display: true, name: "City", sort: null },
      { display: true, name: "State", sort: null },
    ];

    assert.deepEqual(actualResult, expectedResult);
  });

  it("should correctly build internal table data and displayData structure", () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    const state = shallowWrapper.state();
    assert.deepEqual(state.data, data);
    assert.deepEqual(state.displayData, data);
  });

  it("should correctly re-build internal table data and displayData structure with prop change", () => {
    const mountWrapper = mount(<MUIDataTable columns={columns} data={data} />);
    let state = mountWrapper.state();
    assert.deepEqual(state.data, data);
    assert.deepEqual(state.displayData, data);

    // now use updated props
    let newData = data.map(item => [...item]);
    newData[0][0] = "testing";
    mountWrapper.setProps({ data: newData });
    mountWrapper.update();

    state = mountWrapper.state();
    const expectedResult = [
      ["testing", "Test Corp", "Yonkers", "NY"],
      ["John Walsh", "Test Corp", "Hartford", "CT"],
      ["Bob Herm", "Test Corp", "Tampa", "FL"],
      ["James Houston", "Test Corp", "Dallas", "TX"],
    ];

    assert.deepEqual(state.data, expectedResult);
  });

  it("should not re-build internal table data and displayData structure with no prop change to data or columns", () => {
    const initializeTableSpy = spy(MUIDataTable.prototype, "initializeTable");
    const mountWrapper = mount(<MUIDataTable columns={columns} data={data} />);

    let state = mountWrapper.state();
    assert.deepEqual(state.data, data);
    assert.deepEqual(state.displayData, data);

    // now update props with no change
    mountWrapper.setProps({});
    mountWrapper.update();

    state = mountWrapper.state();
    assert.deepEqual(state.data, data);
    assert.deepEqual(initializeTableSpy.callCount, 1);
  });

  it("should correctly build internal filterList structure", () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    const state = shallowWrapper.state();
    const expectedResult = [[], [], [], []];

    assert.deepEqual(state.filterList, expectedResult);
  });

  it("should correctly build internal unique column data for filterData structure", () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    const state = shallowWrapper.state();
    const expectedResult = [
      ["Joe James", "John Walsh", "Bob Herm", "James Houston"],
      ["Test Corp"],
      ["Yonkers", "Hartford", "Tampa", "Dallas"],
      ["NY", "CT", "FL", "TX"],
    ];

    assert.deepEqual(state.filterData, expectedResult);
  });

  it("should correctly build internal rowsPerPage when provided in options", () => {
    const options = {
      rowsPerPage: 20,
    };

    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} options={options} />);
    const state = shallowWrapper.state();
    assert.strictEqual(state.rowsPerPage, 20);
  });

  it("should correctly build internal rowsPerPageOptions when provided in options", () => {
    const options = {
      rowsPerPageOptions: [5, 10, 15],
    };

    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} options={options} />);
    const state = shallowWrapper.state();
    assert.deepEqual(state.rowsPerPageOptions, [5, 10, 15]);
  });

  it("should render pagination when enabled in options", () => {
    const options = {
      pagination: true,
    };

    const mountWrapper = mount(<MUIDataTable columns={columns} data={data} options={options} />);
    const actualResult = mountWrapper.find(MUIDataTablePagination);
    assert.lengthOf(actualResult, 1);
  });

  it("should not render pagination when disabled in options", () => {
    const options = {
      pagination: false,
    };

    const mountWrapper = mount(<MUIDataTable columns={columns} data={data} options={options} />);
    const actualResult = mountWrapper.find(MUIDataTablePagination);
    assert.lengthOf(actualResult, 0);
  });

  it("should properly set internal filterList when calling filterUpdate method with type=checkbox", () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    const table = shallowWrapper;
    const instance = table.instance();
    instance.filterUpdate(0, "Joe James", "checkbox");
    table.update();

    const state = table.state();
    assert.deepEqual(state.filterList, [["Joe James"], [], [], []]);
  });

  it("should remove entry from filterList when calling filterUpdate method with type=checkbox and same arguments a second time", () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    const table = shallowWrapper;
    const instance = table.instance();
    instance.filterUpdate(0, "Joe James", "checkbox");
    table.update();

    let state = table.state();
    assert.deepEqual(state.filterList, [["Joe James"], [], [], []]);

    instance.filterUpdate(0, "Joe James", "checkbox");
    table.update();

    state = table.state();
    assert.deepEqual(state.filterList, [[], [], [], []]);
  });

  it("should properly set internal filterList when calling filterUpdate method with type=dropdown", () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    const table = shallowWrapper;
    const instance = table.instance();
    instance.filterUpdate(0, "Joe James", "dropdown");
    table.update();

    const state = table.state();
    assert.deepEqual(state.filterList, [["Joe James"], [], [], []]);
  });

  it("should remove entry from filterList when calling filterUpdate method with type=dropdown and same arguments a second time", () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    const table = shallowWrapper;
    const instance = table.instance();
    instance.filterUpdate(0, "Joe James", "dropdown");
    table.update();

    let state = table.state();
    assert.deepEqual(state.filterList, [["Joe James"], [], [], []]);

    instance.filterUpdate(0, "Joe James", "dropdown");
    table.update();

    state = table.state();
    assert.deepEqual(state.filterList, [[], [], [], []]);
  });

  it("should properly reset internal filterList when calling resetFilters method", () => {
    // set a filter
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    const table = shallowWrapper;
    const instance = table.instance();
    instance.filterUpdate(0, "Joe James", "checkbox");
    table.update();

    // now remove it
    let state = table.state();
    assert.deepEqual(state.filterList, [["Joe James"], [], [], []]);

    instance.resetFilters();
    table.update();
    state = table.state();
    assert.deepEqual(state.filterList, [[], [], [], []]);
  });

  it("should properly set searchText when calling searchTextUpdate method", () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    const table = shallowWrapper;
    const instance = table.instance();

    instance.searchTextUpdate("Joe James");
    table.update();
    const state = table.state();

    assert.deepEqual(state.displayData, [["Joe James", "Test Corp", "Yonkers", "NY"]]);
  });

  it("should sort provided column when calling toggleSortColum method", () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    const instance = shallowWrapper.instance();

    instance.toggleSortColumn(0);
    shallowWrapper.update();
    const state = shallowWrapper.state();

    const expectedResult = [
      ["Bob Herm", "Test Corp", "Tampa", "FL"],
      ["James Houston", "Test Corp", "Dallas", "TX"],
      ["Joe James", "Test Corp", "Yonkers", "NY"],
      ["John Walsh", "Test Corp", "Hartford", "CT"],
    ];

    assert.deepEqual(state.displayData, expectedResult);
  });

  it("should toggle provided column when calling toggleViewCol method", () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    const instance = shallowWrapper.instance();

    instance.toggleViewColumn(0);
    shallowWrapper.update();
    const state = shallowWrapper.state();

    const expectedResult = [
      { name: "First Name", display: false, sort: null },
      { name: "Company", display: true, sort: null },
      { name: "City", display: true, sort: null },
      { name: "State", display: true, sort: null },
    ];

    assert.deepEqual(state.columns, expectedResult);
  });

  it("should get displayable data when calling getDisplayData method", () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    const instance = shallowWrapper.instance();
    const state = shallowWrapper.state();

    const actualResult = instance.getDisplayData(data, state.filterList, "");
    const expectedResult = [
      ["Joe James", "Test Corp", "Yonkers", "NY"],
      ["John Walsh", "Test Corp", "Hartford", "CT"],
      ["Bob Herm", "Test Corp", "Tampa", "FL"],
      ["James Houston", "Test Corp", "Dallas", "TX"],
    ];

    assert.deepEqual(actualResult, expectedResult);
  });

  it("should update rowsPerPage when calling changeRowsPerPage method", () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    const instance = shallowWrapper.instance();

    instance.changeRowsPerPage(10);
    shallowWrapper.update();

    const state = shallowWrapper.state();
    assert.deepEqual(state.rowsPerPage, 10);
  });

  it("should update page position when calling changePage method", () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    const instance = shallowWrapper.instance();

    instance.changePage(2);
    shallowWrapper.update();

    const state = shallowWrapper.state();
    assert.deepEqual(state.page, 2);
  });
});
