import React from "react";
import simulant from "simulant";
import { spy, stub } from "sinon";
import { mount, shallow } from "enzyme";
import { assert, expect, should } from "chai";
import TextField from "material-ui/TextField";
import MUIDataTableSearch from "../src/MUIDataTableSearch";

describe("<MUIDataTableSearch />", function() {
  it("should render a search bar", () => {
    const options = {};
    const onSearch = () => {};
    const onHide = () => {};

    const mountWrapper = mount(<MUIDataTableSearch onSearch={onSearch} onHide={onHide} options={options} />);

    const actualResult = mountWrapper.find(TextField);
    assert.strictEqual(actualResult.length, 1);
  });

  it("should trigger handleTextChange prop callback when calling method handleTextChange", () => {
    const options = {};
    const onSearch = spy();
    const onHide = () => {};

    const shallowWrapper = shallow(<MUIDataTableSearch onSearch={onSearch} onHide={onHide} options={options} />);

    const instance = shallowWrapper.instance();

    instance.handleTextChange({ target: { value: "" } });
    assert.strictEqual(onSearch.callCount, 1);
  });

  it("should hide the search bar when hitting the ESCAPE key", () => {
    const options = {};
    const onHide = spy();

    const mountWrapper = mount(<MUIDataTableSearch onHide={onHide} options={options} />, { attachTo: document.body });

    simulant.fire(document.body.querySelector("input"), "keydown", { keyCode: 27 });
    assert.strictEqual(onHide.callCount, 1);
  });

  it("should hide not hide search bar when entering anything but the ESCAPE key", () => {
    const options = {};
    const onHide = spy();

    const mountWrapper = mount(<MUIDataTableSearch onHide={onHide} options={options} />, { attachTo: document.body });

    simulant.fire(document.body.querySelector("input"), "keydown", { keyCode: 25 });
    assert.strictEqual(onHide.callCount, 0);
  });
});
