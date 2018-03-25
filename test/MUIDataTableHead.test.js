import React from "react";
import { spy, stub } from "sinon";
import { mount, shallow } from "enzyme";
import { assert, expect, should } from "chai";
import MUIDataTableHead from "../src/MUIDataTableHead";
import MUIDataTableHeadCell from "../src/MUIDataTableHeadCell";
import Tooltip from "material-ui/Tooltip";

describe("<MUIDataTableHead />", function() {
  let columns;

  before(() => {
    columns = [
      { name: "First Name", display: true, sort: null },
      { name: "Company", display: true, sort: null },
      { name: "City", display: true, sort: null },
      { name: "State", display: true, sort: null },
    ];
  });

  it("should render a table head", () => {
    const options = {};
    const toggleSort = () => {};

    const mountWrapper = mount(<MUIDataTableHead columns={columns} options={options} toggleSort={toggleSort} />);
    const actualResult = mountWrapper.find(MUIDataTableHeadCell);
    assert.strictEqual(actualResult.length, 4);
  });

  it("should render a table head with no cells", () => {
    const options = {};
    const toggleSort = () => {};

    const newColumns = columns.map(column => ({ ...column, display: false }));
    const mountWrapper = mount(<MUIDataTableHead columns={newColumns} options={options} toggleSort={toggleSort} />);
    const actualResult = mountWrapper.find(MUIDataTableHeadCell);
    assert.strictEqual(actualResult.length, 0);
  });

  it("should trigger toggleSort prop callback when calling method handleToggleColumn", () => {
    const options = { sort: true };
    const toggleSort = spy();

    const shallowWrapper = shallow(
      <MUIDataTableHead columns={columns} options={options} toggleSort={toggleSort} />,
    ).dive();

    const instance = shallowWrapper.instance();
    instance.handleToggleColumn(2);
    shallowWrapper.update();

    let state = shallowWrapper.state();
    assert.strictEqual(state.activeColumn, 2);
    assert.strictEqual(toggleSort.callCount, 1);
  });
});
