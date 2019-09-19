import React from 'react';
import { spy } from 'sinon';
import { mount, shallow } from 'enzyme';
import { assert, expect } from 'chai';
import cloneDeep from 'lodash.clonedeep';
import MUIDataTable from '../src/MUIDataTable';
import TableFilterList from '../src/components/TableFilterList';
import TablePagination from '../src/components/TablePagination';
import TableToolbar from '../src/components/TableToolbar';
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
  let renderState = value => value;
  let renderHead = columnMeta => columnMeta.name + 's';
  let defaultRenderCustomFilterList = f => f;
  let renderCustomFilterList = f => `Name: ${f}`;

  before(() => {
    columns = [
      { name: 'Name', options: { customBodyRender: renderName, customFilterListRender: renderCustomFilterList } },
      'Company',
      { name: 'City', label: 'City Label', options: { customBodyRender: renderCities, filterType: 'textField' } },
      {
        name: 'State',
        options: { customBodyRender: renderState, filterType: 'multiselect', customHeadRender: renderHead },
      },
      { name: 'Empty', options: { empty: true, filterType: 'checkbox' } },
    ];
    data = [
      ['Joe James', 'Test Corp', 'Yonkers', 'NY'],
      ['John Walsh', 'Test Corp', 'Hartford', null],
      ['Bob Herm', 'Test Corp', 'Tampa', 'FL'],
      ['James Houston', 'Test Corp', 'Dallas', 'TX'],
    ];
    // internal table data built from source data provided
    displayData = JSON.stringify([
      {
        data: ['James, Joe', 'Test Corp', renderCities('Yonkers', { rowIndex: 0 }), 'NY', undefined],
        dataIndex: 0,
      },
      {
        data: ['Walsh, John', 'Test Corp', renderCities('Hartford', { rowIndex: 1 }), null, undefined],
        dataIndex: 1,
      },
      {
        data: ['Herm, Bob', 'Test Corp', renderCities('Tampa', { rowIndex: 2 }), 'FL', undefined],
        dataIndex: 2,
      },
      {
        data: ['Houston, James', 'Test Corp', renderCities('Dallas', { rowIndex: 3 }), 'TX', undefined],
        dataIndex: 3,
      },
    ]);
    tableData = [
      { index: 0, data: ['James, Joe', 'Test Corp', renderCities('Yonkers', { rowIndex: 0 }), 'NY', undefined] },
      { index: 1, data: ['Walsh, John', 'Test Corp', renderCities('Hartford', { rowIndex: 1 }), null, undefined] },
      { index: 2, data: ['Herm, Bob', 'Test Corp', renderCities('Tampa', { rowIndex: 2 }), 'FL', undefined] },
      { index: 3, data: ['Houston, James', 'Test Corp', renderCities('Dallas', { rowIndex: 3 }), 'TX', undefined] },
    ];
    renderCities = renderCities;
    renderName = renderName;
    renderState = renderState;
  });

  it('should render a table', () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    assert.include(
      ['Paper', 'ForwardRef(Paper)'],
      shallowWrapper
        .dive()
        .dive()
        .name(),
    );
  });

  it('should correctly build internal columns data structure', () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    const actualResult = shallowWrapper.dive().state().columns;

    const expectedResult = [
      {
        display: 'true',
        empty: false,
        print: true,
        name: 'Name',
        sort: true,
        filter: true,
        label: 'Name',
        download: true,
        searchable: true,
        sortDirection: 'none',
        viewColumns: true,
        customFilterListRender: renderCustomFilterList,
        customBodyRender: renderName,
      },
      {
        display: 'true',
        empty: false,
        print: true,
        name: 'Company',
        sort: true,
        filter: true,
        label: 'Company',
        download: true,
        searchable: true,
        viewColumns: true,
        sortDirection: 'none',
      },
      {
        display: 'true',
        empty: false,
        print: true,
        name: 'City',
        sort: true,
        filter: true,
        filterType: 'textField',
        label: 'City Label',
        download: true,
        searchable: true,
        viewColumns: true,
        sortDirection: 'none',
        customBodyRender: renderCities,
      },
      {
        display: 'true',
        empty: false,
        print: true,
        name: 'State',
        sort: true,
        filter: true,
        filterType: 'multiselect',
        label: 'State',
        download: true,
        searchable: true,
        viewColumns: true,
        sortDirection: 'none',
        customBodyRender: renderState,
        customHeadRender: renderHead,
      },
      {
        display: 'true',
        empty: true,
        print: true,
        name: 'Empty',
        sort: true,
        filter: true,
        filterType: 'checkbox',
        label: 'Empty',
        download: true,
        searchable: true,
        viewColumns: true,
        sortDirection: 'none',
      },
    ];

    assert.deepEqual(actualResult, expectedResult);
  });

  it('should correctly rebuild internal columns data structure', () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);

    shallowWrapper.setProps({
      columns: [
        {
          name: 'Test Name',
          options: {
            filter: false,
            display: 'excluded',
            customBodyRender: renderName,
            customFilterListRender: renderCustomFilterList,
          },
        },
        'Company',
        { name: 'City', label: 'City Label', options: { customBodyRender: renderCities, filterType: 'textField' } },
        {
          name: 'State',
          options: { customBodyRender: renderState, filterType: 'multiselect', customHeadRender: renderHead },
        },
        { name: 'Empty', options: { empty: true, filterType: 'checkbox' } },
      ],
    });

    const actualResult = shallowWrapper.dive().state().columns;

    const expectedResult = [
      {
        display: 'excluded',
        empty: false,
        print: true,
        name: 'Test Name',
        sort: true,
        filter: false,
        label: 'Test Name',
        download: true,
        searchable: true,
        sortDirection: 'none',
        viewColumns: true,
        customFilterListRender: renderCustomFilterList,
        customBodyRender: renderName,
      },
      {
        display: 'true',
        empty: false,
        print: true,
        name: 'Company',
        sort: true,
        filter: true,
        label: 'Company',
        download: true,
        searchable: true,
        viewColumns: true,
        sortDirection: 'none',
      },
      {
        display: 'true',
        empty: false,
        print: true,
        name: 'City',
        sort: true,
        filter: true,
        filterType: 'textField',
        label: 'City Label',
        download: true,
        searchable: true,
        viewColumns: true,
        sortDirection: 'none',
        customBodyRender: renderCities,
      },
      {
        display: 'true',
        empty: false,
        print: true,
        name: 'State',
        sort: true,
        filter: true,
        filterType: 'multiselect',
        label: 'State',
        download: true,
        searchable: true,
        viewColumns: true,
        sortDirection: 'none',
        customBodyRender: renderState,
        customHeadRender: renderHead,
      },
      {
        display: 'true',
        empty: true,
        print: true,
        name: 'Empty',
        sort: true,
        filter: true,
        filterType: 'checkbox',
        label: 'Empty',
        download: true,
        searchable: true,
        viewColumns: true,
        sortDirection: 'none',
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

  it('should correctly build internal table data and displayData structure when using nested data', () => {
    const columns = [
      { name: 'Name', options: { customBodyRender: renderName, customFilterListRender: renderCustomFilterList } },
      'Company',
      { name: 'Location.City', label: 'City Label' },
      { name: 'Location.State' },
      { name: 'Empty', options: { empty: true, filterType: 'checkbox' } },
    ];
    const data = [
      { Name: 'Joe James', Company: 'Test Corp', Location: { City: 'Yonkers', State: 'NY' } },
      { Name: 'John Walsh', Company: 'Test Corp', Location: { City: 'Hartford', State: null } },
      { Name: 'Bob Herm', Company: 'Test Corp', Location: { Town: 'Tampa', State: 'FL' } },
      { Name: 'James Houston', Company: 'Test Corp', Location: { City: 'Dallas', State: 'TX' } },
    ];
    const displayData = JSON.stringify([
      { data: ['James, Joe', 'Test Corp', 'Yonkers', 'NY', undefined], dataIndex: 0 },
      { data: ['Walsh, John', 'Test Corp', 'Hartford', null, undefined], dataIndex: 1 },
      { data: ['Herm, Bob', 'Test Corp', undefined, 'FL', undefined], dataIndex: 2 },
      { data: ['Houston, James', 'Test Corp', 'Dallas', 'TX', undefined], dataIndex: 3 },
    ]);
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    const state = shallowWrapper.dive().state();

    assert.deepEqual(JSON.stringify(state.displayData), displayData);
  });

  it('should correctly re-build display after xhr with serverSide=true', done => {
    const fullWrapper = mount(<MUIDataTable columns={columns} data={[]} options={{ serverSide: true }} />);
    assert.strictEqual(fullWrapper.find('tbody tr').length, 1);

    // simulate xhr and test number of displayed rows
    new Promise((resolve, reject) => {
      setTimeout(() => {
        fullWrapper.setProps({ data });
        fullWrapper.update();
        assert.strictEqual(fullWrapper.find('tbody tr').length, 4);
        done();
      }, 10);
    });
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
      { index: 0, data: ['testing', 'Test Corp', 'Yonkers', 'NY', undefined] },
      { index: 1, data: ['John Walsh', 'Test Corp', 'Hartford', null, undefined] },
      { index: 2, data: ['Bob Herm', 'Test Corp', 'Tampa', 'FL', undefined] },
      { index: 3, data: ['James Houston', 'Test Corp', 'Dallas', 'TX', undefined] },
    ];

    assert.deepEqual(state.data, expectedResult);
  });

  it('should correctly re-build table options before and after prop change', () => {
    const options = {
      textLabels: {
        newObj: {
          test: 'foo',
        },
      },
      downloadOptions: {
        separator: ':',
      },
    };
    const newOptions = {
      textLabels: {
        newObj: {
          test: 'bar',
        },
      },
      downloadOptions: {
        separator: ';',
      },
    };
    const fullWrapper = mount(<MUIDataTable columns={columns} data={[]} options={options} />);
    let props = fullWrapper.props();

    assert.deepEqual(props.options, options);

    fullWrapper.setProps({ options: newOptions, data });
    fullWrapper.update();
    props = fullWrapper.props();

    assert.deepEqual(props.options, newOptions);
  });

  it('should correctly re-build internal table data while maintaining pagination after state change', () => {
    let currentPage;
    const options = {
      rowsPerPage: 1,
      rowsPerPageOptions: [1, 2, 4],
      page: 1,
      onChangePage: current => (currentPage = current),
    };
    const fullWrapper = mount(<MUIDataTable columns={columns} data={data} options={options} />);

    // simulate paging backward to set `currentPage`
    fullWrapper
      .find('#pagination-back')
      .at(0)
      .simulate('click');
    assert.strictEqual(currentPage, 0);

    // simulate changing pagination to set `rowsPerPage`
    fullWrapper.find('#pagination-rows').simulate('click');
    fullWrapper
      .find('#pagination-menu-list li')
      .at(1)
      .simulate('click');
    let inputValue = fullWrapper
      .find('#pagination-input')
      .at(0)
      .text();
    assert.strictEqual(inputValue, '2');

    // add data to simulate state change
    let newData = data.map(item => [...item]);
    newData.push(['Harry Smith', 'Test Corp', 'Philadelphia', 'PA', undefined]);
    fullWrapper.setProps({ data: newData });

    // simulate paging forward to test whether or not the `currentPage` was reset
    fullWrapper
      .find('#pagination-next')
      .at(0)
      .simulate('click');
    assert.strictEqual(currentPage, 1);

    // grab pagination value to test whether or not `rowsPerPage` was reset
    inputValue = fullWrapper
      .find('#pagination-input')
      .at(0)
      .text();
    assert.strictEqual(inputValue, '2');

    // test that data updated properly
    let props = fullWrapper.props();
    const expectedResult = [
      ['Joe James', 'Test Corp', 'Yonkers', 'NY'],
      ['John Walsh', 'Test Corp', 'Hartford', null],
      ['Bob Herm', 'Test Corp', 'Tampa', 'FL'],
      ['James Houston', 'Test Corp', 'Dallas', 'TX'],
      ['Harry Smith', 'Test Corp', 'Philadelphia', 'PA', undefined],
    ];
    assert.deepEqual(props.data, expectedResult);
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
    const expectedResult = [[], [], [], [], []];

    assert.deepEqual(state.filterList, expectedResult);
  });

  it('should correctly build internal unique column data for filterData structure', () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    const state = shallowWrapper.dive().state();
    const expectedResult = [
      ['Herm, Bob', 'Houston, James', 'James, Joe', 'Walsh, John'],
      ['Test Corp'],
      ['Dallas', 'Hartford', 'Tampa', 'Yonkers'],
      ['FL', null, 'NY', 'TX'],
      [undefined],
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

  it('should allow empty array rowsPerPageOptions when provided in options', () => {
    const options = {
      rowsPerPageOptions: [],
    };

    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} options={options} />);
    const state = shallowWrapper.dive().state();
    assert.deepEqual(state.rowsPerPageOptions, []);
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

  it('should not render toolbar when all its displayable items are missing', () => {
    const options = {
      filter: false,
      search: false,
      print: false,
      download: false,
      viewColumns: false,
    };

    const mountWrapper = mount(<MUIDataTable columns={columns} data={data} options={options} />);
    const actualResult = mountWrapper.find(TableToolbar);
    assert.lengthOf(actualResult, 0);
  });

  it('should properly set internal filterList when calling filterUpdate method with type=checkbox', () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    const table = shallowWrapper.dive();
    const instance = table.instance();
    instance.filterUpdate(0, 'Joe James', 'Name', 'checkbox');
    table.update();
    const state = table.state();
    assert.deepEqual(state.filterList, [['Joe James'], [], [], [], []]);
  });

  it('should remove entry from filterList when calling filterUpdate method with type=checkbox and same arguments a second time', () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    const table = shallowWrapper.dive();
    const instance = table.instance();
    instance.filterUpdate(0, 'Joe James', 'Name', 'checkbox');
    table.update();

    let state = table.state();
    assert.deepEqual(state.filterList, [['Joe James'], [], [], [], []]);

    instance.filterUpdate(0, 'Joe James', 'checkbox');
    table.update();

    state = table.state();
    assert.deepEqual(state.filterList, [[], [], [], [], []]);
  });

  it('should properly set internal filterList when calling filterUpdate method with type=dropdown', () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    const table = shallowWrapper.dive();
    const instance = table.instance();
    instance.filterUpdate(0, ['Joe James'], 'Name', 'dropdown');
    table.update();

    const state = table.state();
    assert.deepEqual(state.filterList, [['Joe James'], [], [], [], []]);
  });

  it('should apply columns prop change for filterList', () => {
    const mountShallowWrapper = mount(shallow(<MUIDataTable columns={columns} data={data} />).get(0));
    const instance = mountShallowWrapper.instance();
    instance.initializeTable(mountShallowWrapper.props());
    // now use updated columns props
    const newColumns = cloneDeep(columns);
    newColumns[0].options.filterList = ['Joe James'];
    mountShallowWrapper.setProps({ columns: newColumns });
    mountShallowWrapper.update();
    instance.setTableData(mountShallowWrapper.props(), 1 /* instance.TABLE_LOAD.INITIAL */);

    const updatedState = mountShallowWrapper.state();
    assert.deepEqual(updatedState.filterList, [['Joe James'], [], [], [], []]);
  });

  it('should create Chip when filterList is populated', () => {
    const filterList = [['Joe James'], [], [], [], []];
    const filterListRenderers = [
      defaultRenderCustomFilterList,
      defaultRenderCustomFilterList,
      defaultRenderCustomFilterList,
      defaultRenderCustomFilterList,
      defaultRenderCustomFilterList,
    ];
    const columnNames = columns.map(column => ({ name: column.name }));

    const mountWrapper = mount(
      <TableFilterList
        filterList={filterList}
        filterListRenderers={filterListRenderers}
        filterUpdate={() => true}
        columnNames={columnNames}
      />,
    );
    const actualResult = mountWrapper.find(Chip);
    assert.strictEqual(actualResult.length, 1);
  });

  it('should create Chip with custom label when filterList and customFilterListRender are populated', () => {
    const filterList = [['Joe James'], [], [], [], []];
    const filterListRenderers = columns.map(c => {
      return c.options && c.options.customFilterListRender
        ? c.options.customFilterListRender
        : defaultRenderCustomFilterList;
    });
    const columnNames = columns.map(column => ({ name: column.name }));

    const mountWrapper = mount(
      <TableFilterList
        filterList={filterList}
        filterListRenderers={filterListRenderers}
        filterUpdate={() => true}
        columnNames={columnNames}
      />,
    );
    const actualResult = mountWrapper.find(Chip);
    assert.strictEqual(actualResult.length, 1);
    assert.strictEqual(actualResult.prop('label'), 'Name: Joe James');
  });

  it('should remove entry from filterList when calling filterUpdate method with type=dropdown and an empty array', () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    const table = shallowWrapper.dive();
    const instance = table.instance();
    instance.filterUpdate(0, ['Joe James'], 'Name', 'dropdown');
    table.update();

    let state = table.state();
    assert.deepEqual(state.filterList, [['Joe James'], [], [], [], []]);

    instance.filterUpdate(0, [], 'Name', 'dropdown');
    table.update();

    state = table.state();
    assert.deepEqual(state.filterList, [[], [], [], [], []]);
  });

  it('should properly reset internal filterList when calling resetFilters method', () => {
    // set a filter
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    const table = shallowWrapper.dive();
    const instance = table.instance();
    instance.filterUpdate(0, 'Joe James', 'Name', 'checkbox');
    table.update();

    // now remove it
    let state = table.state();
    assert.deepEqual(state.filterList, [['Joe James'], [], [], [], []]);

    instance.resetFilters();
    table.update();
    state = table.state();
    assert.deepEqual(state.filterList, [[], [], [], [], []]);
  });

  it('should have the proper column name in onFilterChange when applying filters', () => {
    let changedColumn;
    const options = {
      onFilterChange: column => (changedColumn = column),
    };

    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} options={options} />);
    const table = shallowWrapper.dive();
    const instance = table.instance();

    // test checkbox filter
    instance.filterUpdate(0, 'Joe James', 'Name', 'checkbox');
    table.update();
    assert.strictEqual(changedColumn, 'Name');

    // test dropdown filter
    instance.filterUpdate(0, ['Test Corp'], 'Company', 'dropdown');
    table.update();
    assert.strictEqual(changedColumn, 'Company');

    // test textField filter
    instance.filterUpdate(0, 'Joe James', 'Name', 'textField');
    table.update();
    assert.strictEqual(changedColumn, 'Name');

    // test multiselect filter
    instance.filterUpdate(0, 'Test Corp', 'Company', 'multiselect');
    table.update();
    assert.strictEqual(changedColumn, 'Company');

    // test reset filters
    instance.resetFilters();
    table.update();
    assert.strictEqual(changedColumn, null);
  });

  it('should properly set searchText when calling searchTextUpdate method', () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    const table = shallowWrapper.dive();
    const instance = table.instance();

    instance.searchTextUpdate('Joe');
    table.update();
    const state = table.state();

    const expectedResult = JSON.stringify([
      { data: ['James, Joe', 'Test Corp', renderCities('Yonkers', { rowIndex: 0 }), 'NY', undefined], dataIndex: 0 },
    ]);

    assert.deepEqual(JSON.stringify(state.displayData), expectedResult);
  });

  it('should filter displayData when searchText is set', () => {
    const options = {
      searchText: 'Joe',
    };
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} options={options} />);
    const state = shallowWrapper.dive().state();

    const expectedResult = JSON.stringify([
      { data: ['James, Joe', 'Test Corp', renderCities('Yonkers', { rowIndex: 0 }), 'NY', undefined], dataIndex: 0 },
    ]);

    assert.deepEqual(JSON.stringify(state.displayData), expectedResult);
  });

  it('should sort provided column with defined data, in descending order when calling toggleSortColum method for the first time', () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />).dive();
    const instance = shallowWrapper.instance();

    instance.toggleSortColumn(0);
    shallowWrapper.update();
    const state = shallowWrapper.state();

    const expectedResult = JSON.stringify([
      { data: ['Walsh, John', 'Test Corp', renderCities('Hartford', { rowIndex: 0 }), null, undefined], dataIndex: 1 },
      { data: ['James, Joe', 'Test Corp', renderCities('Yonkers', { rowIndex: 1 }), 'NY', undefined], dataIndex: 0 },
      { data: ['Houston, James', 'Test Corp', renderCities('Dallas', { rowIndex: 2 }), 'TX', undefined], dataIndex: 3 },
      { data: ['Herm, Bob', 'Test Corp', renderCities('Tampa', { rowIndex: 3 }), 'FL', undefined], dataIndex: 2 },
    ]);

    assert.deepEqual(JSON.stringify(state.displayData), expectedResult);
  });

  it('should sort provided column with undefined data as though it were an empty string, in descending order when calling toggleSortColum method for the first time', () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />).dive();
    const instance = shallowWrapper.instance();

    instance.toggleSortColumn(4);
    shallowWrapper.update();
    const state = shallowWrapper.state();

    const expectedResult = JSON.stringify([
      { data: ['James, Joe', 'Test Corp', renderCities('Yonkers', { rowIndex: 0 }), 'NY', undefined], dataIndex: 0 },
      { data: ['Walsh, John', 'Test Corp', renderCities('Hartford', { rowIndex: 1 }), null, undefined], dataIndex: 1 },
      { data: ['Herm, Bob', 'Test Corp', renderCities('Tampa', { rowIndex: 2 }), 'FL', undefined], dataIndex: 2 },
      { data: ['Houston, James', 'Test Corp', renderCities('Dallas', { rowIndex: 3 }), 'TX', undefined], dataIndex: 3 },
    ]);

    assert.deepEqual(JSON.stringify(state.displayData), expectedResult);
  });

  it('should sort provided column in ascending order when calling toggleSortColum method twice', () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />).dive();
    const instance = shallowWrapper.instance();

    instance.toggleSortColumn(0);
    instance.toggleSortColumn(0);
    shallowWrapper.update();
    const state = shallowWrapper.state();

    const expectedResult = JSON.stringify([
      { data: ['Herm, Bob', 'Test Corp', renderCities('Tampa', { rowIndex: 0 }), 'FL', undefined], dataIndex: 2 },
      { data: ['Houston, James', 'Test Corp', renderCities('Dallas', { rowIndex: 1 }), 'TX', undefined], dataIndex: 3 },
      { data: ['James, Joe', 'Test Corp', renderCities('Yonkers', { rowIndex: 2 }), 'NY', undefined], dataIndex: 0 },
      { data: ['Walsh, John', 'Test Corp', renderCities('Hartford', { rowIndex: 3 }), null, undefined], dataIndex: 1 },
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
        empty: false,
        print: true,
        sort: true,
        filter: true,
        label: 'Name',
        download: true,
        searchable: true,
        sortDirection: 'none',
        customBodyRender: renderName,
        viewColumns: true,
        customFilterListRender: renderCustomFilterList,
      },
      {
        name: 'Company',
        display: 'true',
        empty: false,
        print: true,
        sort: true,
        filter: true,
        label: 'Company',
        download: true,
        searchable: true,
        viewColumns: true,
        sortDirection: 'none',
      },
      {
        name: 'City',
        display: 'true',
        empty: false,
        print: true,
        sort: true,
        filter: true,
        filterType: 'textField',
        label: 'City Label',
        download: true,
        searchable: true,
        sortDirection: 'none',
        customBodyRender: renderCities,
        viewColumns: true,
      },
      {
        name: 'State',
        display: 'true',
        empty: false,
        print: true,
        sort: true,
        filter: true,
        filterType: 'multiselect',
        label: 'State',
        download: true,
        searchable: true,
        viewColumns: true,
        sortDirection: 'none',
        customBodyRender: renderState,
        customHeadRender: renderHead,
      },
      {
        name: 'Empty',
        display: 'true',
        empty: true,
        print: true,
        sort: true,
        filter: true,
        filterType: 'checkbox',
        label: 'Empty',
        download: true,
        searchable: true,
        viewColumns: true,
        sortDirection: 'none',
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

  it('If selectableRows=single, only the last cell must be selected when calling selectRowUpdate method with type=cell.', () => {
    const options = { selectableRows: 'single' };
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} options={options} />).dive();
    const instance = shallowWrapper.instance();

    instance.selectRowUpdate('cell', { index: 0, dataIndex: 0 });
    instance.selectRowUpdate('cell', { index: 1, dataIndex: 1 });
    shallowWrapper.update();

    const state = shallowWrapper.state();
    assert.deepEqual(state.selectedRows.data, [{ index: 1, dataIndex: 1 }]);
  });

  it('should allow multiple cells to be selected when selectableRows=multiple and selectRowUpdate method with type=cell.', () => {
    const options = { selectableRows: 'multiple' };
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} options={options} />).dive();
    const instance = shallowWrapper.instance();

    instance.selectRowUpdate('cell', { index: 0, dataIndex: 0 });
    instance.selectRowUpdate('cell', { index: 1, dataIndex: 1 });
    shallowWrapper.update();

    const expectedResult = [{ index: 0, dataIndex: 0 }, { index: 1, dataIndex: 1 }];
    const state = shallowWrapper.state();
    assert.deepEqual(state.selectedRows.data, expectedResult);
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

  it('should allow multiple cells to be selected when selectableRows=multiple and selectRowUpdate method with type=cell and there are adjacent rows.', () => {
    const options = { selectableRows: 'multiple' };
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} options={options} />).dive();
    const instance = shallowWrapper.instance();

    instance.selectRowUpdate('cell', { index: 0, dataIndex: 0 }, [
      { index: 0, dataIndex: 0 },
      { index: 1, dataIndex: 1 },
    ]);
    shallowWrapper.update();

    const expectedResult = [{ index: 0, dataIndex: 0 }, { index: 1, dataIndex: 1 }];
    const state = shallowWrapper.state();
    assert.deepEqual(state.selectedRows.data, expectedResult);
  });

  it('should allow multiple cells to be selected and then unselected when selectableRows=multiple and selectRowUpdate method with type=cell and there are adjacent rows.', () => {
    const options = { selectableRows: 'multiple' };
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} options={options} />).dive();
    const instance = shallowWrapper.instance();

    instance.selectRowUpdate('cell', { index: 0, dataIndex: 0 }, [
      { index: 1, dataIndex: 1 },
      { index: 2, dataIndex: 2 },
    ]);
    instance.selectRowUpdate('cell', { index: 1, dataIndex: 1 }, [{ index: 0, dataIndex: 0 }]);
    shallowWrapper.update();

    const expectedResult = [{ index: 2, dataIndex: 2 }];
    const state = shallowWrapper.state();
    assert.deepEqual(state.selectedRows.data, expectedResult);
  });

  it('should not update selectedRows when using rowsSelected option with type=none', () => {
    const options = {
      selectableRows: 'none',
      rowsSelected: [0],
    };
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} options={options} />).dive();
    const instance = shallowWrapper.instance();

    const state = shallowWrapper.state();
    const expectedResult = [];

    assert.deepEqual(state.selectedRows.data, expectedResult);
  });

  it('should update selectedRows when using rowsSelected option with type=single', () => {
    const options = {
      selectableRows: 'single',
      rowsSelected: [0],
    };
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} options={options} />).dive();
    const instance = shallowWrapper.instance();

    const state = shallowWrapper.state();
    const expectedResult = [{ index: 0, dataIndex: 0 }];

    assert.deepEqual(state.selectedRows.data, expectedResult);
  });

  it('should update selectedRows when using rowsSelected option with type=multiple', () => {
    const options = {
      selectableRows: 'multiple',
      rowsSelected: [0, 3],
    };
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} options={options} />).dive();
    const instance = shallowWrapper.instance();

    const state = shallowWrapper.state();
    const expectedResult = [{ index: 0, dataIndex: 0 }, { index: 3, dataIndex: 3 }];

    assert.deepEqual(state.selectedRows.data, expectedResult);
  });

  it('should update selectedRows (with default type=multiple option) when using rowsSelected with no option specified', () => {
    const options = {
      rowsSelected: [0, 3],
    };
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} options={options} />).dive();
    const instance = shallowWrapper.instance();

    const state = shallowWrapper.state();
    const expectedResult = [{ index: 0, dataIndex: 0 }, { index: 3, dataIndex: 3 }];

    assert.deepEqual(state.selectedRows.data, expectedResult);
  });

  it('should update expandedRows when using expandableRows option with default rowsExpanded', () => {
    const options = {
      expandableRows: true,
      rowsExpanded: [0, 3],
      renderExpandableRow: () => (
        <tr>
          <td>opened</td>
        </tr>
      ),
    };
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} options={options} />).dive();
    const instance = shallowWrapper.instance();

    const state = shallowWrapper.state();
    const expectedResult = [{ index: 0, dataIndex: 0 }, { index: 3, dataIndex: 3 }];

    assert.deepEqual(state.expandedRows.data, expectedResult);
  });

  it('should remove selected data on selectRowDelete when type=cell', () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />).dive();
    const instance = shallowWrapper.instance();
    const onRowsDelete = () => {};
    const selectedRows = { data: [1] };

    instance.selectRowUpdate('cell', { index: 0, dataIndex: 0 });
    shallowWrapper.update();
    instance.selectRowDelete();
    shallowWrapper.update();

    const newDisplayData = shallowWrapper.state().displayData;
    const expectedResult = JSON.stringify([
      { data: ['Walsh, John', 'Test Corp', renderCities('Hartford', { rowIndex: 0 }), null, undefined], dataIndex: 1 },
      { data: ['Herm, Bob', 'Test Corp', renderCities('Tampa', { rowIndex: 1 }), 'FL', undefined], dataIndex: 2 },
      { data: ['Houston, James', 'Test Corp', renderCities('Dallas', { rowIndex: 2 }), 'TX', undefined], dataIndex: 3 },
    ]);

    assert.deepEqual(JSON.stringify(newDisplayData), expectedResult);
  });

  it('should not remove selected data on selectRowDelete when type=cell when onRowsDelete returns false', () => {
    const options = {
      onRowsDelete: () => false,
    };
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} options={options} />).dive();
    const instance = shallowWrapper.instance();
    const selectedRows = { data: [1] };

    instance.selectRowUpdate('cell', { index: 0, dataIndex: 0 });
    shallowWrapper.update();
    instance.selectRowDelete();
    shallowWrapper.update();

    const myDisplayData = shallowWrapper.state().displayData;

    assert.deepEqual(JSON.stringify(myDisplayData), displayData);
  });

  it('should update value when calling updateValue method in customBodyRender', () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />).dive();
    const instance = shallowWrapper.instance();

    instance.updateDataCol(0, 2, 'Las Vegas');
    shallowWrapper.update();

    const state = shallowWrapper.state();
    assert.deepEqual(state.data[0].data[2], 'Las Vegas');
  });

  it('should call onTableInit when MUIDataTable is initialized', () => {
    const options = { selectableRows: true, onTableInit: spy() };
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} options={options} />).dive();
    const instance = shallowWrapper.instance();

    assert.strictEqual(options.onTableInit.callCount, 1);
  });

  it('should call onTableInit only 1 time when creating table and calling selectRowUpdate method with type=head', () => {
    const options = { selectableRows: true, onTableInit: spy() };
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} options={options} />).dive();
    const instance = shallowWrapper.instance();

    instance.selectRowUpdate('head', 0);
    shallowWrapper.update();

    assert.strictEqual(options.onTableInit.callCount, 1);
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
    instance.filterUpdate(0, 'James, Joe', 'Name', 'checkbox');
    table.update();
    const state = table.state();

    const expectedResult = JSON.stringify([
      { data: ['James, Joe', 'Test Corp', renderCities('Yonkers', { rowIndex: 0 }), 'NY', undefined], dataIndex: 0 },
    ]);

    assert.deepEqual(JSON.stringify(state.displayData), expectedResult);
  });

  it('should render all things that match a text field filter', () => {
    const options = { filterType: 'textField' };
    columns[0].options.filterType = 'textField';
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} options={options} />);
    const table = shallowWrapper.dive();
    const instance = table.instance();
    instance.filterUpdate(0, 'James', 'Name', 'textField');
    table.update();
    const state = table.state();

    const expectedResult = JSON.stringify([
      { data: ['James, Joe', 'Test Corp', renderCities('Yonkers', { rowIndex: 0 }), 'NY', undefined], dataIndex: 0 },
      { data: ['Houston, James', 'Test Corp', renderCities('Dallas', { rowIndex: 3 }), 'TX', undefined], dataIndex: 3 },
    ]);

    assert.deepEqual(JSON.stringify(state.displayData), expectedResult);
  });

  it('should skip client side filtering if server side filtering is enabled', () => {
    const options = { filterType: 'textField', serverSide: true };
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} options={options} />);
    const table = shallowWrapper.dive();
    const instance = table.instance();
    instance.filterUpdate(0, ['Joe James'], 'Name', 'dropdown');
    table.update();
    const state = table.state();

    assert.equal(state.displayData.length, data.length);
  });

  describe('should displayData consider filterOptions with logic', () => {
    it('with one column', () => {
      const customFilterColumns = columns.map(c => {
        if (c.name === 'Name')
          return {
            ...c,
            options: {
              ...c.options,
              filterOptions: {
                names: ['B', 'J'],
                logic(name, filters) {
                  const firstLetter = name[0];
                  return firstLetter !== filters[0];
                },
              },
            },
          };
        return c;
      });

      const shallowWrapper = shallow(<MUIDataTable columns={customFilterColumns} data={data} />);
      const table = shallowWrapper.dive();
      const instance = table.instance();
      instance.filterUpdate(0, 'J', 'checkbox');
      table.update();

      const state = table.state();
      assert.deepEqual(state.filterList, [['J'], [], [], [], []]);

      const expectedResult = JSON.stringify([
        { data: ['James, Joe', 'Test Corp', renderCities('Yonkers', { rowIndex: 0 }), 'NY', undefined], dataIndex: 0 },
      ]);
      assert.deepEqual(JSON.stringify(state.displayData), expectedResult);
    });

    it('operating as AND', () => {
      const customFilterColumns = columns.map(c => {
        if (c.name === 'Name')
          return {
            ...c,
            options: {
              ...c.options,
              filterOptions: {
                names: ['B', 'J', 'H'],
                logic(name, filters) {
                  const firstLetter = name[0];
                  return firstLetter !== filters[0];
                },
              },
            },
          };
        if (c.name === 'State')
          return {
            ...c,
            options: {
              ...c.options,
              filterOptions: {
                names: ['NY', 'FL', 'TX'],
              },
            },
          };
        return c;
      });

      const shallowWrapper = shallow(<MUIDataTable columns={customFilterColumns} data={data} />);
      const table = shallowWrapper.dive();
      const instance = table.instance();
      instance.filterUpdate(0, 'H', 'checkbox');
      instance.filterUpdate(3, 'TX', 'checkbox');
      table.update();

      const state = table.state();
      assert.deepEqual(state.filterList, [['H'], [], [], ['TX'], []]);

      const expectedResult = JSON.stringify([
        {
          data: ['Houston, James', 'Test Corp', renderCities('Dallas', { rowIndex: 3 }), 'TX', undefined],
          dataIndex: 3,
        },
      ]);
      assert.deepEqual(JSON.stringify(state.displayData), expectedResult);
    });
  });

  describe('should correctly handle array data', () => {
    const columns = [
      {
        name: 'otherData',
        options: {
          filter: true,
        },
      },
      {
        name: 'array',
        options: {
          filter: true,
        },
      },
    ];
    const data = [
      ['other-data-1', ['a', 'b', 'c']],
      ['other-data-3', ['a']],
      ['other-data-2', ['a', 'b']],
      ['other-data-4', []],
    ];
    const options = {
      filter: true,
      filterType: 'dropdown',
      responsive: 'scrollMaxHeight',
    };

    it('should correctly filter array data', () => {
      const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} options={options} />);
      const table = shallowWrapper.dive();
      const instance = table.instance();
      instance.filterUpdate(1, ['b'], 'Name', 'dropdown');
      table.update();
      const { displayData } = table.state();

      const expectedResult = JSON.stringify([
        { data: ['other-data-1', ['a', 'b', 'c']], dataIndex: 0 },
        { data: ['other-data-2', ['a', 'b']], dataIndex: 2 },
      ]);
      assert.deepEqual(JSON.stringify(displayData), expectedResult);
    });
    it('should correctly extract array data for filterData', () => {
      const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} options={options} />);
      const table = shallowWrapper.dive();
      const { filterData } = table.state();
      const expectedResult = JSON.stringify([
        ['other-data-1', 'other-data-2', 'other-data-3', 'other-data-4'],
        ['a', 'b', 'c'],
      ]);
      assert.deepEqual(JSON.stringify(filterData), expectedResult);
    });
  });

  describe('should correctly handle non-array data', () => {
    const columns = [
      {
        name: 'otherData',
        options: {
          filter: true,
        },
      },
      {
        name: 'non-array',
        options: {
          filter: true,
        },
      },
    ];
    const data = [['other-data-1', 'a'], ['other-data-2', 'b'], ['other-data-3', 'c'], ['other-data-4', 'd']];
    const options = {
      filter: true,
      filterType: 'dropdown',
      responsive: 'scrollMaxHeight',
    };

    it('should correctly filter data when no array data is present', () => {
      const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} options={options} />);
      const table = shallowWrapper.dive();
      const instance = table.instance();
      instance.filterUpdate(1, ['b'], 'Name', 'dropdown');
      table.update();
      const { displayData } = table.state();

      const expectedResult = JSON.stringify([{ data: ['other-data-2', 'b'], dataIndex: 1 }]);
      assert.deepEqual(JSON.stringify(displayData), expectedResult);
    });
    it('should correctly extract filterData when no array data is present', () => {
      const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} options={options} />);
      const table = shallowWrapper.dive();
      const { filterData } = table.state();
      const expectedResult = JSON.stringify([
        ['other-data-1', 'other-data-2', 'other-data-3', 'other-data-4'],
        ['a', 'b', 'c', 'd'],
      ]);
      assert.deepEqual(JSON.stringify(filterData), expectedResult);
    });
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
