import React from "react";
import { spy } from "sinon";
import { mount, shallow } from "enzyme";
import { assert, expect, should } from "chai";
import MUIDataTable from "../src/MUIDataTable";
import MUIDataTableFilterList from "../src/MUIDataTableFilterList";
import MUIDataTablePagination from "../src/MUIDataTablePagination";
import textLabels from "../src/textLabels";
import Chip from "@material-ui/core/Chip";
import Cities from "../examples/component/cities";

describe("<MUIDataTable />", function() {
  let data;
  let displayData;
  let columns;
  let renderCities = (index, value, updateValue) => (
    <Cities value={value} index={index} change={event => updateValue(event)} />
  );
  let renderName = (index, value) => value.split(" ")[1] + ", " + value.split(" ")[0];

  before(() => {
    columns = [
      { name: "Name", options: { customRender: renderName } },
      "Company",
      { name: "City", options: { customRender: renderCities } },
      { name: "State" },
    ];
    displayData = JSON.stringify([
      ["James, Joe", "Test Corp", renderCities(0, "Yonkers"), "NY"],
      ["Walsh, John", "Test Corp", renderCities(1, "Hartford"), "CT"],
      ["Herm, Bob", "Test Corp", renderCities(2, "Tampa"), "FL"],
      ["Houston, James", "Test Corp", renderCities(3, "Dallas"), "TX"],
    ]);
    data = [
      ["Joe James", "Test Corp", "Yonkers", "NY"],
      ["John Walsh", "Test Corp", "Hartford", "CT"],
      ["Bob Herm", "Test Corp", "Tampa", "FL"],
      ["James Houston", "Test Corp", "Dallas", "TX"],
    ];
    renderCities = renderCities;
    renderName = renderName;
  });

  it("should render a table", () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    assert.strictEqual(
      shallowWrapper
        .dive()
        .dive()
        .name(),
      "Paper",
    );
  });

  it("should correctly build internal columns data structure", () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    const actualResult = shallowWrapper.dive().state().columns;

    const expectedResult = [
      { display: true, name: "Name", sort: true, filter: true, sortDirection: null, customRender: renderName },
      { display: true, name: "Company", sort: true, filter: true, sortDirection: null },
      {
        display: true,
        name: "City",
        sort: true,
        filter: true,
        sortDirection: null,
        customRender: renderCities,
      },
      { display: true, name: "State", sort: true, filter: true, sortDirection: null },
    ];

    assert.deepEqual(actualResult, expectedResult);
  });

  it("should correctly build internal table data and displayData structure", () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    const state = shallowWrapper.dive().state();
    assert.deepEqual(state.data, data);
    assert.deepEqual(JSON.stringify(state.displayData), displayData);
  });

  it("should correctly re-build internal table data and displayData structure with prop change", () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    let state = shallowWrapper.dive().state();

    assert.deepEqual(state.data, data);
    assert.deepEqual(JSON.stringify(state.displayData), displayData);

    // now use updated props
    let newData = data.map(item => [...item]);
    newData[0][0] = "testing";
    shallowWrapper.setProps({ data: newData });
    shallowWrapper.update();

    state = shallowWrapper.dive().state();
    const expectedResult = [
      ["testing", "Test Corp", "Yonkers", "NY"],
      ["John Walsh", "Test Corp", "Hartford", "CT"],
      ["Bob Herm", "Test Corp", "Tampa", "FL"],
      ["James Houston", "Test Corp", "Dallas", "TX"],
    ];

    assert.deepEqual(state.data, expectedResult);
  });

  it("should not re-build internal table data and displayData structure with no prop change to data or columns", () => {
    const initializeTableSpy = spy(MUIDataTable.Naked.prototype, "initializeTable");
    const mountWrapper = mount(shallow(<MUIDataTable columns={columns} data={data} />).get(0));

    let state = mountWrapper.state();
    assert.deepEqual(state.data, data);
    assert.deepEqual(JSON.stringify(state.displayData), displayData);

    // now update props with no change
    mountWrapper.setProps({});
    mountWrapper.update();

    state = mountWrapper.state();

    assert.deepEqual(state.data, data);
    assert.deepEqual(initializeTableSpy.callCount, 1);
  });

  it("should correctly build internal filterList structure", () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    const state = shallowWrapper.dive().state();
    const expectedResult = [[], [], [], []];

    assert.deepEqual(state.filterList, expectedResult);
  });

  it("should correctly build internal unique column data for filterData structure", () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    const state = shallowWrapper.dive().state();
    const expectedResult = [
      ["Herm, Bob", "Houston, James", "James, Joe", "Walsh, John"],
      ["Test Corp"],
      ["Dallas", "Hartford", "Tampa", "Yonkers"],
      ["CT", "FL", "NY", "TX"],
    ];

    assert.deepEqual(state.filterData, expectedResult);
  });

  it("should correctly build internal rowsPerPage when provided in options", () => {
    const options = {
      rowsPerPage: 20,
      textLabels,
    };

    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} options={options} />);
    const state = shallowWrapper.dive().state();
    assert.strictEqual(state.rowsPerPage, 20);
  });

  it("should correctly build internal rowsPerPageOptions when provided in options", () => {
    const options = {
      rowsPerPageOptions: [5, 10, 15],
    };

    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} options={options} />);
    const state = shallowWrapper.dive().state();
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
    const table = shallowWrapper.dive();
    const instance = table.instance();
    instance.filterUpdate(0, "Joe James", "checkbox");
    table.update();

    const state = table.state();
    assert.deepEqual(state.filterList, [["Joe James"], [], [], []]);
  });

  it("should remove entry from filterList when calling filterUpdate method with type=checkbox and same arguments a second time", () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    const table = shallowWrapper.dive();
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
    const table = shallowWrapper.dive();
    const instance = table.instance();
    instance.filterUpdate(0, "Joe James", "dropdown");
    table.update();

    const state = table.state();
    assert.deepEqual(state.filterList, [["Joe James"], [], [], []]);
  });

  it("should create Chip when filterList is populated", () => {
    const filterList = [["Joe James"], [], [], []];

    const mountWrapper = mount(<MUIDataTableFilterList filterList={filterList} filterUpdate={() => true} />);
    const actualResult = mountWrapper.find(Chip);
    assert.strictEqual(actualResult.length, 1);
  });

  it("should remove entry from filterList when calling filterUpdate method with type=dropdown and same arguments a second time", () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    const table = shallowWrapper.dive();
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
    const table = shallowWrapper.dive();
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
    const table = shallowWrapper.dive();
    const instance = table.instance();

    instance.searchTextUpdate("Joe");
    table.update();
    const state = table.state();

    const expectedResult = JSON.stringify([["James, Joe", "Test Corp", renderCities(0, "Yonkers"), "NY"]]);

    assert.deepEqual(JSON.stringify(state.displayData), expectedResult);
  });

  it("should sort provided column when calling toggleSortColum method", () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />).dive();
    const instance = shallowWrapper.instance();

    instance.toggleSortColumn(0);
    shallowWrapper.update();
    const state = shallowWrapper.state();

    const expectedResult = JSON.stringify([
      ["Herm, Bob", "Test Corp", renderCities(0, "Tampa"), "FL"],
      ["Houston, James", "Test Corp", renderCities(1, "Dallas"), "TX"],
      ["James, Joe", "Test Corp", renderCities(2, "Yonkers"), "NY"],
      ["Walsh, John", "Test Corp", renderCities(3, "Hartford"), "CT"],
    ]);

    assert.deepEqual(JSON.stringify(state.displayData), expectedResult);
  });

  it("should toggle provided column when calling toggleViewCol method", () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />).dive();
    const instance = shallowWrapper.instance();

    instance.toggleViewColumn(0);
    shallowWrapper.update();
    const state = shallowWrapper.state();

    const expectedResult = [
      { name: "Name", display: false, sort: true, filter: true, sortDirection: null, customRender: renderName },
      { name: "Company", display: true, sort: true, filter: true, sortDirection: null },
      {
        name: "City",
        display: true,
        sort: true,
        filter: true,
        sortDirection: null,
        customRender: renderCities,
      },
      { name: "State", display: true, sort: true, filter: true, sortDirection: null },
    ];

    assert.deepEqual(state.columns, expectedResult);
  });

  it("should get displayable data when calling getDisplayData method", () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />).dive();
    const instance = shallowWrapper.instance();
    const state = shallowWrapper.state();

    const actualResult = instance.getDisplayData(columns, data, state.filterList, "");
    const expectedResult = [
      ["Joe James", "Test Corp", "Yonkers", "NY"],
      ["John Walsh", "Test Corp", "Hartford", "CT"],
      ["Bob Herm", "Test Corp", "Tampa", "FL"],
      ["James Houston", "Test Corp", "Dallas", "TX"],
    ];

    assert.deepEqual(actualResult, expectedResult);
  });

  it("should update rowsPerPage when calling changeRowsPerPage method", () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />).dive();
    const instance = shallowWrapper.instance();

    instance.changeRowsPerPage(10);
    shallowWrapper.update();

    const state = shallowWrapper.state();
    assert.deepEqual(state.rowsPerPage, 10);
  });

  it("should update page position when calling changePage method", () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />).dive();
    const instance = shallowWrapper.instance();

    instance.changePage(2);
    shallowWrapper.update();

    const state = shallowWrapper.state();
    assert.deepEqual(state.page, 2);
  });

  it("should update selectedRows when calling selectRowUpdate method with type=head", () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />).dive();
    const instance = shallowWrapper.instance();

    instance.selectRowUpdate("head", 0);
    shallowWrapper.update();

    const state = shallowWrapper.state();
    assert.deepEqual(state.selectedRows, [0, 1, 2, 3]);
  });

  it("should update selectedRows when calling selectRowUpdate method with type=cell", () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />).dive();
    const instance = shallowWrapper.instance();

    instance.selectRowUpdate("cell", 0);
    shallowWrapper.update();

    const state = shallowWrapper.state();
    assert.deepEqual(state.selectedRows, [0]);
  });

  it("should update value when calling updateValue method in customRender", () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />).dive();
    const instance = shallowWrapper.instance();

    instance.updateDataCol(0, 2, "Las Vegas");
    shallowWrapper.update();

    const state = shallowWrapper.state();
    assert.deepEqual(state.data[0][2], "Las Vegas");
  });
});
