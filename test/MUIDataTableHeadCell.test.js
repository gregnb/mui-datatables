import React from "react";
import { spy, stub } from "sinon";
import { mount, shallow } from "enzyme";
import { assert, expect, should } from "chai";
import MUIDataTableHeadCell from "../src/MUIDataTableHeadCell";
import Tooltip from "material-ui/Tooltip";

describe("<MUIDataTableHeadCell />", function() {
  let classes;

  before(() => {
    classes = {
      root: {},
    };
  });

  it("should render a table head cell with sort label when options.sort = true provided", () => {
    const options = { sort: true };
    const toggleSort = () => {};

    const shallowWrapper = shallow(
      <MUIDataTableHeadCell
        options={options}
        sortDirection={"asc"}
        sort={true}
        toggleSort={toggleSort}
        classes={classes}>
        some content
      </MUIDataTableHeadCell>,
    );

    const actualResult = shallowWrapper.find(Tooltip);
    assert.strictEqual(actualResult.length, 1);
  });

  it("should render a table head cell without sort label when options.sort = false provided", () => {
    const options = { sort: false };
    const toggleSort = () => {};

    const shallowWrapper = shallow(
      <MUIDataTableHeadCell
        options={options}
        sortDirection={"asc"}
        sort={true}
        toggleSort={toggleSort}
        classes={classes}>
        some content
      </MUIDataTableHeadCell>,
    );

    const actualResult = shallowWrapper.find(Tooltip);
    assert.strictEqual(actualResult.length, 0);
  });

  it("should trigger toggleSort prop callback when calling method handleSortClick", () => {
    const options = { sort: true };
    const toggleSort = spy();

    const shallowWrapper = shallow(
      <MUIDataTableHeadCell options={options} index={0} sortDirection={"asc"} toggleSort={toggleSort} classes={classes}>
        some content
      </MUIDataTableHeadCell>,
    );

    const instance = shallowWrapper.instance();

    const event = { target: { value: "All" } };
    instance.handleSortClick();
    assert.strictEqual(toggleSort.callCount, 1);
  });
});
