import React from "react";
import { spy, stub } from "sinon";
import { mount, shallow } from "enzyme";
import { assert, expect, should } from "chai";
import Checkbox from "material-ui/Checkbox";
import MUIDataTableViewCol from "../src/MUIDataTableViewCol";
import textLabels from "../src/textLabels";

describe("<MUIDataTableViewCol />", function() {
  let columns;
  let options;

  before(() => {
    columns = ["a", "b", "c", "d"];
    options = {
      textLabels,
    };
  });

  it("should render view columns", () => {
    const mountWrapper = mount(<MUIDataTableViewCol columns={columns} options={options} />);

    const actualResult = mountWrapper.find(Checkbox);
    assert.strictEqual(actualResult.length, 4);
  });

  it("should trigger onColumnUpdate prop callback when calling method handleColChange", () => {
    const onColumnUpdate = spy();

    const shallowWrapper = shallow(
      <MUIDataTableViewCol columns={columns} onColumnUpdate={onColumnUpdate} options={options} />,
    ).dive();

    const instance = shallowWrapper.instance();

    instance.handleColChange(0);
    assert.strictEqual(onColumnUpdate.callCount, 1);
  });
});
