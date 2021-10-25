import React from 'react';
import { spy, stub } from 'sinon';
import { mount, shallow } from 'enzyme';
import { assert, expect } from 'chai';
import cloneDeep from 'lodash.clonedeep';
import MUIDataTable from '../src/MUIDataTable';
import TableFilterList from '../src/components/TableFilterList';
import TablePagination from '../src/components/TablePagination';
import TableToolbar from '../src/components/TableToolbar';
import TableToolbarSelect from '../src/components/TableToolbarSelect';
import getTextLabels from '../src/textLabels';
import Chip from '@mui/material/Chip';
import Cities from '../examples/component/cities';
import { getCollatorComparator } from '../src/utils';
import TableFooter from '@mui/material/TableFooter';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

describe('<MUIDataTable />', function() {
  const tableId = 'tableID';
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
      {
        name: 'Name',
        options: {
          customBodyRender: renderName,
          customFilterListOptions: { render: renderCustomFilterList },
        },
      },
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
        viewColumns: true,
        customFilterListOptions: { render: renderCustomFilterList },
        customBodyRender: renderName,
        sortCompare: null,
        sortThirdClickReset: false,
        sortDescFirst: false,
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
        sortCompare: null,
        sortThirdClickReset: false,
        sortDescFirst: false,
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
        customBodyRender: renderCities,
        sortCompare: null,
        sortThirdClickReset: false,
        sortDescFirst: false,
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
        customBodyRender: renderState,
        customHeadRender: renderHead,
        sortCompare: null,
        sortThirdClickReset: false,
        sortDescFirst: false,
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
        sortCompare: null,
        sortThirdClickReset: false,
        sortDescFirst: false,
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
            customFilterListOptions: { render: renderCustomFilterList },
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
        viewColumns: true,
        customFilterListOptions: { render: renderCustomFilterList },
        customBodyRender: renderName,
        sortCompare: null,
        sortThirdClickReset: false,
        sortDescFirst: false,
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
        sortCompare: null,
        sortThirdClickReset: false,
        sortDescFirst: false,
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
        customBodyRender: renderCities,
        sortCompare: null,
        sortThirdClickReset: false,
        sortDescFirst: false,
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
        customBodyRender: renderState,
        customHeadRender: renderHead,
        sortCompare: null,
        sortThirdClickReset: false,
        sortDescFirst: false,
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
        sortCompare: null,
        sortThirdClickReset: false,
        sortDescFirst: false,
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

  it('should correctly build internal table data and displayData structure when using nested data (option enableNestedDataAccess omitted )', () => {
    const columns = [
      {
        name: 'Name',
        options: {
          customBodyRender: renderName,
          customFilterListOptions: { render: renderCustomFilterList },
        },
      },
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
      { data: ['James, Joe', 'Test Corp', null, null, null], dataIndex: 0 },
      { data: ['Walsh, John', 'Test Corp', null, null, null], dataIndex: 1 },
      { data: ['Herm, Bob', 'Test Corp', null, null, null], dataIndex: 2 },
      { data: ['Houston, James', 'Test Corp', null, null, null], dataIndex: 3 },
    ]);
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    const state = shallowWrapper.dive().state();

    assert.deepEqual(JSON.stringify(state.displayData), displayData);
  });

  it('should correctly build internal table data and displayData structure with enabled nested data custom marker (option enableNestedDataAccess : "/OK/" )', () => {
    const columns = [
      {
        name: 'Name',
        options: {
          customBodyRender: renderName,
          customFilterListOptions: { render: renderCustomFilterList },
        },
      },
      'Company',
      { name: 'Location/OK/City', label: 'City Label' },
      { name: 'Location/OK/State' },
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
    const shallowWrapper = shallow(
      <MUIDataTable columns={columns} data={data} options={{ enableNestedDataAccess: '/OK/' }} />,
    );
    const state = shallowWrapper.dive().state();

    assert.deepEqual(JSON.stringify(state.displayData), displayData);
  });

  it('should correctly build internal table data and displayData structure with disabled nested data (option enableNestedDataAccess : "" )', () => {
    const columns = [
      {
        name: 'Name',
        options: {
          customBodyRender: renderName,
          customFilterListOptions: { render: renderCustomFilterList },
        },
      },
      'Company',
      { name: 'Location/OK/City', label: 'City Label' },
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
      { data: ['James, Joe', 'Test Corp', null, null, undefined], dataIndex: 0 },
      { data: ['Walsh, John', 'Test Corp', null, null, undefined], dataIndex: 1 },
      { data: ['Herm, Bob', 'Test Corp', null, null, undefined], dataIndex: 2 },
      { data: ['Houston, James', 'Test Corp', null, null, undefined], dataIndex: 3 },
    ]);
    const shallowWrapper = shallow(
      <MUIDataTable columns={columns} data={data} options={{ enableNestedDataAccess: '' }} />,
    );
    const state = shallowWrapper.dive().state();

    assert.deepEqual(JSON.stringify(state.displayData), displayData);
  });

  it('should correctly build internal table data and displayData structure with sortOrder set', () => {
    const columns = ['Name', 'Company', 'Location'];

    const data = [
      { Name: 'Joe James', Company: 'Test Corp', Location: 'Las Cruces' },
      { Name: 'John Walsh', Company: 'Test Corp', Location: 'El Paso' },
      { Name: 'Bob Herm', Company: 'Test Corp', Location: 'Albuquerque' },
      { Name: 'James Houston', Company: 'Test Corp', Location: 'Santa Fe' },
    ];
    const displayData = JSON.stringify([
      { data: ['Bob Herm', 'Test Corp', 'Albuquerque'], dataIndex: 2 },
      { data: ['John Walsh', 'Test Corp', 'El Paso'], dataIndex: 1 },
      { data: ['Joe James', 'Test Corp', 'Las Cruces'], dataIndex: 0 },
      { data: ['James Houston', 'Test Corp', 'Santa Fe'], dataIndex: 3 },
    ]);
    const shallowWrapper = shallow(
      <MUIDataTable columns={columns} data={data} options={{ sortOrder: { name: 'Location', direction: 'asc' } }} />,
    );
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

        fullWrapper.unmount();
        done();
      }, 10);
    });
  });

  it('should correctly set tableId', () => {
    const fullWrapper = mount(<MUIDataTable columns={columns} data={[]} options={{ tableId: 'myTable123' }} />);
    assert.strictEqual(fullWrapper.find('[data-tableid="myTable123"]').length, 12);
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
    fullWrapper.unmount();
  });

  it('should correctly sort', () => {
    const columns = [
      {
        name: 'Name',
        options: {},
      },
      'Company',
      'Location',
    ];

    const data = [
      { Name: 'Joe James', Company: 'Test Corp', Location: 'Las Cruces' },
      { Name: 'John Walsh', Company: 'Test Corp', Location: 'El Paso' },
      { Name: 'Bob Herm', Company: 'Test Corp', Location: 'Albuquerque' },
      { Name: 'James Houston', Company: 'Test Corp', Location: 'Santa Fe' },
    ];
    const displayData1 = JSON.stringify([
      { data: ['Bob Herm', 'Test Corp', 'Albuquerque'], dataIndex: 2 },
      { data: ['James Houston', 'Test Corp', 'Santa Fe'], dataIndex: 3 },
      { data: ['Joe James', 'Test Corp', 'Las Cruces'], dataIndex: 0 },
      { data: ['John Walsh', 'Test Corp', 'El Paso'], dataIndex: 1 },
    ]);
    const displayData2 = JSON.stringify([
      { data: ['John Walsh', 'Test Corp', 'El Paso'], dataIndex: 1 },
      { data: ['Joe James', 'Test Corp', 'Las Cruces'], dataIndex: 0 },
      { data: ['James Houston', 'Test Corp', 'Santa Fe'], dataIndex: 3 },
      { data: ['Bob Herm', 'Test Corp', 'Albuquerque'], dataIndex: 2 },
    ]);

    const wrapper = mount(<MUIDataTable columns={columns} data={data} options={{}} />);

    wrapper
      .find('[data-testid="headcol-0"]')
      .at(0)
      .simulate('click');
    const fetchedDD1 = JSON.stringify(wrapper.childAt(0).state('displayData'));

    wrapper
      .find('[data-testid="headcol-0"]')
      .at(0)
      .simulate('click');
    const fetchedDD2 = JSON.stringify(wrapper.childAt(0).state('displayData'));

    wrapper
      .find('[data-testid="headcol-0"]')
      .at(0)
      .simulate('click');
    const fetchedDD3 = JSON.stringify(wrapper.childAt(0).state('displayData'));

    wrapper
      .find('[data-testid="headcol-0"]')
      .at(0)
      .simulate('click');
    const fetchedDD4 = JSON.stringify(wrapper.childAt(0).state('displayData'));

    assert.deepEqual(fetchedDD1, displayData1);
    assert.deepEqual(fetchedDD2, displayData2);
    assert.deepEqual(fetchedDD3, displayData1);
    assert.deepEqual(fetchedDD4, displayData2);
  });

  it('should correctly sort when sortThirdClickReset is true', () => {
    const columns = [
      {
        name: 'Name',
        options: {
          sortThirdClickReset: true,
        },
      },
      'Company',
      'Location',
    ];

    const data = [
      { Name: 'Joe James', Company: 'Test Corp', Location: 'Las Cruces' },
      { Name: 'John Walsh', Company: 'Test Corp', Location: 'El Paso' },
      { Name: 'Bob Herm', Company: 'Test Corp', Location: 'Albuquerque' },
      { Name: 'James Houston', Company: 'Test Corp', Location: 'Santa Fe' },
    ];
    const displayData1 = JSON.stringify([
      { data: ['Bob Herm', 'Test Corp', 'Albuquerque'], dataIndex: 2 },
      { data: ['James Houston', 'Test Corp', 'Santa Fe'], dataIndex: 3 },
      { data: ['Joe James', 'Test Corp', 'Las Cruces'], dataIndex: 0 },
      { data: ['John Walsh', 'Test Corp', 'El Paso'], dataIndex: 1 },
    ]);
    const displayData2 = JSON.stringify([
      { data: ['John Walsh', 'Test Corp', 'El Paso'], dataIndex: 1 },
      { data: ['Joe James', 'Test Corp', 'Las Cruces'], dataIndex: 0 },
      { data: ['James Houston', 'Test Corp', 'Santa Fe'], dataIndex: 3 },
      { data: ['Bob Herm', 'Test Corp', 'Albuquerque'], dataIndex: 2 },
    ]);
    const displayData3 = JSON.stringify([
      { data: ['Joe James', 'Test Corp', 'Las Cruces'], dataIndex: 0 },
      { data: ['John Walsh', 'Test Corp', 'El Paso'], dataIndex: 1 },
      { data: ['Bob Herm', 'Test Corp', 'Albuquerque'], dataIndex: 2 },
      { data: ['James Houston', 'Test Corp', 'Santa Fe'], dataIndex: 3 },
    ]);

    const wrapper = mount(<MUIDataTable columns={columns} data={data} options={{}} />);

    wrapper
      .find('[data-testid="headcol-0"]')
      .at(0)
      .simulate('click');
    const fetchedDD1 = JSON.stringify(wrapper.childAt(0).state('displayData'));

    wrapper
      .find('[data-testid="headcol-0"]')
      .at(0)
      .simulate('click');
    const fetchedDD2 = JSON.stringify(wrapper.childAt(0).state('displayData'));

    wrapper
      .find('[data-testid="headcol-0"]')
      .at(0)
      .simulate('click');
    const fetchedDD3 = JSON.stringify(wrapper.childAt(0).state('displayData'));

    wrapper
      .find('[data-testid="headcol-0"]')
      .at(0)
      .simulate('click');
    const fetchedDD4 = JSON.stringify(wrapper.childAt(0).state('displayData'));

    assert.deepEqual(fetchedDD1, displayData1);
    assert.deepEqual(fetchedDD2, displayData2);
    assert.deepEqual(fetchedDD3, displayData3);
    assert.deepEqual(fetchedDD4, displayData1);
  });

  it('should correctly sort when sortDescFirst and sortThirdClickReset are true', () => {
    const columns = [
      {
        name: 'Name',
        options: {
          sortDescFirst: true,
          sortThirdClickReset: true,
        },
      },
      'Company',
      'Location',
    ];

    const data = [
      { Name: 'Joe James', Company: 'Test Corp', Location: 'Las Cruces' },
      { Name: 'John Walsh', Company: 'Test Corp', Location: 'El Paso' },
      { Name: 'Bob Herm', Company: 'Test Corp', Location: 'Albuquerque' },
      { Name: 'James Houston', Company: 'Test Corp', Location: 'Santa Fe' },
    ];
    const displayData1 = JSON.stringify([
      { data: ['John Walsh', 'Test Corp', 'El Paso'], dataIndex: 1 },
      { data: ['Joe James', 'Test Corp', 'Las Cruces'], dataIndex: 0 },
      { data: ['James Houston', 'Test Corp', 'Santa Fe'], dataIndex: 3 },
      { data: ['Bob Herm', 'Test Corp', 'Albuquerque'], dataIndex: 2 },
    ]);
    const displayData2 = JSON.stringify([
      { data: ['Bob Herm', 'Test Corp', 'Albuquerque'], dataIndex: 2 },
      { data: ['James Houston', 'Test Corp', 'Santa Fe'], dataIndex: 3 },
      { data: ['Joe James', 'Test Corp', 'Las Cruces'], dataIndex: 0 },
      { data: ['John Walsh', 'Test Corp', 'El Paso'], dataIndex: 1 },
    ]);
    const displayData3 = JSON.stringify([
      { data: ['Joe James', 'Test Corp', 'Las Cruces'], dataIndex: 0 },
      { data: ['John Walsh', 'Test Corp', 'El Paso'], dataIndex: 1 },
      { data: ['Bob Herm', 'Test Corp', 'Albuquerque'], dataIndex: 2 },
      { data: ['James Houston', 'Test Corp', 'Santa Fe'], dataIndex: 3 },
    ]);

    const wrapper = mount(<MUIDataTable columns={columns} data={data} options={{}} />);

    wrapper
      .find('[data-testid="headcol-0"]')
      .at(0)
      .simulate('click');
    const fetchedDD1 = JSON.stringify(wrapper.childAt(0).state('displayData'));

    wrapper
      .find('[data-testid="headcol-0"]')
      .at(0)
      .simulate('click');
    const fetchedDD2 = JSON.stringify(wrapper.childAt(0).state('displayData'));

    wrapper
      .find('[data-testid="headcol-0"]')
      .at(0)
      .simulate('click');
    const fetchedDD3 = JSON.stringify(wrapper.childAt(0).state('displayData'));

    wrapper
      .find('[data-testid="headcol-0"]')
      .at(0)
      .simulate('click');
    const fetchedDD4 = JSON.stringify(wrapper.childAt(0).state('displayData'));

    assert.deepEqual(fetchedDD1, displayData1);
    assert.deepEqual(fetchedDD2, displayData2);
    assert.deepEqual(fetchedDD3, displayData3);
    assert.deepEqual(fetchedDD4, displayData1);
  });

  it('should correctly pass the sorted column name and direction to onColumnSortChange', () => {
    let sortedCol, sortedDir;
    const options = {
      rowsPerPage: 1,
      rowsPerPageOptions: [1, 2, 4],
      page: 1,
      onColumnSortChange: (col, dir) => {
        sortedCol = col;
        sortedDir = dir;
      },
    };
    const fullWrapper = mount(<MUIDataTable columns={columns} data={data} options={options} />);

    // simulate sorting a column
    fullWrapper
      .find('[data-testid="headcol-1"]')
      .at(0)
      .simulate('click');

    assert.strictEqual(sortedCol, 'Company');
    assert.strictEqual(sortedDir, 'asc');

    // simulate toggling the sort
    fullWrapper
      .find('[data-testid="headcol-1"]')
      .at(0)
      .simulate('click');

    assert.strictEqual(sortedCol, 'Company');
    assert.strictEqual(sortedDir, 'desc');
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

    /*
    TODO: simulating a click on #pagination-rows no longer seems to bring up the menu.
          doing "document.querySelector('#pagination-rows').click()" in the console doesn't
          work either. However, that method does work for #pagination-back and #pagination-next.
          Something was probably updated in Material UI, it's unclear at the moment how to simulate
          an event to bring up the select menu.

    // simulate changing pagination to set `rowsPerPage`
    fullWrapper.find('#pagination-rows').simulate('click');

    fullWrapper
      .find('#pagination-menu-list li')
      .at(1)
      .simulate('click');
*/
    let inputValue = fullWrapper
      .find('#pagination-input')
      .at(0)
      .text();
    assert.strictEqual(inputValue, '1'); // TODO: see above comment, was 2

    // add data to simulate state change
    let newData = data.map(item => [...item]);
    newData.push(['Harry Smith', 'Test Corp', 'Philadelphia', 'PA', undefined]);
    fullWrapper.setProps({ data: newData });

    // simulate paging forward to test whether or not the `currentPage` was reset
    fullWrapper
      .find('#pagination-next')
      .at(0)
      .simulate('click');
    assert.strictEqual(currentPage, 2);

    // grab pagination value to test whether or not `rowsPerPage` was reset
    inputValue = fullWrapper
      .find('#pagination-input')
      .at(0)
      .text();
    assert.strictEqual(inputValue, '1'); // TODO: see above comment, was 2

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
    fullWrapper.unmount();
  });

  it('should not re-build internal table data and displayData structure with no prop change to data or columns', () => {
    const setTableDataSpy = spy(MUIDataTable.Naked.prototype, 'setTableData');
    const mountWrapper = mount(shallow(<MUIDataTable columns={columns} data={data} />).get(0));

    let state = mountWrapper.state();
    assert.deepEqual(JSON.stringify(state.displayData), displayData);

    // now update props with no change
    mountWrapper.setProps({});
    mountWrapper.update();

    state = mountWrapper.state();

    assert.deepEqual(JSON.stringify(state.displayData), displayData);
    assert.deepEqual(setTableDataSpy.callCount, 1);
  });

  it('should add custom props to table if setTableProps provided', () => {
    const options = { setTableProps: stub().returns({ myProp: 'test', className: 'testClass' }) };
    const fullWrapper = mount(<MUIDataTable columns={columns} data={[]} options={options} />);
    const props = fullWrapper
      .find('table')
      .first()
      .props();

    const classNames = props.className.split(' ');
    const finalClass = classNames[classNames.length - 1];

    assert.strictEqual(props.myProp, 'test');
    assert.strictEqual(finalClass, 'testClass');
    assert.isAtLeast(options.setTableProps.callCount, 1);
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
      textLabels: getTextLabels(),
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

  it('should not render select toolbar when disableToolbarSelect=true', () => {
    const options = { disableToolbarSelect: true };
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} options={options} />).dive();
    const instance = shallowWrapper.instance();

    // Simulate a selection
    instance.selectRowUpdate('cell', { index: 0, dataIndex: 0 });

    const actualResult = shallowWrapper.find(TableToolbarSelect);
    assert.lengthOf(actualResult, 0);
  });

  it('should not render select toolbar when selectToolbarPlacement="none"', () => {
    const options = { selectToolbarPlacement: 'none' };
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} options={options} />).dive();
    const instance = shallowWrapper.instance();

    // Simulate a selection
    instance.selectRowUpdate('cell', { index: 0, dataIndex: 0 });

    const actualResult = shallowWrapper.find(TableToolbarSelect);
    assert.lengthOf(actualResult, 0);
    const actualResult2 = shallowWrapper.find(TableToolbar);
    assert.lengthOf(actualResult2, 1);
  });

  it('should not render select toolbar when selectToolbarPlacement="none" and rowsSelected is inputted', () => {
    const options = { selectToolbarPlacement: 'none', rowsSelected: [] };

    // make all rows selected
    data.forEach((item, idx) => {
      options.rowsSelected.push(idx);
    });
    options.rowsSelected.pop(); // all but 1 row is selected

    options.searchText = 'J';

    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} options={options} />).dive();
    const instance = shallowWrapper.instance();

    const actualResult = shallowWrapper.find(TableToolbarSelect);
    assert.lengthOf(actualResult, 0);
    const actualResult2 = shallowWrapper.find(TableToolbar);
    assert.lengthOf(actualResult2, 1);
  });

  it('should render both select toolbar and toolbar when selectToolbarPlacement="above"', () => {
    const options = { selectToolbarPlacement: 'above' };
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} options={options} />).dive();
    const instance = shallowWrapper.instance();

    // Simulate a selection
    instance.selectRowUpdate('cell', { index: 0, dataIndex: 0 });

    const actualResult = shallowWrapper.find(TableToolbarSelect);
    assert.lengthOf(actualResult, 1);
    const actualResult2 = shallowWrapper.find(TableToolbar);
    assert.lengthOf(actualResult2, 1);
  });

  it('should render select toolbar by default', () => {
    const options = {};
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} options={options} />).dive();
    const instance = shallowWrapper.instance();

    // Simulate a selection
    instance.selectRowUpdate('cell', { index: 0, dataIndex: 0 });

    const actualResult = shallowWrapper.find(TableToolbarSelect);
    assert.lengthOf(actualResult, 1);
    const actualResult2 = shallowWrapper.find(TableToolbar);
    assert.lengthOf(actualResult2, 0);
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
        options={{ serverSide: false }}
        filterList={filterList}
        filterListRenderers={filterListRenderers}
        filterUpdate={() => true}
        columnNames={columnNames}
      />,
    );
    const actualResult = mountWrapper.find(Chip);
    assert.strictEqual(actualResult.length, 1);
  });

  it('should create Chip with custom label when filterList and customFilterListOptions are populated', () => {
    const filterList = [['Joe James'], [], [], [], []];
    const filterListRenderers = columns.map(c => {
      return c.options && c.options.customFilterListOptions && c.options.customFilterListOptions.render
        ? c.options.customFilterListOptions.render
        : defaultRenderCustomFilterList;
    });
    const columnNames = columns.map(column => ({ name: column.name }));

    const mountWrapper = mount(
      <TableFilterList
        options={{ serverSide: false }}
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

  it('should call custom filter update function when it is passed into custom filter update', () => {
    const customFilterListUpdate = spy(() => [[], [], [], [], []]);
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    const table = shallowWrapper.dive();
    const instance = table.instance();

    instance.filterUpdate(0, ['Joe James'], 'Name', 'custom', customFilterListUpdate);
    table.update();

    assert.deepEqual(customFilterListUpdate.callCount, 1);
  });

  it('should render filter Chip(s) when options.serverSide = true and serverSideFilterList is populated', () => {
    const serverSideFilterList = [['Joe James'], [], [], [], []];
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
        options={{ serverSide: true }}
        serverSideFilterList={serverSideFilterList}
        filterListRenderers={filterListRenderers}
        filterUpdate={() => true}
        columnNames={columnNames}
      />,
    );

    const actualResult = mountWrapper.find(Chip);
    assert.strictEqual(actualResult.length, 1);
  });

  it('should not render filter Chip(s) when options.serverSide = true and serverSideFilterList is not populated', () => {
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
        options={{ serverSide: true }}
        serverSideFilterList={[]}
        filterListRenderers={filterListRenderers}
        filterUpdate={() => true}
        columnNames={columnNames}
      />,
    );

    const actualResult = mountWrapper.find(Chip);
    assert.strictEqual(actualResult.length, 0);
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

  it('should have the proper type in onFilterChange when calling resetFilters method', () => {
    let type;
    const options = {
      onFilterChange: (changedColumn, filterList, changeType) => (type = changeType),
    };

    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} options={options} />);
    const table = shallowWrapper.dive();
    const instance = table.instance();

    instance.resetFilters();
    table.update();
    assert.strictEqual(type, 'reset');
  });

  it('should render a footer after the tbody element when customTableBodyFooterRender is called', () => {
    const options = {};

    const mountWrapper = mount(<MUIDataTable columns={columns} data={data} options={options} />);
    const actualResult = mountWrapper.find('#custom_column_footer');
    assert.strictEqual(actualResult.exists(), false);

    mountWrapper.unmount();
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

  it('should properly set searchText when hiding the search bar', () => {
    const options = {
      rowsPerPage: 1,
      textLabels: getTextLabels(),
    };
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    const table = shallowWrapper.dive();
    const instance = table.instance();
    const shallowWrapperTableToolbar = shallow(
      <TableToolbar
        options={options}
        searchTextUpdate={spy()}
        searchClose={instance.searchClose}
        columns={columns}
        data={data}
        setTableAction={spy()}
      />,
    );
    const instanceTableToolbar = shallowWrapperTableToolbar.dive().instance();

    instance.searchTextUpdate('Joe');
    table.update();
    instanceTableToolbar.searchButton = { focus: () => {} };
    instanceTableToolbar.hideSearch();
    table.update();
    const searchText = table.state().searchText;

    assert.strictEqual(searchText, null);
  });

  it('should not change page when hiding the search bar', () => {
    const options = {
      rowsPerPage: 1,
      textLabels: getTextLabels(),
    };
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} options={options} />);
    const table = shallowWrapper.dive();
    const instance = table.instance();
    const shallowWrapperTableToolbar = shallow(
      <TableToolbar
        options={options}
        searchTextUpdate={spy()}
        searchClose={instance.searchClose}
        columns={columns}
        data={data}
        setTableAction={spy()}
      />,
    );
    const instanceTableToolbar = shallowWrapperTableToolbar.dive().instance();

    // Simulate a search that has multiple pages of results
    instanceTableToolbar.setActiveIcon('search');
    instanceTableToolbar.searchButton = { focus: () => {} };
    instance.searchTextUpdate('j');
    table.update();

    // Simulate changing the page and then hiding the search bar
    instance.changePage(1);
    instanceTableToolbar.hideSearch();
    table.update();

    const page = table.state().page;
    assert.strictEqual(page, 1);
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

  it('should sort provided column with defined data, in ascending order when calling toggleSortColum method for the first time', () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />).dive();
    const instance = shallowWrapper.instance();

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

  it('should sort provided column with undefined data as though it were an empty string, in ascending order when calling toggleSortColum method for the first time', () => {
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

  it('should sort provided column in descending order when calling toggleSortColum method twice', () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />).dive();
    const instance = shallowWrapper.instance();

    instance.toggleSortColumn(0);
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

  it('should sort provided column with custom column sort function (sort by name length) in descending order', () => {
    columns[0].options.sortCompare = order => ({ data: val1 }, { data: val2 }) =>
      (val1.length - val2.length) * (order === 'asc' ? -1 : 1);
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />).dive();
    const instance = shallowWrapper.instance();

    instance.toggleSortColumn(0);
    shallowWrapper.update();
    const state = shallowWrapper.state();

    const expectedResult = JSON.stringify([
      { data: ['Houston, James', 'Test Corp', renderCities('Dallas', { rowIndex: 0 }), 'TX', undefined], dataIndex: 3 },
      { data: ['Walsh, John', 'Test Corp', renderCities('Hartford', { rowIndex: 1 }), null, undefined], dataIndex: 1 },
      { data: ['James, Joe', 'Test Corp', renderCities('Yonkers', { rowIndex: 2 }), 'NY', undefined], dataIndex: 0 },
      { data: ['Herm, Bob', 'Test Corp', renderCities('Tampa', { rowIndex: 3 }), 'FL', undefined], dataIndex: 2 },
    ]);

    assert.deepEqual(JSON.stringify(state.displayData), expectedResult);

    columns[0].options.sortCompare = null;
  });

  it('should toggle provided column when calling toggleViewCol method', () => {
    const options = {
      onViewColumnsChange: spy(),
    };
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} options={options} />).dive();
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
        customBodyRender: renderName,
        viewColumns: true,
        sortCompare: null,
        sortThirdClickReset: false,
        sortDescFirst: false,
        customFilterListOptions: { render: renderCustomFilterList },
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
        sortCompare: null,
        sortThirdClickReset: false,
        sortDescFirst: false,
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
        customBodyRender: renderCities,
        viewColumns: true,
        sortCompare: null,
        sortThirdClickReset: false,
        sortDescFirst: false,
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
        customBodyRender: renderState,
        customHeadRender: renderHead,
        sortCompare: null,
        sortThirdClickReset: false,
        sortDescFirst: false,
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
        sortCompare: null,
        sortThirdClickReset: false,
        sortDescFirst: false,
      },
    ];

    assert.deepEqual(state.columns, expectedResult);
    assert.strictEqual(options.onViewColumnsChange.callCount, 1);
  });

  it('should update columns when calling updateColumns method', () => {
    const options = {
      onViewColumnsChange: spy(),
    };
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} options={options} />).dive();
    const instance = shallowWrapper.instance();

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
        customBodyRender: renderName,
        viewColumns: true,
        customFilterListOptions: { render: renderCustomFilterList },
      },
      {
        name: 'Company',
        display: 'false',
        empty: false,
        print: true,
        sort: true,
        filter: true,
        label: 'Company',
        download: true,
        searchable: true,
        viewColumns: true,
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
        customBodyRender: renderState,
        customHeadRender: renderHead,
      },
      {
        name: 'Empty',
        display: 'false',
        empty: true,
        print: true,
        sort: true,
        filter: true,
        filterType: 'checkbox',
        label: 'Empty',
        download: true,
        searchable: true,
        viewColumns: true,
      },
    ];

    instance.updateColumns(expectedResult);
    shallowWrapper.update();
    const state = shallowWrapper.state();

    assert.deepEqual(state.columns, expectedResult);
    assert.strictEqual(options.onViewColumnsChange.callCount, 1);
  });

  it('should get displayable data when calling getDisplayData method', () => {
    const wrapper = shallow(<MUIDataTable columns={columns} data={data} />);
    const shallowWrapper = wrapper.dive();
    const instance = shallowWrapper.instance();
    const state = shallowWrapper.state();

    const actualResult = instance.getDisplayData(columns, tableData, state.filterList, '', null, wrapper.props());
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
    const mountWrapper = mount(
      shallow(
        <MUIDataTable
          columns={columns}
          data={data}
          options={{ rowsPerPageOptions: [2, 4, 10, 15, 100], rowsPerPage: 2 }}
        />,
      ).get(0),
    );
    const instance = mountWrapper.instance();

    instance.changePage(1);
    let state = mountWrapper.state();
    assert.equal(state.page, 1);

    instance.changeRowsPerPage(4);
    state = mountWrapper.state();
    assert.equal(state.page, 0);
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

    const expectedResult = [
      { index: 0, dataIndex: 0 },
      { index: 1, dataIndex: 1 },
    ];
    const state = shallowWrapper.state();
    assert.deepEqual(state.selectedRows.data, expectedResult);
  });

  it('should update selectedRows when calling selectRowUpdate method with type=custom', () => {
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} />).dive();
    const instance = shallowWrapper.instance();

    instance.selectRowUpdate('custom', [0, 3]);
    shallowWrapper.update();

    const state = shallowWrapper.state();
    const expectedResult = [
      { index: 0, dataIndex: 0 },
      { index: 3, dataIndex: 3 },
    ];

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

    const expectedResult = [
      { index: 0, dataIndex: 0 },
      { index: 1, dataIndex: 1 },
    ];
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
    const expectedResult = [
      { index: 0, dataIndex: 0 },
      { index: 3, dataIndex: 3 },
    ];

    assert.deepEqual(state.selectedRows.data, expectedResult);
  });

  it('should update selectedRows (with default type=multiple option) when using rowsSelected with no option specified', () => {
    const options = {
      rowsSelected: [0, 3],
    };
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} options={options} />).dive();
    const instance = shallowWrapper.instance();

    const state = shallowWrapper.state();
    const expectedResult = [
      { index: 0, dataIndex: 0 },
      { index: 3, dataIndex: 3 },
    ];

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
    const expectedResult = [
      { index: 0, dataIndex: 0 },
      { index: 3, dataIndex: 3 },
    ];

    assert.deepEqual(state.expandedRows.data, expectedResult);
  });

  it('should expand all rows when toggleAllExpandableRows is called', () => {
    const options = {
      expandableRows: true,
      rowsExpanded: [],
      renderExpandableRow: () => (
        <tr>
          <td>opened</td>
        </tr>
      ),
    };
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} options={options} />).dive();
    const instance = shallowWrapper.instance();

    instance.toggleAllExpandableRows();

    const state = shallowWrapper.state();

    const expectedResult = [
      { index: 0, dataIndex: 0 },
      { index: 1, dataIndex: 1 },
      { index: 2, dataIndex: 2 },
      { index: 3, dataIndex: 3 },
    ];

    assert.deepEqual(state.expandedRows.data, expectedResult);

    assert.equal(instance.areAllRowsExpanded(), true);

    // collapse
    instance.toggleAllExpandableRows();
    const state2 = shallowWrapper.state();
    assert.deepEqual(state2.expandedRows.data, []);
  });

  it('should call onColumnOrderChange when updateColumnOrder is called', () => {
    const options = {
      onColumnOrderChange: spy(),
    };
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} options={options} />).dive();
    const instance = shallowWrapper.instance();

    instance.updateColumnOrder();

    assert.deepEqual(options.onColumnOrderChange.callCount, 1);
  });

  it('should correctly call consoleWarnings', () => {
    const options = {
      consoleWarnings: spy(),
      responsive: 'scroll',
      selectableRows: true,
      onRowsSelect: () => {},
      onRowsExpand: () => {},
      fixedHeaderOptions: {},
      serverSideFilterList: [1],
      selectToolbarPlacement: 'topoftheworld',
      disableToolbarSelect: true,
    };
    let newCols = columns.slice();
    newCols[0] = Object.assign({}, newCols[0]);
    newCols[0].options = Object.assign({}, newCols[0].options);
    newCols[0].options.sortDirection = 'asc';
    newCols[0].options.filterOptions = [];
    newCols[0].options.customFilterListRender = () => {};

    const shallowWrapper = shallow(<MUIDataTable columns={newCols} data={data} options={options} />).dive();
    const instance = shallowWrapper.instance();

    assert.strictEqual(options.consoleWarnings.callCount, 11);

    let warnCallback = spy();
    let oldResponsiveOptions = [
      'scrollMaxHeight',
      'scrollFullHeight',
      'scrollFullHeightFullWidth',
      'stacked',
      'stackedFullWidth',
      'invalid_option',
    ];

    oldResponsiveOptions.forEach(responsive => {
      const options2 = {
        responsive,
        consoleWarnings: warnCallback,
      };
      const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} options={options2} />).dive();
      const instance = shallowWrapper.instance();
    });

    const options3 = {
      consoleWarnings: false,
    };
    const shallowWrapper3 = shallow(<MUIDataTable columns={columns} data={data} options={options3} />).dive();
    const instance3 = shallowWrapper3.instance();

    assert.strictEqual(warnCallback.callCount, 6);
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

  it('should call onRowExpansionChange when row is expanded or collapsed', () => {
    const options = {
      expandableRows: true,
      renderExpandableRow: () => (
        <tr>
          <td>foo</td>
        </tr>
      ),
      expandableRowsOnClick: true,
      onRowExpansionChange: spy(),
    };
    const mountWrapper = mount(<MUIDataTable columns={columns} data={data} options={options} tableId={tableId} />);

    mountWrapper
      .find(`#MUIDataTableBodyRow-${tableId}-2`)
      .first()
      .simulate('click');

    assert.strictEqual(options.onRowExpansionChange.callCount, 1);
    assert(options.onRowExpansionChange.calledWith([{ index: 2, dataIndex: 2 }], [{ index: 2, dataIndex: 2 }]));

    mountWrapper
      .find(`#MUIDataTableBodyRow-${tableId}-2`)
      .first()
      .simulate('click');

    assert.strictEqual(options.onRowExpansionChange.callCount, 2);
    assert(options.onRowExpansionChange.calledWith([{ index: 2, dataIndex: 2 }], []));
  });

  it('should call onRowSelectionChange when row is selected or unselected', () => {
    const options = {
      selectableRows: 'multiple',
      selectableRowsOnClick: true,
      onRowSelectionChange: spy(),
    };
    const mountWrapper = mount(<MUIDataTable columns={columns} data={data} options={options} tableId={tableId} />);

    mountWrapper
      .find(`#MUIDataTableBodyRow-${tableId}-2`)
      .first()
      .simulate('click');

    assert.strictEqual(options.onRowSelectionChange.callCount, 1);
    assert(options.onRowSelectionChange.calledWith([{ index: 2, dataIndex: 2 }], [{ index: 2, dataIndex: 2 }]));

    mountWrapper
      .find(`#MUIDataTableBodyRow-${tableId}-2`)
      .first()
      .simulate('click');

    assert.strictEqual(options.onRowSelectionChange.callCount, 2);
    assert(options.onRowSelectionChange.calledWith([{ index: 2, dataIndex: 2 }], []));
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
    const options = { selectableRows: 'multiple', onTableInit: spy() };
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} options={options} />).dive();
    const instance = shallowWrapper.instance();

    assert.strictEqual(options.onTableInit.callCount, 1);
  });

  it('should call onTableInit only 1 time when creating table and calling selectRowUpdate method with type=head', () => {
    const options = { selectableRows: 'multiple', onTableInit: spy() };
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} options={options} />).dive();
    const instance = shallowWrapper.instance();

    instance.selectRowUpdate('head', 0);
    shallowWrapper.update();

    assert.strictEqual(options.onTableInit.callCount, 1);
  });

  it('should call onTableChange when calling selectRowUpdate method with type=head', () => {
    const options = { selectableRows: 'multiple', onTableChange: spy() };
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
    const options = { selectableRows: 'multiple', onTableChange: spy() };

    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} options={options} />).dive();
    const instance = shallowWrapper.instance();

    instance.selectRowUpdate('cell', 0);
    shallowWrapper.update();

    const state = shallowWrapper.state();
    assert.deepEqual(state.selectedRows.data, [0]);
    assert.strictEqual(options.onTableChange.callCount, 1);
  });

  it('should call onTableChange when calling selectRowUpdate method with type=custom', () => {
    const options = { selectableRows: 'multiple', onTableChange: spy() };
    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} options={options} />).dive();
    const instance = shallowWrapper.instance();

    instance.selectRowUpdate('custom', [0, 3]);
    shallowWrapper.update();

    const state = shallowWrapper.state();
    const expectedResult = [
      { index: 0, dataIndex: 0 },
      { index: 3, dataIndex: 3 },
    ];

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

  it('should correctly build internal tableProps when setTableProps passed in options', () => {
    const options = {
      setTableProps: () => ({
        className: 'foo bar',
        title: 'baz',
      }),
    };

    const shallowWrapper = shallow(<MUIDataTable columns={columns} data={data} options={options} />);
    const instance = shallowWrapper.dive().instance();
    const expectedProps = {
      className: `${instance.props.classes.tableRoot} foo bar`,
      title: 'baz',
    };

    assert.deepEqual(instance.getTableProps(), expectedProps);
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
      responsive: 'standard',
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
    const data = [
      ['other-data-1', 'a'],
      ['other-data-2', 'b'],
      ['other-data-3', 'c'],
      ['other-data-4', 'd'],
    ];
    const options = {
      filter: true,
      filterType: 'dropdown',
      responsive: 'standard',
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

  it('should correctly filter data from filter popover menu', () => {
    let filteredData = [];
    const options = {
      filter: true,
      filterType: 'dropdown',
      onFilterChange: (column, filterList, type, index, displayData) => {
        filteredData = displayData;
      },
    };

    const fullWrapper = mount(<MUIDataTable columns={columns} data={data} options={options} />);

    fullWrapper
      .find('[data-testid="Filter Table-iconButton"]')
      .at(0)
      .simulate('click');

    fullWrapper
      .find('[data-testid="filtertextfield-Name"] input')
      .at(0)
      .simulate('change', { target: { value: 'James' } });

    fullWrapper.unmount();

    assert.strictEqual(filteredData.length, 2);
    assert.strictEqual(filteredData[0].data[0], 'James, Joe');
    assert.strictEqual(filteredData[1].data[0], 'Houston, James');
  });

  describe('should correctly run comparator function', () => {
    it('correctly compares two equal strings', () => {
      expect(getCollatorComparator()('testString', 'testString')).to.equal(0);
    });

    it('correctly compares two different strings', () => {
      expect(getCollatorComparator()('testStringA', 'testStringB')).to.equal(-1);
    });
  });

  it('should correctly execute customBodyRender methods based on filtering and data', () => {
    let filteredData = [];
    let customBodyRenderCb = spy();
    let customBodyRenderLiteCb = spy();
    let customBodyRenderNoFilterCb = spy();
    const options = {
      rowsPerPage: 5,
      rowsPerPageOptions: [5],
    };

    const data = [
      ['a', 'b'],
      ['a', 'b'],
      ['a', 'b'],
      ['a', 'b'],
      ['a', 'b'],

      ['a', 'b'],
      ['a', 'b'],
      ['a', 'b'],
      ['a', 'b'],
      ['a', 'b'],

      ['a', 'b'],
      ['a', 'b'],
      ['a', 'b'],
      ['a', 'b'],
      ['a', 'b'],
    ];

    const columns = [
      {
        name: 'firstName',
        label: 'First Name',
        options: {
          customBodyRender: () => {
            customBodyRenderCb();
            return '';
          },
        },
      },
      {
        name: 'lastName',
        label: 'Last Name',
        options: {
          customBodyRenderLite: () => {
            customBodyRenderLiteCb();
            return '';
          },
        },
      },
      {
        name: 'phone',
        label: 'Phone',
        options: {
          filter: false,
          customBodyRender: () => {
            customBodyRenderNoFilterCb();
            return '';
          },
        },
      },
    ];

    const fullWrapper = mount(<MUIDataTable columns={columns} data={data} options={options} />);
    fullWrapper.unmount();

    // lite only gets executed for the 5 entries shown
    assert.strictEqual(customBodyRenderLiteCb.callCount, 5);

    // regular gets executed 15 times for filtering, and 15 more times for display
    assert.strictEqual(customBodyRenderCb.callCount, 30);

    // regular with no filtering gets executed 15 times for display
    assert.strictEqual(customBodyRenderNoFilterCb.callCount, 15);
  });
});
