import React from "react";
import { spy, stub } from "sinon";
import { mount, shallow } from "enzyme";
import { assert, expect, should } from "chai";
import DeleteIcon from "@material-ui/icons/Delete";
import MUIDataTableToolbarSelect from "../src/MUIDataTableToolbarSelect";
import textLabels from "../src/textLabels";

describe("<MUIDataTableSelectCell />", function() {
  before(() => {});

  it("should render table toolbar select", () => {
    const onRowsDelete = () => {};
    const mountWrapper = mount(
      <MUIDataTableToolbarSelect options={{ textLabels }} selectedRows={[1]} onRowsDelete={onRowsDelete} />,
    );

    const actualResult = mountWrapper.find(DeleteIcon);
    assert.strictEqual(actualResult.length, 1);
  });
});
