import React from "react";
import { spy, stub } from "sinon";
import { mount, shallow } from "enzyme";
import { assert, expect, should } from "chai";
import textLabels from "../src/textLabels";
import MUIDataTableBody from "../src/MUIDataTableBody";
import MUIDataTableSelectCell from "../src/MUIDataTableSelectCell";

describe("<MUIDataTableBody />", function() {
  let data;
  let displayData;
  let columns;

  before(() => {
    columns = ["First Name", "Company", "City", "State"];
    data = [
      ["Joe James", "Test Corp", "Yonkers", "NY"],
      ["John Walsh", "Test Corp", "Hartford", "CT"],
      ["Bob Herm", "Test Corp", "Tampa", "FL"],
      ["James Houston", "Test Corp", "Dallas", "TX"],
    ];
    displayData = [
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

  it("should render a table body with no selectable cells if selectableRows = false", () => {
    const options = { selectableRows: false };
    const selectRowUpdate = () => {};

    const mountWrapper = mount(
      <MUIDataTableBody
        data={displayData}
        count={displayData.length}
        columns={columns}
        page={0}
        rowsPerPage={10}
        selectedRows={[]}
        selectRowUpdate={selectRowUpdate}
        options={options}
        searchText={""}
        filterList={[]}
      />,
    );

    const actualResult = mountWrapper.find(MUIDataTableSelectCell);
    assert.strictEqual(actualResult.length, 0);
  });

  it("should render a table body with no records if no data provided", () => {
    const options = { selectableRows: false, textLabels };
    const selectRowUpdate = () => {};

    const mountWrapper = mount(
      <MUIDataTableBody
        data={[]}
        columns={columns}
        page={0}
        rowsPerPage={10}
        selectedRows={[]}
        selectRowUpdate={selectRowUpdate}
        options={options}
        searchText={""}
        filterList={[]}
      />,
    );

    const actualResult = mountWrapper.html();
    assert.include(actualResult, "Sorry, no matching records found");
  });

  it("should render a table body with selectable cells if selectableRows = true", () => {
    const options = { selectableRows: true };
    const selectRowUpdate = () => {};

    const mountWrapper = mount(
      <MUIDataTableBody
        data={displayData}
        count={displayData.length}
        columns={columns}
        page={0}
        rowsPerPage={10}
        selectedRows={[]}
        selectRowUpdate={selectRowUpdate}
        options={options}
        searchText={""}
        filterList={[]}
      />,
    );

    const actualResult = mountWrapper.find(MUIDataTableSelectCell);
    assert.strictEqual(actualResult.length, 4);
  });

  it("should return the correct rowIndex when calling instance method getRowIndex", () => {
    const options = { sort: true, selectableRows: true };
    const selectRowUpdate = () => {};

    const shallowWrapper = shallow(
      <MUIDataTableBody
        data={displayData}
        count={displayData.length}
        columns={columns}
        page={1}
        rowsPerPage={2}
        selectedRows={[1, 2, 3]}
        selectRowUpdate={selectRowUpdate}
        options={options}
        searchText={""}
        filterList={[]}
      />,
    ).dive();

    const instance = shallowWrapper.instance();
    const actualResult = instance.getRowIndex(2);

    assert.strictEqual(actualResult, 4);
  });

  it("should return correctly if row exists in selectedRows when calling instance method isRowSelected", () => {
    const options = { sort: true, selectableRows: true };
    const selectRowUpdate = () => {};

    const shallowWrapper = shallow(
      <MUIDataTableBody
        data={displayData}
        count={displayData.length}
        columns={columns}
        page={0}
        rowsPerPage={15}
        selectedRows={[1, 2, 3]}
        selectRowUpdate={selectRowUpdate}
        options={options}
        searchText={""}
        filterList={[]}
      />,
    ).dive();

    const instance = shallowWrapper.instance();
    const actualResult = instance.isRowSelected(5);

    assert.strictEqual(actualResult, false);
  });

  it("should trigger selectRowUpdate prop callback when calling method handleRowSelect", () => {
    const options = { sort: true, selectableRows: true };
    const selectRowUpdate = spy();

    const shallowWrapper = shallow(
      <MUIDataTableBody
        data={displayData}
        count={displayData.length}
        columns={columns}
        page={0}
        rowsPerPage={10}
        selectedRows={[]}
        selectRowUpdate={selectRowUpdate}
        options={options}
        searchText={""}
        filterList={[]}
      />,
    ).dive();

    const instance = shallowWrapper.instance();
    instance.handleRowSelect(2);
    shallowWrapper.update();

    assert.strictEqual(selectRowUpdate.callCount, 1);
  });

  it("should call onRowClick when Row is clicked", () => {
    const options = { selectableRows: true, onRowClick: spy() };
    const selectRowUpdate = stub();

    const t = mount(
      <MUIDataTableBody
        data={displayData}
        count={displayData.length}
        columns={columns}
        page={0}
        rowsPerPage={10}
        selectedRows={[]}
        selectRowUpdate={selectRowUpdate}
        options={options}
        searchText={""}
        filterList={[]}
      />,
    );

    t.find("#MUIDataTableBodyRow-2")
      .first()
      .simulate("click");

    assert.strictEqual(options.onRowClick.callCount, 1);
    assert(options.onRowClick.calledWith(data[2], { rowIndex: 2, dataIndex: 2 }));
  });
});
