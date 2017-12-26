import React from "react";
import { spy, stub } from "sinon";
import { mount, shallow } from "enzyme";
import { assert, expect, should } from "chai";
import { MUIPopover, MUIPopoverTarget, MUIPopoverContent } from "../src/MUIPopover";
import Popover from "material-ui/Popover";

describe("<MUIPopover />", function() {
  it("should render a popover", () => {
    const mountWrapper = mount(
      <MUIPopover>
        <MUIPopoverTarget>
          <a href="#">Simple Link!</a>
        </MUIPopoverTarget>
        <MUIPopoverContent>Some content</MUIPopoverContent>
      </MUIPopover>,
    );

    const actualResult = mountWrapper.find(Popover);
    assert.strictEqual(actualResult.length, 1);
  });

  it("should not render a popover if children are not MUIPopoverContent or MUIPopoverTarget", () => {
    stub(console, "error");
    const mountWrapper = mount(
      <MUIPopover>
        <div>testing</div>
      </MUIPopover>,
    );

    assert(console.error.called);
    console.error.restore();
  });

  it("should return children when calling MUIPopoverContent", () => {
    const shallowWrapper = shallow(<MUIPopoverContent>Some content</MUIPopoverContent>);

    assert.strictEqual(shallowWrapper.text(), "Some content");
  });

  it("should call handleOnExit when unmounting MUIPopover", () => {
    const exitFunc = spy();
    const shallowWrapper = shallow(
      <MUIPopover refExit={exitFunc}>
        <MUIPopoverTarget>
          <a href="#">Simple Link!</a>
        </MUIPopoverTarget>
        <MUIPopoverContent>Some content</MUIPopoverContent>
      </MUIPopover>,
    );

    const instance = shallowWrapper.instance();
    instance.handleOnExit();
    assert.strictEqual(exitFunc.callCount, 1);
  });

  it("should close popover when calling method handleRequestClose", () => {
    const refClose = spy();
    const mountWrapper = mount(
      <MUIPopover refClose={refClose}>
        <MUIPopoverTarget>
          <a href="#">Simple Link!</a>
        </MUIPopoverTarget>
        <MUIPopoverContent>Some content</MUIPopoverContent>
      </MUIPopover>,
    );

    // open popover
    mountWrapper.setState({ open: true });
    mountWrapper.update();
    let state = mountWrapper.state();

    assert.strictEqual(state.open, true);
    assert.strictEqual(mountWrapper.find(Popover).length, 1);

    // hide popover
    const instance = mountWrapper.instance();
    instance.handleRequestClose();
    mountWrapper.update();
    state = mountWrapper.state();

    assert.strictEqual(state.open, false);
    assert.strictEqual(refClose.callCount, 1);
  });

  it("should open popover when calling method handleClick", () => {
    const mountWrapper = mount(
      <MUIPopover>
        <MUIPopoverTarget>
          <a href="#">Simple Link!</a>
        </MUIPopoverTarget>
        <MUIPopoverContent>Some content</MUIPopoverContent>
      </MUIPopover>,
    );

    let state = mountWrapper.state();
    const instance = mountWrapper.instance();
    assert.strictEqual(state.open, false);

    instance.handleClick();
    mountWrapper.update();

    state = mountWrapper.state();
    assert.strictEqual(state.open, true);
    assert.strictEqual(mountWrapper.find(Popover).length, 1);
  });
});
