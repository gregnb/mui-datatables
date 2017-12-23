import React from "react";
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
});
