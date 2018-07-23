import React from "react";
import { spy, stub } from "sinon";
import { mount, shallow } from "enzyme";
import { assert, expect, should } from "chai";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import DownloadIcon from "@material-ui/icons/CloudDownload";
import PrintIcon from "@material-ui/icons/Print";
import ViewColumnIcon from "@material-ui/icons/ViewColumn";
import ClearIcon from "@material-ui/icons/Clear";
import FilterIcon from "@material-ui/icons/FilterList";
import MUIDataTableToolbar from "../src/MUIDataTableToolbar";
import MUIDataTableSearch from "../src/MUIDataTableSearch";
import textLabels from "../src/textLabels";

describe("<MUIDataTableToolbar />", function() {
  let data;
  let columns;
  let options;

  before(() => {
    options = {
      print: true,
      download: true,
      search: true,
      filter: true,
      viewColumns: true,
      textLabels,
    };
    columns = ["First Name", "Company", "City", "State"];
    data = [
      {
        data: ["Joe James", "Test Corp", "Yonkers", "NY"],
        dataIndex: 0,
      },
      {
        data: ["John Walsh", "Test Corp", "Hartford", "CT"],
        dataIndex: 1,
      },
      {
        data: ["Bob Herm", "Test Corp", "Tampa", "FL"],
        dataIndex: 2,
      },
      {
        data: ["James Houston", "Test Corp", "Dallas", "TX"],
        dataIndex: 3,
      },
    ];
  });

  it("should render a toolbar", () => {
    const mountWrapper = mount(<MUIDataTableToolbar columns={columns} data={data} options={options} />);
    const actualResult = mountWrapper.find(IconButton);
    assert.strictEqual(actualResult.length, 5);
  });

  it("should render a toolbar with no search icon if option.search = false", () => {
    const newOptions = { ...options, search: false };
    const mountWrapper = mount(<MUIDataTableToolbar columns={columns} data={data} options={newOptions} />);
    const actualResult = mountWrapper.find(SearchIcon);
    assert.strictEqual(actualResult.length, 0);
  });

  it("should render a toolbar with no download icon if option.download = false", () => {
    const newOptions = { ...options, download: false };
    const mountWrapper = mount(<MUIDataTableToolbar columns={columns} data={data} options={newOptions} />);
    const actualResult = mountWrapper.find(DownloadIcon);
    assert.strictEqual(actualResult.length, 0);
  });

  it("should render a toolbar with no print icon if option.print = false", () => {
    const newOptions = { ...options, print: false };
    const mountWrapper = mount(<MUIDataTableToolbar columns={columns} data={data} options={newOptions} />);
    const actualResult = mountWrapper.find(PrintIcon);
    assert.strictEqual(actualResult.length, 0);
  });

  it("should render a toolbar with no view columns icon if option.viewColumns = false", () => {
    const newOptions = { ...options, viewColumns: false };
    const mountWrapper = mount(<MUIDataTableToolbar columns={columns} data={data} options={newOptions} />);
    const actualResult = mountWrapper.find(ViewColumnIcon);
    assert.strictEqual(actualResult.length, 0);
  });

  it("should render a toolbar with no filter icon if option.filter = false", () => {
    const newOptions = { ...options, filter: false };
    const mountWrapper = mount(<MUIDataTableToolbar columns={columns} data={data} options={newOptions} />);
    const actualResult = mountWrapper.find(FilterIcon);
    assert.strictEqual(actualResult.length, 0);
  });

  it("should render a toolbar with a search clicking search icon", () => {
    const mountWrapper = mount(<MUIDataTableToolbar columns={columns} data={data} options={options} />);
    const instance = mountWrapper.instance();

    instance.setActiveIcon("search");
    mountWrapper.update();

    const actualResult = mountWrapper.find(MUIDataTableSearch);
    assert.strictEqual(actualResult.length, 1);
  });

  it("should hide search after clicking cancel icon", () => {
    const searchTextUpdate = () => {};
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

  it("should set icon when calling method setActiveIcon", () => {
    const mountWrapper = mount(<MUIDataTableToolbar columns={columns} data={data} options={options} />);
    const instance = mountWrapper.instance();

    instance.setActiveIcon("filter");
    mountWrapper.update();

    const state = mountWrapper.state();
    assert.strictEqual(state.iconActive, "filter");
  });

  it("should download CSV when calling method handleCSVDownload", () => {
    const mountWrapper = mount(<MUIDataTableToolbar columns={columns} data={data} options={options} />);
    const instance = mountWrapper.instance();

    const appendSpy = spy(document.body, "appendChild");
    const removeSpy = spy(document.body, "removeChild");
    instance.handleCSVDownload();

    assert.strictEqual(appendSpy.callCount, 1);
    assert.strictEqual(removeSpy.callCount, 1);
  });
});
