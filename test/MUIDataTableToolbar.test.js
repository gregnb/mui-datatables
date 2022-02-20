import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/CloudDownload';
import FilterIcon from '@mui/icons-material/FilterList';
import PrintIcon from '@mui/icons-material/Print';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import { assert } from 'chai';
import { mount, shallow } from 'enzyme';
import React from 'react';
import { spy } from 'sinon';
import TableSearch from '../src/components/TableSearch';
import TableToolbar from '../src/components/TableToolbar';
import getTextLabels from '../src/textLabels';

describe('<TableToolbar />', function() {
  let data;
  let columns;
  let options;
  let setTableAction = () => {};

  before(() => {
    options = {
      print: true,
      download: true,
      search: true,
      filter: true,
      viewColumns: true,
      textLabels: getTextLabels(),
      downloadOptions: {
        separator: ',',
        filename: 'tableDownload.csv',
        filterOptions: {
          useDisplayedRowsOnly: true,
          useDisplayedColumnsOnly: true,
        },
      },
    };
    columns = ['First Name', 'Company', 'City', 'State'];
    data = [
      {
        data: ['Joe James', 'Test Corp', 'Yonkers', 'NY'],
        dataIndex: 0,
      },
      {
        data: ['John Walsh', 'Test Corp', 'Hartford', 'CT'],
        dataIndex: 1,
      },
      {
        data: ['Bob Herm', 'Test Corp', 'Tampa', 'FL'],
        dataIndex: 2,
      },
      {
        data: ['James Houston', 'Test Corp', 'Dallas', 'TX'],
        dataIndex: 3,
      },
    ];
  });

  it('should render a toolbar', () => {
    const mountWrapper = mount(
      <TableToolbar columns={columns} data={data} options={options} setTableAction={setTableAction} />,
    );
    const actualResult = mountWrapper.find(IconButton);
    assert.strictEqual(actualResult.length, 5);
  });

  it('should render a toolbar with custom title if title is not string', () => {
    const title = <h1>custom title</h1>;
    const mountWrapper = mount(
      <TableToolbar title={title} columns={columns} data={data} options={options} setTableAction={setTableAction} />,
    );
    const actualResult = mountWrapper.find('h1');
    assert.strictEqual(actualResult.length, 1);
  });

  it('should render a toolbar with search text initialized if option.searchText = some_text', () => {
    const newOptions = { ...options, search: true, searchText: 'searchText' };
    const mountWrapper = mount(
      <TableToolbar columns={columns} data={data} options={newOptions} setTableAction={setTableAction} />,
    );
    const actualResult = mountWrapper.find(TableSearch);
    assert.strictEqual(actualResult.length, 1);
    assert.strictEqual(actualResult.props().options.searchText, 'searchText');
  });

  it('should render a toolbar with search if option.searchOpen = true', () => {
    const newOptions = { ...options, searchOpen: true };
    const mountWrapper = mount(
      <TableToolbar columns={columns} data={data} options={newOptions} setTableAction={setTableAction} />,
    );
    const actualResult = mountWrapper.find(TableSearch);
    assert.strictEqual(actualResult.length, 1);
    assert.strictEqual(actualResult.props().options.searchText, undefined);
  });

  it('should render a toolbar with no search icon if option.search = false', () => {
    const newOptions = { ...options, search: false };
    const mountWrapper = mount(
      <TableToolbar columns={columns} data={data} options={newOptions} setTableAction={setTableAction} />,
    );
    const actualResult = mountWrapper.find(SearchIcon);
    assert.strictEqual(actualResult.length, 0);
  });

  it('should render a toolbar with search box and no search icon if option.searchAlwaysOpen = true', () => {
    const newOptions = { ...options, searchAlwaysOpen: true };
    const mountWrapper = mount(
      <TableToolbar columns={columns} data={data} options={newOptions} setTableAction={setTableAction} />,
    );

    // check that textfield is rendered
    const actualTextfieldResult = mountWrapper.find(TableSearch);
    assert.strictEqual(actualTextfieldResult.length, 1);
    assert.strictEqual(actualTextfieldResult.props().options.searchText, undefined);

    // check that close icon is not rendered
    const actualCloseIconResult = mountWrapper.find(CloseIcon());
    assert.strictEqual(actualCloseIconResult.length, 0);

    // check that search icon is rendered
    const actualSearchIconResult = mountWrapper.find(SearchIcon);
    assert.strictEqual(actualSearchIconResult.length, 0);
  });

  it('should render a toolbar with no download icon if option.download = false', () => {
    const newOptions = { ...options, download: false };
    const mountWrapper = mount(
      <TableToolbar columns={columns} data={data} options={newOptions} setTableAction={setTableAction} />,
    );
    const actualResult = mountWrapper.find(DownloadIcon);
    assert.strictEqual(actualResult.length, 0);
  });

  it('should render a toolbar with no print icon if option.print = false', () => {
    const newOptions = { ...options, print: false };
    const mountWrapper = mount(
      <TableToolbar columns={columns} data={data} options={newOptions} setTableAction={setTableAction} />,
    );
    const actualResult = mountWrapper.find(PrintIcon);
    assert.strictEqual(actualResult.length, 0);
  });

  it('should render a toolbar with no view columns icon if option.viewColumns = false', () => {
    const newOptions = { ...options, viewColumns: false };
    const mountWrapper = mount(
      <TableToolbar columns={columns} data={data} options={newOptions} setTableAction={setTableAction} />,
    );
    const actualResult = mountWrapper.find(ViewColumnIcon);
    assert.strictEqual(actualResult.length, 0);
  });

  it('should render a toolbar with no filter icon if option.filter = false', () => {
    const newOptions = { ...options, filter: false };
    const mountWrapper = mount(
      <TableToolbar columns={columns} data={data} options={newOptions} setTableAction={setTableAction} />,
    );
    const actualResult = mountWrapper.find(FilterIcon);
    assert.strictEqual(actualResult.length, 0);
  });

  it('should render a toolbar with custom search when option.customSearchRender is provided', () => {
    const CustomSearchRender = () => <h1>customSearchRender</h1>;
    const newOptions = { ...options, customSearchRender: CustomSearchRender };
    const shallowWrapper = shallow(
      <TableToolbar columns={columns} data={data} options={newOptions} setTableAction={setTableAction} />,
    ).dive();
    const instance = shallowWrapper.instance();
    instance.setActiveIcon('search');
    shallowWrapper.update();
    const actualResult = shallowWrapper.find('h1');
    assert.strictEqual(actualResult.length, 1);
  });

  it('should render a toolbar with a search clicking search icon', () => {
    const shallowWrapper = shallow(
      <TableToolbar columns={columns} data={data} options={options} setTableAction={setTableAction} />,
    ).dive();
    const instance = shallowWrapper.instance();

    instance.setActiveIcon('search');
    shallowWrapper.update();

    const actualResult = shallowWrapper.find(TableSearch);
    assert.strictEqual(actualResult.length, 1);
  });

  it('should hide search after clicking cancel icon', () => {
    const searchTextUpdate = () => {};
    const shallowWrapper = shallow(
      <TableToolbar
        searchClose={() => {}}
        searchTextUpdate={searchTextUpdate}
        columns={columns}
        data={data}
        options={options}
        setTableAction={setTableAction}
      />,
    ).dive();
    const instance = shallowWrapper.instance();

    instance.searchButton = {
      focus: () => {},
    };

    // display search
    instance.setActiveIcon('search');
    shallowWrapper.update();

    let actualResult = shallowWrapper.find(TableSearch);
    assert.strictEqual(actualResult.length, 1);

    // now hide it and test
    instance.hideSearch();
    shallowWrapper.update();

    actualResult = shallowWrapper.find(TableSearch);
    assert.strictEqual(actualResult.length, 0);
  });

  it('should hide search when search icon is clicked while search is open without content', () => {
    const searchTextUpdate = () => {};
    const shallowWrapper = shallow(
      <TableToolbar
        searchClose={() => {}}
        searchTextUpdate={searchTextUpdate}
        columns={columns}
        data={data}
        options={options}
        setTableAction={setTableAction}
      />,
    ).dive();
    const instance = shallowWrapper.instance();
    instance.searchButton = {
      focus: () => {},
    };

    // click search button to display search
    shallowWrapper.find('[data-testid="Search-iconButton"]').simulate('click');
    shallowWrapper.update();

    assert.strictEqual(shallowWrapper.state('iconActive'), 'search');
    let actualResult = shallowWrapper.find(TableSearch);
    assert.strictEqual(actualResult.length, 1);

    // now click search button again and test
    shallowWrapper.find('[data-testid="Search-iconButton"]').simulate('click');
    shallowWrapper.update();

    assert.strictEqual(shallowWrapper.state('iconActive'), null);
    actualResult = shallowWrapper.find(TableSearch);
    assert.strictEqual(actualResult.length, 0);
  });

  it('should not hide search when search icon is clicked while search is open with content', () => {
    const searchTextUpdate = () => {};
    const shallowWrapper = shallow(
      <TableToolbar
        searchClose={() => {}}
        searchTextUpdate={searchTextUpdate}
        columns={columns}
        data={data}
        options={options}
        setTableAction={setTableAction}
      />,
    ).dive();
    const instance = shallowWrapper.instance();
    instance.searchButton = {
      focus: () => {},
    };

    // click search button to display search
    shallowWrapper.find('[data-testid="Search-iconButton"]').simulate('click');
    shallowWrapper.update();

    assert.strictEqual(shallowWrapper.state('iconActive'), 'search');
    let actualResult = shallowWrapper.find(TableSearch);
    assert.strictEqual(actualResult.length, 1);

    // now set searchText and click search button again and test
    shallowWrapper.setState({ searchText: 'fakeSearchText' });
    shallowWrapper.find('[data-testid="Search-iconButton"]').simulate('click');
    shallowWrapper.update();

    assert.strictEqual(shallowWrapper.state('iconActive'), 'search');
    actualResult = shallowWrapper.find(TableSearch);
    assert.strictEqual(actualResult.length, 1);
  });

  it('should render a toolbar with a search when searchAlwaysOpen is set to true', () => {
    const newOptions = { ...options, searchAlwaysOpen: true };
    const shallowWrapper = shallow(
      <TableToolbar columns={columns} data={data} options={newOptions} setTableAction={setTableAction} />,
    ).dive();

    const actualResult = shallowWrapper.find(TableSearch);
    assert.strictEqual(actualResult.length, 1);
  });

  it('should not hide search when opening another dialog when searchAlwaysOpen is set to true', () => {
    const newOptions = { ...options, searchAlwaysOpen: true };
    const shallowWrapper = shallow(
      <TableToolbar columns={columns} data={data} options={newOptions} setTableAction={setTableAction} />,
    ).dive();

    const instance = shallowWrapper.instance();

    instance.setActiveIcon('filter');
    shallowWrapper.find('[data-testid="Filter Table-iconButton"]').simulate('click');
    shallowWrapper.update();

    let actualResult = shallowWrapper.find(TableSearch);
    assert.strictEqual(actualResult.length, 1);
  });

  it('should call onFilterDialogOpen when opening filters via toolbar', () => {
    const onFilterDialogOpen = spy();
    const newOptions = { ...options, onFilterDialogOpen };
    const shallowWrapper = shallow(
      <TableToolbar columns={columns} data={data} options={newOptions} setTableAction={setTableAction} />,
    ).dive();
    const instance = shallowWrapper.instance();

    instance.setActiveIcon('filter');
    shallowWrapper.update();

    assert.strictEqual(onFilterDialogOpen.callCount, 1);
  });

  it('should call onFilterDialogClose when closing filters dialog', () => {
    const onFilterDialogClose = spy();
    const newOptions = { ...options, onFilterDialogClose };
    const shallowWrapper = shallow(
      <TableToolbar columns={columns} data={data} options={newOptions} setTableAction={setTableAction} />,
    ).dive();
    const instance = shallowWrapper.instance();

    instance.setActiveIcon('filter');
    shallowWrapper.update();
    instance.setActiveIcon(undefined);
    shallowWrapper.update();

    assert.strictEqual(onFilterDialogClose.callCount, 1);
  });

  it('should set icon when calling method setActiveIcon', () => {
    const shallowWrapper = shallow(
      <TableToolbar columns={columns} data={data} options={options} setTableAction={setTableAction} />,
    ).dive();
    const instance = shallowWrapper.instance();

    instance.setActiveIcon('filter');
    shallowWrapper.update();

    const state = shallowWrapper.state();
    assert.strictEqual(state.iconActive, 'filter');
  });

  it('should render search icon as active if option.searchOpen = true', () => {
    const newOptions = { ...options, search: true, searchOpen: true };
    const shallowWrapper = shallow(
      <TableToolbar columns={columns} data={data} options={newOptions} setTableAction={setTableAction} />,
    ).dive();
    const actualResult = shallowWrapper.find('[data-testid="Search-iconButton"]');
    assert.strictEqual(actualResult.prop('classes').root.indexOf('MUIDataTableToolbar-iconActive-'), 0);
  });

  it('should render search icon as active if option.searchText = some_text', () => {
    const newOptions = { ...options, search: true, searchText: 'searchText' };
    const shallowWrapper = shallow(
      <TableToolbar columns={columns} data={data} options={newOptions} setTableAction={setTableAction} />,
    ).dive();
    const actualResult = shallowWrapper.find('[data-testid="Search-iconButton"]');
    assert.strictEqual(actualResult.prop('classes').root.indexOf('MUIDataTableToolbar-iconActive-'), 0);
  });

  it('should download CSV when calling method handleCSVDownload', () => {
    const shallowWrapper = shallow(
      <TableToolbar
        columns={columns}
        displayData={data}
        data={data}
        options={options}
        setTableAction={setTableAction}
      />,
    );
    const instance = shallowWrapper.dive().instance();

    const appendSpy = spy(document.body, 'appendChild');
    const removeSpy = spy(document.body, 'removeChild');
    instance.handleCSVDownload();

    assert.strictEqual(appendSpy.callCount, 1);
    assert.strictEqual(removeSpy.callCount, 1);
  });

  it('should trigger onDownload prop callback when calling method handleCSVDownload', () => {
    const onDownload = spy();

    const newOptions = { ...options, onDownload };

    const shallowWrapper = shallow(
      <TableToolbar
        columns={columns}
        displayData={data}
        data={data}
        options={newOptions}
        setTableAction={setTableAction}
      />,
    );

    const instance = shallowWrapper.dive().instance();

    instance.handleCSVDownload();

    assert.strictEqual(onDownload.callCount, 1);
  });
});
