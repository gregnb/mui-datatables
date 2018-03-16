import React from "react";
import { spy, stub } from "sinon";
import { mount, shallow } from "enzyme";
import { assert, expect, should } from "chai";
import Select from "material-ui/Select";
import Checkbox from "material-ui/Checkbox";
import MUIDataTableFilter from "../src/MUIDataTableFilter";
import { defaultFilterStyles } from "../src/MUIDataTableToolbar";

describe("<MUIDataTableFilter />", function() {
  let data;
  let columns;
  let filterData;

  before(() => {
    columns = [
      { name: "First Name", display: true, sort: true, filter: true, sortDirection: "desc" },
      { name: "Company", display: true, sort: true, filter: true, sortDirection: "desc" },
      { name: "City", display: true, sort: true, filter: true, sortDirection: "desc" },
      { name: "State", display: true, sort: true, filter: true, sortDirection: "desc" },
    ];

    data = [
      ["Joe James", "Test Corp", "Yonkers", "NY"],
      ["John Walsh", "Test Corp", "Hartford", "CT"],
      ["Bob Herm", "Test Corp", "Tampa", "FL"],
      ["James Houston", "Test Corp", "Dallas", "TX"],
    ];

    filterData = [
      ["Joe James", "John Walsh", "Bob Herm", "James Houston"],
      ["Test Corp"],
      ["Yonkers", "Hartford", "Tampa", "Dallas"],
      ["NY", "CT", "FL", "TX"],
    ];
  });

  it("should data table filter view with checkboxes if filterType = 'checkbox'", () => {
    const options = { filterType: "checkbox" };
    const filterList = [[], [], [], []];
    const shallowWrapper = mount(
      <MUIDataTableFilter
        columns={columns}
        filterStyles={defaultFilterStyles}
        filterData={filterData}
        filterList={filterList}
        options={options}
      />,
    );

    const actualResult = shallowWrapper.find(Checkbox);
    assert.strictEqual(actualResult.length, 13);
  });

  it("should data table filter view with selects if filterType = 'select'", () => {
    const options = { filterType: "select" };
    const filterList = [[], [], [], []];
    const mountWrapper = mount(
      <MUIDataTableFilter
        columns={columns}
        filterStyles={defaultFilterStyles}
        filterData={filterData}
        filterList={filterList}
        options={options}
      />,
    );

    const actualResult = mountWrapper.find(Select);
    assert.strictEqual(actualResult.length, 4);
  });

  it("should trigger onFilterUpdate prop callback when calling method handleCheckboxChange", () => {
    const options = { filterType: "checkbox" };
    const filterList = [[], [], [], []];
    const onFilterUpdate = spy();

    const shallowWrapper = shallow(
      <MUIDataTableFilter
        columns={columns}
        onFilterUpdate={onFilterUpdate}
        filterStyles={defaultFilterStyles}
        filterData={filterData}
        filterList={filterList}
        options={options}
      />,
    );
    const instance = shallowWrapper.instance();

    //const event = { target: { value: 0 }};
    instance.handleCheckboxChange(0, 0);
    assert.strictEqual(onFilterUpdate.callCount, 1);
  });

  it("should trigger onFilterUpdate prop callback when calling method handleDropdownChange", () => {
    const options = { filterType: "select" };
    const filterList = [[], [], [], []];
    const onFilterUpdate = spy();

    const shallowWrapper = shallow(
      <MUIDataTableFilter
        columns={columns}
        onFilterUpdate={onFilterUpdate}
        filterStyles={defaultFilterStyles}
        filterData={filterData}
        filterList={filterList}
        options={options}
      />,
    );
    const instance = shallowWrapper.instance();

    const event = { target: { value: "All" } };
    instance.handleDropdownChange(event, 0);
    assert.strictEqual(onFilterUpdate.callCount, 1);
  });
});
