import React from "react";
import { spy, stub } from "sinon";
import { mount, shallow } from "enzyme";
import { assert, expect, should } from "chai";
import Popover from "../src/components/Popover";
import MuiPopover from "@material-ui/core/Popover";

describe("<MUIPopover />", function() {
  it("should render a popover", () => {
    const mountWrapper = mount(
      <Popover
        trigger={(
          <a href="#">Simple Link!</a>
        )}
        content={(
          <span>Some content</span>
        )}
      />
    );

    const actualResult = mountWrapper.find(MuiPopover);
    assert.strictEqual(actualResult.length, 1);
  });

  it("should close popover when calling method handleRequestClose", () => {
    const refClose = spy();
    const mountWrapper = mount(
      <Popover
        trigger={(
          <a href="#">Simple Link!</a>
        )}
        content={(
          <span>Some content</span>
        )}
      />
    );

    // open popover
    mountWrapper.setState({ open: true });
    mountWrapper.update();
    let state = mountWrapper.state();

    assert.strictEqual(state.open, true);
    assert.strictEqual(mountWrapper.find(MuiPopover).length, 1);

    // hide popover
    const instance = mountWrapper.instance();
    instance.handleRequestClose();
    mountWrapper.update();
    state = mountWrapper.state();

    assert.strictEqual(state.open, false);
    assert.strictEqual(refClose.callCount, 1);
  });


});
