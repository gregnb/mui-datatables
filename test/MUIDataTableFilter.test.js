import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { assert } from 'chai';
import { mount, shallow } from 'enzyme';
import React from 'react';
import { spy } from 'sinon';
import { default as TableFilterInToolbar } from '../src/components/TableFilter';
import getTextLabels from '../src/textLabels';
import TableFilterInline from '../src/components/TableFilterInline';

[['TableFilter', TableFilterInToolbar], ['TableFilterInline', TableFilterInline]].forEach(([name, TableFilter]) => {
  describe(`<${name}/>`, function() {
    let columns;
    let filterData;

    beforeEach(() => {
      columns = [
        { name: 'firstName', label: 'First Name', display: 'true', sort: true, filter: true, sortDirection: 'desc' },
        { name: 'company', label: 'Company', display: 'true', sort: true, filter: true, sortDirection: 'desc' },
        { name: 'city', label: 'City Label', display: 'true', sort: true, filter: true, sortDirection: 'desc' },
        { name: 'state', label: 'State', display: 'true', sort: true, filter: true, sortDirection: 'desc' },
      ];

      filterData = [
        ['Joe James', 'John Walsh', 'Bob Herm', 'James Houston'],
        ['Test Corp'],
        ['Yonkers', 'Hartford', 'Tampa', 'Dallas'],
        ['NY', 'CT', 'FL', 'TX'],
      ];
    });

    if (name === 'TableFilter') {
      it('TableFilter should render label as filter name', () => {
        const options = { filterType: 'checkbox', textLabels: getTextLabels() };
        const filterList = [[], [], [], []];
        const shallowWrapper = mount(
          <TableFilter columns={columns} filterData={filterData} filterList={filterList} options={options} />,
        );
        const labels = shallowWrapper
          .find(Typography)
          .filterWhere(n => n.html().match(/MUIDataTableFilter-checkboxListTitle/))
          .map(n => n.text());
        assert.deepEqual(labels, ['First Name', 'Company', 'City Label', 'State']);
      });

      it("TableFilter should render column.label as filter label if filterType = 'textField'", () => {
        const options = { filterType: 'textField', textLabels: getTextLabels() };
        const filterList = [[], [], [], []];
        const shallowWrapper = mount(
          <TableFilter columns={columns} filterData={filterData} filterList={filterList} options={options} />,
        );
        const labels = shallowWrapper
          .find(TextField)
          .filterWhere(n => n.html().match(/MuiInputLabel-formControl/))
          .map(n => n.text());
        assert.deepEqual(labels, ['First Name', 'Company', 'City Label', 'State']);
      });

      it('TableFilter should render a filter dialog with custom footer when customFooter is provided', () => {
        const CustomFooter = () => <div id="custom-footer">customFooter</div>;
        const options = { textLabels: getTextLabels() };
        const filterList = [[], [], [], []];
        const onFilterUpdate = spy();

        const shallowWrapper = shallow(
          <TableFilter
            customFooter={CustomFooter}
            columns={columns}
            onFilterUpdate={onFilterUpdate}
            filterData={filterData}
            filterList={filterList}
            options={options}
          />,
        ).dive();

        const actualResult = shallowWrapper.find('#custom-footer');
        assert.strictEqual(actualResult.length, 1);
      });
    }

    if (name === 'TableFilterInline') {
      it('TableFilterInline should not render filter labels', () => {
        const options = { filterType: 'checkbox', textLabels: getTextLabels() };
        const filterList = [[], [], [], []];
        const shallowWrapper = mount(
          <TableFilter columns={columns} filterData={filterData} filterList={filterList} options={options} />,
        );
        const labels = shallowWrapper
          .find(Typography)
          .filterWhere(n => n.html().match(/MUIDataTableFilter-checkboxListTitle/))
          .map(n => n.text());
        assert.deepEqual(labels, []);
      });

      it('TableFilterInline should render data table filter view with no checkboxes if display="false" for each column', () => {
        const options = { filterType: 'checkbox', textLabels: getTextLabels() };
        const filterList = [[], [], [], []];
        columns = columns.map(item => (item.display = 'false'));

        const mountWrapper = mount(
          <TableFilter columns={columns} filterData={filterData} filterList={filterList} options={options} />,
        );

        const actualResult = mountWrapper.find(Checkbox);
        assert.strictEqual(actualResult.length, 0);
      });

      it('TableFilterInline should render data table filter view with no checkboxes if display="excluded" for each column', () => {
        const options = { filterType: 'checkbox', textLabels: getTextLabels() };
        const filterList = [[], [], [], []];
        columns = columns.map(item => (item.display = 'excluded'));

        const mountWrapper = mount(
          <TableFilter columns={columns} filterData={filterData} filterList={filterList} options={options} />,
        );

        const actualResult = mountWrapper.find(Checkbox);
        assert.strictEqual(actualResult.length, 0);
      });

      it("TableFilterInline should not render column.label as filter label if filterType = 'textField'", () => {
        const options = { filterType: 'textField', textLabels: getTextLabels() };
        const filterList = [[], [], [], []];
        const shallowWrapper = mount(
          <TableFilter columns={columns} filterData={filterData} filterList={filterList} options={options} />,
        );
        const labels = shallowWrapper
          .find(TextField)
          .filterWhere(n => n.html().match(/MuiInputLabel-formControl/))
          .map(n => n.text());
        assert.deepEqual(labels, []);
      });
    }

    it("should render data table filter view with checkboxes if filterType = 'checkbox'", () => {
      const options = { filterType: 'checkbox', textLabels: getTextLabels() };
      const filterList = [[], [], [], []];
      const shallowWrapper = mount(
        <TableFilter columns={columns} filterData={filterData} filterList={filterList} options={options} />,
      );

      const actualResult = shallowWrapper.find(Checkbox);
      assert.strictEqual(actualResult.length, 13);
    });

    it('should render data table filter view with no checkboxes if filter=false for each column', () => {
      const options = { filterType: 'checkbox', textLabels: getTextLabels() };
      const filterList = [[], [], [], []];
      columns = columns.map(item => (item.filter = false));

      const mountWrapper = mount(
        <TableFilter columns={columns} filterData={filterData} filterList={filterList} options={options} />,
      );

      const actualResult = mountWrapper.find(Checkbox);
      assert.strictEqual(actualResult.length, 0);
    });

    it("should render data table filter view with selects if filterType = 'select'", () => {
      const options = { filterType: 'select', textLabels: getTextLabels() };
      const filterList = [['Joe James'], [], [], []];

      const mountWrapper = mount(
        <TableFilter columns={columns} filterData={filterData} filterList={filterList} options={options} />,
      );

      const actualResult = mountWrapper.find(Select);
      assert.strictEqual(actualResult.length, 4);
    });

    it('should render data table filter view no selects if filter=false for each column', () => {
      const options = { filterType: 'select', textLabels: getTextLabels() };
      const filterList = [['Joe James'], [], [], []];
      columns = columns.map(item => (item.filter = false));

      const mountWrapper = mount(
        <TableFilter columns={columns} filterData={filterData} filterList={filterList} options={options} />,
      );

      const actualResult = mountWrapper.find(Select);
      assert.strictEqual(actualResult.length, 0);
    });

    it("should render data table filter view with checkbox selects if filterType = 'multiselect'", () => {
      const options = { filterType: 'multiselect', textLabels: getTextLabels() };
      const filterList = [['Joe James', 'John Walsh'], [], [], []];

      const mountWrapper = mount(
        <TableFilter columns={columns} filterData={filterData} filterList={filterList} options={options} />,
      );

      const actualResult = mountWrapper.find(Select);
      assert.strictEqual(actualResult.length, 4);
    });

    it("should data table custom filter view with if filterType = 'custom' and a valid display filterOption is provided", () => {
      const options = {
        filterType: 'custom',
        textLabels: getTextLabels(),
        filterOptions: {
          names: [],
          logic(city, filters) {
            return false;
          },
          display: (filterList, onChange, index, column) => (
            <div>
              <TextField id="custom-filter-render">Custom Filter Render</TextField>
            </div>
          ),
        },
      };
      const filterList = [[], [], [], []];
      const mountWrapper = mount(
        <TableFilter columns={columns} filterData={filterData} filterList={filterList} options={options} />,
      );

      const actualResult = mountWrapper.find('#custom-filter-render');
      assert.isAtLeast(actualResult.length, 1);
    });

    it("should data table filter view with TextFields if filterType = 'textfield'", () => {
      const options = { filterType: 'textField', textLabels: getTextLabels() };
      const filterList = [[], [], [], []];
      const shallowWrapper = mount(
        <TableFilter columns={columns} filterData={filterData} filterList={filterList} options={options} />,
      );

      const actualResult = shallowWrapper.find(TextField);
      assert.strictEqual(actualResult.length, 4);
    });

    it("should data table filter view with no TextFields if filter=false when filterType = 'textField'", () => {
      const options = { filterType: 'textField', textLabels: getTextLabels() };
      const filterList = [[], [], [], []];
      columns = columns.map(item => (item.filter = false));

      const shallowWrapper = mount(
        <TableFilter columns={columns} filterData={filterData} filterList={filterList} options={options} />,
      );

      const actualResult = shallowWrapper.find(TextField);
      assert.strictEqual(actualResult.length, 0);
    });

    it("should data table filter view with checkboxes if column.filterType = 'checkbox' irrespective of global filterType value", () => {
      const options = { filterType: 'textField', textLabels: getTextLabels() };
      const filterList = [[], [], [], []];
      columns.forEach(item => (item.filterType = 'checkbox'));

      const shallowWrapper = mount(
        <TableFilter columns={columns} filterData={filterData} filterList={filterList} options={options} />,
      );

      const actualResult = shallowWrapper.find(Checkbox);
      assert.strictEqual(actualResult.length, 13);
    });

    it('should trigger onFilterUpdate prop callback when calling method handleCheckboxChange', () => {
      const options = { filterType: 'checkbox', textLabels: getTextLabels() };
      const filterList = [[], [], [], []];
      const onFilterUpdate = spy();

      const shallowWrapper = shallow(
        <TableFilter
          columns={columns}
          onFilterUpdate={onFilterUpdate}
          filterData={filterData}
          filterList={filterList}
          options={options}
        />,
      ).dive();
      const instance = shallowWrapper.instance();

      //const event = { target: { value: 0 }};
      instance.handleCheckboxChange(0, 0);
      assert.strictEqual(onFilterUpdate.callCount, 1);
    });

    it('should trigger onFilterUpdate prop callback when calling method handleDropdownChange', () => {
      const options = { filterType: 'select', textLabels: getTextLabels() };
      const filterList = [[], [], [], []];
      const onFilterUpdate = spy();

      const shallowWrapper = shallow(
        <TableFilter
          columns={columns}
          onFilterUpdate={onFilterUpdate}
          filterData={filterData}
          filterList={filterList}
          options={options}
        />,
      ).dive();
      const instance = shallowWrapper.instance();

      let event = { target: { value: 'All' } };
      instance.handleDropdownChange(event, 0);
      assert.strictEqual(onFilterUpdate.callCount, 1);

      event = { target: { value: 'test' } };
      instance.handleDropdownChange(event, 0);
      assert.strictEqual(onFilterUpdate.callCount, 2);

      shallowWrapper
        .find(Select)
        .first()
        .simulate('change', event);
      assert.strictEqual(onFilterUpdate.callCount, 3);
    });

    it('should trigger onFilterUpdate prop callback when calling method handleMultiselectChange', () => {
      const options = { filterType: 'multiselect', textLabels: getTextLabels() };
      const filterList = [[], [], [], []];
      const onFilterUpdate = spy();

      const shallowWrapper = shallow(
        <TableFilter
          columns={columns}
          onFilterUpdate={onFilterUpdate}
          filterData={filterData}
          filterList={filterList}
          options={options}
        />,
      ).dive();
      const instance = shallowWrapper.instance();

      let event = { target: { value: 'All' } };

      instance.handleMultiselectChange(event, 0);
      assert.strictEqual(onFilterUpdate.callCount, 1);

      event = { target: { value: 'test' } };
      instance.handleMultiselectChange(event, 0);
      assert.strictEqual(onFilterUpdate.callCount, 2);

      shallowWrapper
        .find(Select)
        .first()
        .simulate('change', event);
      assert.strictEqual(onFilterUpdate.callCount, 3);
    });

    it('should trigger onFilterUpdate prop callback when calling method handleTextFieldChange', () => {
      const options = { filterType: 'textField', textLabels: getTextLabels() };
      const filterList = [[], [], [], []];
      const onFilterUpdate = spy();

      const shallowWrapper = shallow(
        <TableFilter
          columns={columns}
          onFilterUpdate={onFilterUpdate}
          filterData={filterData}
          filterList={filterList}
          options={options}
        />,
      ).dive();
      const instance = shallowWrapper.instance();

      let event = { target: { value: 'All' } };

      instance.handleTextFieldChange(event, 0);
      assert.strictEqual(onFilterUpdate.callCount, 1);

      event = { target: { value: 'test' } };
      instance.handleTextFieldChange(event, 0);
      assert.strictEqual(onFilterUpdate.callCount, 2);

      shallowWrapper
        .find(TextField)
        .first()
        .simulate('change', event);
      assert.strictEqual(onFilterUpdate.callCount, 3);
    });
  });
});
