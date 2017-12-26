import React from "react";
import { spy, stub } from "sinon";
import { mount, shallow } from "enzyme";
import { assert, expect, should } from "chai";
import IconButton from "material-ui/IconButton";
import MUIDataTableToolbar from "../src/MUIDataTableToolbar";
import MUIDataTableSearch from "../src/MUIDataTableSearch";

describe("<MUIDataTableToolbar />", function() {
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

  it("should render a toolbar", () => {
    const options = {};
    const mountWrapper = mount(<MUIDataTableToolbar columns={columns} data={data} options={options} />);
    const actualResult = mountWrapper.find(IconButton);
    assert.strictEqual(actualResult.length, 5);
  });

  it("should render a toolbar with a search clicking search icon", () => {
    const options = {};
    const mountWrapper = mount(<MUIDataTableToolbar columns={columns} data={data} options={options} />);
    const instance = mountWrapper.instance();

    instance.setActiveIcon("search");
    mountWrapper.update();

    const actualResult = mountWrapper.find(MUIDataTableSearch);
    assert.strictEqual(actualResult.length, 1);
  });

  it("should hide search after clicking cancel icon", () => {
    const searchTextUpdate = () => {};
    const options = {};
    const mountWrapper = mount(
      <MUIDataTableToolbar searchTextUpdate={searchTextUpdate} columns={columns} data={data} options={options} />,
    );
    const instance = mountWrapper.instance();

    // display search
    instance.setActiveIcon("search");
    mountWrapper.update();

    let actualResult = mountWrapper.find(MUIDataTableSearch);
    assert.strictEqual(actualResult.length, 1);

    // now hide it and test
    instance.hideSearch();
    mountWrapper.update();

    actualResult = mountWrapper.find(MUIDataTableSearch);
    assert.strictEqual(actualResult.length, 0);
  });

  it("should open new print window when calling method handlePrint", () => {
    const options = {};
    const node = window.document.createElement("div");
    const tableRef = () => node;

    const mountWrapper = mount(
      <MUIDataTableToolbar columns={columns} data={data} options={options} tableRef={tableRef} />,
    );
    const instance = mountWrapper.instance();

    const printSpy = spy();
    const closeSpy = spy();

    let stubOpen = stub(window, "open");
    stubOpen.returns({
      document: window.document,
      print: printSpy,
      close: closeSpy,
    });

    instance.handlePrint();
    assert.strictEqual(printSpy.callCount, 1);
    assert.strictEqual(closeSpy.callCount, 1);
  });

  it("should set icon when calling method setActiveIcon", () => {
    const options = {};
    const mountWrapper = mount(<MUIDataTableToolbar columns={columns} data={data} options={options} />);
    const instance = mountWrapper.instance();

    instance.setActiveIcon("filter");
    mountWrapper.update();

    const state = mountWrapper.state();
    assert.strictEqual(state.iconActive, "filter");
  });

  it("should download CSV when calling method handleCSVDownload", () => {
    const options = {};
    const mountWrapper = mount(<MUIDataTableToolbar columns={columns} data={data} options={options} />);
    const instance = mountWrapper.instance();

    const appendSpy = spy(document.body, "appendChild");
    const removeSpy = spy(document.body, "removeChild");
    instance.handleCSVDownload();

    assert.strictEqual(appendSpy.callCount, 1);
    assert.strictEqual(removeSpy.callCount, 1);
  });

});
