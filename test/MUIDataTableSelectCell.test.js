import React from "react";
import { spy, stub } from "sinon";
import { mount, shallow } from "enzyme";
import { assert, expect, should } from "chai";
import Checkbox from "material-ui/Checkbox";
import MUIDataTableSelectCell from "../src/MUIDataTableSelectCell";

describe("<MUIDataTableSelectCell />", function() {
  before(() => {});

  it("should render table select cell", () => {
    const mountWrapper = mount(<MUIDataTableSelectCell checked={false} />);

    const actualResult = mountWrapper.find(Checkbox);
    assert.strictEqual(actualResult.length, 1);
  });

  it("should render table select cell checked", () => {
    const mountWrapper = mount(<MUIDataTableSelectCell checked={true} />);

    const actualResult = mountWrapper.find(Checkbox);
    assert.strictEqual(actualResult.props().checked, true);
  });

  it("should render table select cell unchecked", () => {
    const mountWrapper = mount(<MUIDataTableSelectCell checked={false} />);

    const actualResult = mountWrapper.find(Checkbox);
    assert.strictEqual(actualResult.props().checked, false);
  });

  // it("should trigger onColumnUpdate prop callback when calling method handleColChange", () => {
  //   const options = {};
  //   const onColumnUpdate = spy();

  //   const shallowWrapper = shallow(
  //     <MUIDataTableViewCol
  //       columns={columns}
  //       onColumnUpdate={onColumnUpdate}
  //       viewColStyles={defaultViewColStyles}
  //       options={options}
  //     />,
  //   ).dive();

  //   const instance = shallowWrapper.instance();

  //   instance.handleColChange(0);
  //   assert.strictEqual(onColumnUpdate.callCount, 1);
  // });
});
