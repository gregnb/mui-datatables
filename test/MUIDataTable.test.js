import React from 'react';
import { spy } from 'sinon';
import { mount, shallow } from 'enzyme';
import { assert, expect } from 'chai';
import MUIDataTable from '../src/MUIDataTable';
import TableFilterList from '../src/components/TableFilterList';
import TablePagination from '../src/components/TablePagination';
import textLabels from '../src/textLabels';
import Chip from '@material-ui/core/Chip';
import Cities from '../examples/component/cities';
import { getCollatorComparator } from '../src/utils';

describe('<MUIDataTable />', function() {
  let data;
  let displayData;
  let columns;
  let tableData;
  let renderCities = (value, tableMeta, updateValueFn) => (
    <Cities value={value} index={tableMeta.rowIndex} change={event => updateValueFn(event)} />
  );
  let renderName = value => value.split(' ')[1] + ', ' + value.split(' ')[0];

  before(() => {
    columns = [
      { name: 'Name', options: { customBodyRender: renderName } },
      'Company',
      { name: 'City', label: 'City Label', options: { customBodyRender: renderCities } },
      { name: 'State' },
    ];
    data = [
      ['Joe James', 'Test Corp', 'Yonkers', 'NY'],
      ['John Walsh', 'Test Corp', 'Hartford', 'CT'],
      ['Bob Herm', 'Test Corp', 'Tampa', 'FL'],
      ['James Houston', 'Test Corp', 'Dallas', 'TX'],
    ];
    // internal table data built from source data provided
    displayData = JSON.stringify([
      {
        data: ['James, Joe', 'Test Corp', renderCities('Yonkers', { rowIndex: 0 }), 'NY'],
        dataIndex: 0,
      },
      {
        data: ['Walsh, John', 'Test Corp', renderCities('Hartford', { rowIndex: 1 }), 'CT'],
        dataIndex: 1,
      },
      {
        data: ['Herm, Bob', 'Test Corp', renderCities('Tampa', { rowIndex: 2 }), 'FL'],
        dataIndex: 2,
      },
      {
        data: ['Houston, James', 'Test Corp', renderCities('Dallas', { rowIndex: 3 }), 'TX'],
        dataIndex: 3,
      },
    ]);
    tableData = [
      { index: 0, data: ['James, Joe', 'Test Corp', renderCities('Yonkers', { rowIndex: 0 }), 'NY'] },
      { index: 1, data: ['Walsh, John', 'Test Corp', renderCities('Hartford', { rowIndex: 1 }), 'CT'] },
      { index: 2, data: ['Herm, Bob', 'Test Corp', renderCities('Tampa', { rowIndex: 2 }), 'FL'] },
      { index: 3, data: ['Houston, James', 'Test Corp', renderCities('Dallas', { rowIndex: 3 }), 'TX'] },
    ];
    renderCities = renderCities;
    renderName = renderName;
  });

  it('should render a table', () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    assert.strictEqual(
      shallowWrapper
        .dive()
        .dive()
        .name(),
      'Paper',
    );
  });

  it('should correctly build internal columns data structure', () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    const actualResult = shallowWrapper.dive().state().columns;

    const expectedResult = [
      {
        display: 'true',
        name: 'Name',
        sort: true,
        filter: true,
        label: 'Name',
        download: true,
        sortDirection: null,
        viewColumns: true,
        customBodyRender: renderName,
      },
      {
        display: 'true',
        name: 'Company',
        sort: true,
        filter: true,
        label: 'Company',
        download: true,
        viewColumns: true,
        sortDirection: null,
      },
      {
        display: 'true',
        name: 'City',
        sort: true,
        filter: true,
        label: 'City Label',
        download: true,
        viewColumns: true,
        sortDirection: null,
        customBodyRender: renderCities,
      },
      {
        display: 'true',
        name: 'State',
        sort: true,
        filter: true,
        label: 'State',
        download: true,
        viewColumns: true,
        sortDirection: null,
      },
    ];

    assert.deepEqual(actualResult, expectedResult);
  });

  it('should correctly build internal table data and displayData structure', () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    const state = shallowWrapper.dive().state();
    //assert.deepEqual(state.data, data);
    assert.deepEqual(JSON.stringify(state.displayData), displayData);
  });

  it('should correctly re-build internal table data and displayData structure with prop change', () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    let state = shallowWrapper.dive().state();

    assert.deepEqual(JSON.stringify(state.displayData), displayData);

    // now use updated props
    let newData = data.map(item => [...item]);
    newData[0][0] = 'testing';
    shallowWrapper.setProps({ data: newData });
    shallowWrapper.update();

    state = shallowWrapper.dive().state();
    const expectedResult = [
      { index: 0, data: ['testing', 'Test Corp', 'Yonkers', 'NY'] },
      { index: 1, data: ['John Walsh', 'Test Corp', 'Hartford', 'CT'] },
      { index: 2, data: ['Bob Herm', 'Test Corp', 'Tampa', 'FL'] },
      { index: 3, data: ['James Houston', 'Test Corp', 'Dallas', 'TX'] },
    ];

    assert.deepEqual(state.data, expectedResult);
  });

  it('should not re-build internal table data and displayData structure with no prop change to data or columns', () => {
    const initializeTableSpy = spy(MUIDataTable.Naked.prototype, 'initializeTable');
    const mountWrapper = mount(shallow(<MUIDataTable columns={columns} data={data} />).get(0));

    let state = mountWrapper.state();
    assert.deepEqual(JSON.stringify(state.displayData), displayData);

    // now update props with no change
    mountWrapper.setProps({});
    mountWrapper.update();

    state = mountWrapper.state();

    assert.deepEqual(JSON.stringify(state.displayData), displayData);
    assert.deepEqual(initializeTableSpy.callCount, 1);
  });

  it('should correctly build internal filterList structure', () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    const state = shallowWrapper.dive().state();
    const expectedResult = [[], [], [], []];

    assert.deepEqual(state.filterList, expectedResult);
  });

  it('should correctly build internal unique column data for filterData structure', () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    const state = shallowWrapper.dive().state();
    const expectedResult = [
      ['Herm, Bob', 'Houston, James', 'James, Joe', 'Walsh, John'],
      ['Test Corp'],
      ['Dallas', 'Hartford', 'Tampa', 'Yonkers'],
      ['CT', 'FL', 'NY', 'TX'],
    ];

    assert.deepEqual(state.filterData, expectedResult);
  });

  it('should correctly build internal rowsPerPage when provided in options', () => {
    const options = {
      rowsPerPage: 20,
      textLabels,
    };

    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} options={options} />);
    const state = shallowWrapper.dive().state();
    assert.strictEqual(state.rowsPerPage, 20);
  });

  it('should correctly build internal rowsPerPageOptions when provided in options', () => {
    const options = {
      rowsPerPageOptions: [5, 10, 15],
    };

    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} options={options} />);
    const state = shallowWrapper.dive().state();
    assert.deepEqual(state.rowsPerPageOptions, [5, 10, 15]);
  });

  it('should render pagination when enabled in options', () => {
    const options = {
      pagination: true,
    };

    const mountWrapper = mount(<MUIDataTable columns={columns} data={data} options={options} />);
    const actualResult = mountWrapper.find(TablePagination);
    assert.lengthOf(actualResult, 1);
  });

  it('should not render pagination when disabled in options', () => {
    const options = {
      pagination: false,
    };

    const mountWrapper = mount(<MUIDataTable columns={columns} data={data} options={options} />);
    const actualResult = mountWrapper.find(TablePagination);
    assert.lengthOf(actualResult, 0);
  });

  it('should properly set internal filterList when calling filterUpdate method with type=checkbox', () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    const table = shallowWrapper.dive();
    const instance = table.instance();
    instance.filterUpdate(0, 'Joe James', 'checkbox');
    table.update();

    const state = table.state();
    assert.deepEqual(state.filterList, [['Joe James'], [], [], []]);
  });

  it('should remove entry from filterList when calling filterUpdate method with type=checkbox and same arguments a second time', () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    const table = shallowWrapper.dive();
    const instance = table.instance();
    instance.filterUpdate(0, 'Joe James', 'checkbox');
    table.update();

    let state = table.state();
    assert.deepEqual(state.filterList, [['Joe James'], [], [], []]);

    instance.filterUpdate(0, 'Joe James', 'checkbox');
    table.update();

    state = table.state();
    assert.deepEqual(state.filterList, [[], [], [], []]);
  });

  it('should properly set internal filterList when calling filterUpdate method with type=dropdown', () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    const table = shallowWrapper.dive();
    const instance = table.instance();
    instance.filterUpdate(0, 'Joe James', 'dropdown');
    table.update();

    const state = table.state();
    assert.deepEqual(state.filterList, [['Joe James'], [], [], []]);
  });

  it('should create Chip when filterList is populated', () => {
    const filterList = [['Joe James'], [], [], []];

    const mountWrapper = mount(<TableFilterList filterList={filterList} filterUpdate={() => true} />);
    const actualResult = mountWrapper.find(Chip);
    assert.strictEqual(actualResult.length, 1);
  });

  it('should remove entry from filterList when calling filterUpdate method with type=dropdown and same arguments a second time', () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    const table = shallowWrapper.dive();
    const instance = table.instance();
    instance.filterUpdate(0, 'Joe James', 'dropdown');
    table.update();

    let state = table.state();
    assert.deepEqual(state.filterList, [['Joe James'], [], [], []]);

    instance.filterUpdate(0, 'Joe James', 'dropdown');
    table.update();

    state = table.state();
    assert.deepEqual(state.filterList, [[], [], [], []]);
  });

  it('should properly reset internal filterList when calling resetFilters method', () => {
    // set a filter
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    const table = shallowWrapper.dive();
    const instance = table.instance();
    instance.filterUpdate(0, 'Joe James', 'checkbox');
    table.update();

    // now remove it
    let state = table.state();
    assert.deepEqual(state.filterList, [['Joe James'], [], [], []]);

    instance.resetFilters();
    table.update();
    state = table.state();
    assert.deepEqual(state.filterList, [[], [], [], []]);
  });

  it('should properly set searchText when calling searchTextUpdate method', () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    const table = shallowWrapper.dive();
    const instance = table.instance();

    instance.searchTextUpdate('Joe');
    table.update();
    const state = table.state();

    const expectedResult = JSON.stringify([
      { data: ['James, Joe', 'Test Corp', renderCities('Yonkers', { rowIndex: 0 }), 'NY'], dataIndex: 0 },
    ]);

    assert.deepEqual(JSON.stringify(state.displayData), expectedResult);
  });

  it('should sort provided column when calling toggleSortColum method', () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />).dive();
    const instance = shallowWrapper.instance();

    instance.toggleSortColumn(0);
    shallowWrapper.update();
    const state = shallowWrapper.state();

    const expectedResult = JSON.stringify([
      { data: ['Herm, Bob', 'Test Corp', renderCities('Tampa', { rowIndex: 0 }), 'FL'], dataIndex: 2 },
      { data: ['Houston, James', 'Test Corp', renderCities('Dallas', { rowIndex: 1 }), 'TX'], dataIndex: 3 },
      { data: ['James, Joe', 'Test Corp', renderCities('Yonkers', { rowIndex: 2 }), 'NY'], dataIndex: 0 },
      { data: ['Walsh, John', 'Test Corp', renderCities('Hartford', { rowIndex: 3 }), 'CT'], dataIndex: 1 },
    ]);

    assert.deepEqual(JSON.stringify(state.displayData), expectedResult);
  });

  it('should toggle provided column when calling toggleViewCol method', () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />).dive();
    const instance = shallowWrapper.instance();

    instance.toggleViewColumn(0);
    shallowWrapper.update();
    const state = shallowWrapper.state();

    const expectedResult = [
      {
        name: 'Name',
        display: 'false',
        sort: true,
        filter: true,
        label: 'Name',
        download: true,
        sortDirection: null,
        customBodyRender: renderName,
        viewColumns: true,
      },
      {
        name: 'Company',
        display: 'true',
        sort: true,
        filter: true,
        label: 'Company',
        download: true,
        viewColumns: true,
        sortDirection: null,
      },
      {
        name: 'City',
        display: 'true',
        sort: true,
        filter: true,
        label: 'City Label',
        download: true,
        sortDirection: null,
        customBodyRender: renderCities,
        viewColumns: true,
      },
      {
        name: 'State',
        display: 'true',
        sort: true,
        filter: true,
        label: 'State',
        download: true,
        viewColumns: true,
        sortDirection: null,
      },
    ];

    assert.deepEqual(state.columns, expectedResult);
  });

  it('should get displayable data when calling getDisplayData method', () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />).dive();
    const instance = shallowWrapper.instance();
    const state = shallowWrapper.state();

    const actualResult = instance.getDisplayData(columns, tableData, state.filterList, '');
    assert.deepEqual(JSON.stringify(actualResult), displayData);
  });

  it('should update rowsPerPage when calling changeRowsPerPage method', () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />).dive();
    const instance = shallowWrapper.instance();

    instance.changeRowsPerPage(10);
    shallowWrapper.update();

    const state = shallowWrapper.state();
    assert.deepEqual(state.rowsPerPage, 10);
  });

  it('should recalculate page when calling changeRowsPerPage method', () => {
    const data = new Array(29).fill('').map(() => ['Joe James', 'Test Corp', 'Yonkers', 'NY']);
    const mountWrapper = mount(shallow(<MUIDataTable columns={columns} data={data} />).get(0));
    const instance = mountWrapper.instance();

    instance.changePage(2);
    instance.changeRowsPerPage(15);

    const state = mountWrapper.state();
    assert.equal(state.page, 1);
  });

  it('should update page position when calling changePage method', () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />).dive();
    const instance = shallowWrapper.instance();

    instance.changePage(2);
    shallowWrapper.update();

    const state = shallowWrapper.state();
    assert.deepEqual(state.page, 2);
  });

  it('should update selectedRows when calling selectRowUpdate method with type=head', () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />).dive();
    const instance = shallowWrapper.instance();

    instance.selectRowUpdate('head', 0);
    shallowWrapper.update();

    const state = shallowWrapper.state();
    const expectedResult = [
      { index: 0, dataIndex: 0 },
      { index: 1, dataIndex: 1 },
      { index: 2, dataIndex: 2 },
      { index: 3, dataIndex: 3 },
    ];
    assert.deepEqual(state.selectedRows.data, expectedResult);
  });

  it('should update selectedRows when calling selectRowUpdate method with type=cell', () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />).dive();
    const instance = shallowWrapper.instance();

    instance.selectRowUpdate('cell', 0);
    shallowWrapper.update();

    const state = shallowWrapper.state();
    assert.deepEqual(state.selectedRows.data, [0]);
  });

  it('should update selectedRows when calling selectRowUpdate method with type=custom', () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />).dive();
    const instance = shallowWrapper.instance();

    instance.selectRowUpdate('custom', [0, 3]);
    shallowWrapper.update();

    const state = shallowWrapper.state();
    const expectedResult = [{ index: 0, dataIndex: 0 }, { index: 3, dataIndex: 3 }];

    assert.deepEqual(state.selectedRows.data, expectedResult);
  });

  it('should update value when calling updateValue method in customBodyRender', () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />).dive();
    const instance = shallowWrapper.instance();

    instance.updateDataCol(0, 2, 'Las Vegas');
    shallowWrapper.update();

    const state = shallowWrapper.state();
    assert.deepEqual(state.data[0].data[2], 'Las Vegas');
  });

  it('should call onTableChange when calling selectRowUpdate method with type=head', () => {
    const options = { selectableRows: true, onTableChange: spy() };
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} options={options} />).dive();
    const instance = shallowWrapper.instance();

    instance.selectRowUpdate('head', 0);
    shallowWrapper.update();

    const state = shallowWrapper.state();
    const expectedResult = [
      { index: 0, dataIndex: 0 },
      { index: 1, dataIndex: 1 },
      { index: 2, dataIndex: 2 },
      { index: 3, dataIndex: 3 },
    ];
    assert.deepEqual(state.selectedRows.data, expectedResult);
    assert.strictEqual(options.onTableChange.callCount, 1);
  });

  it('should call onTableChange when calling selectRowUpdate method with type=cell', () => {
    const options = { selectableRows: true, onTableChange: spy() };

    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} options={options} />).dive();
    const instance = shallowWrapper.instance();

    instance.selectRowUpdate('cell', 0);
    shallowWrapper.update();

    const state = shallowWrapper.state();
    assert.deepEqual(state.selectedRows.data, [0]);
    assert.strictEqual(options.onTableChange.callCount, 1);
  });

  it('should call onTableChange when calling selectRowUpdate method with type=custom', () => {
    const options = { selectableRows: true, onTableChange: spy() };
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} options={options} />).dive();
    const instance = shallowWrapper.instance();

    instance.selectRowUpdate('custom', [0, 3]);
    shallowWrapper.update();

    const state = shallowWrapper.state();
    const expectedResult = [{ index: 0, dataIndex: 0 }, { index: 3, dataIndex: 3 }];

    assert.deepEqual(state.selectedRows.data, expectedResult);
    assert.strictEqual(options.onTableChange.callCount, 1);
  });

  it('should render only things that match a filter', () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    const table = shallowWrapper.dive();
    const instance = table.instance();
    instance.filterUpdate(0, 'James, Joe', 'checkbox');
    table.update();
    const state = table.state();

    const expectedResult = JSON.stringify([
      { data: ['James, Joe', 'Test Corp', renderCities('Yonkers', { rowIndex: 0 }), 'NY'], dataIndex: 0 },
    ]);

    assert.deepEqual(JSON.stringify(state.displayData), expectedResult);
  });

  it('should render all things that match a text field filter', () => {
    const options = { filterType: 'textField' };
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} options={options} />);
    const table = shallowWrapper.dive();
    const instance = table.instance();
    instance.filterUpdate(0, 'James', 'textField');
    table.update();
    const state = table.state();

    const expectedResult = JSON.stringify([
      { data: ['James, Joe', 'Test Corp', renderCities('Yonkers', { rowIndex: 0 }), 'NY'], dataIndex: 0 },
      { data: ['Houston, James', 'Test Corp', renderCities('Dallas', { rowIndex: 3 }), 'TX'], dataIndex: 3 },
    ]);

    assert.deepEqual(JSON.stringify(state.displayData), expectedResult);
  });

  describe('should correctly run comparator function', () => {
    it('correctly compares two equal strings', () => {
      expect(getCollatorComparator()('testString', 'testString')).to.equal(0);
    });

    it('correctly compares two different strings', () => {
      expect(getCollatorComparator()('testStringA', 'testStringB')).to.equal(-1);
    });
  });
});
