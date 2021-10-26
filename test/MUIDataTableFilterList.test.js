import Checkbox from '@mui/material/Checkbox';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { assert } from 'chai';
import { mount, shallow } from 'enzyme';
import React from 'react';
import { spy } from 'sinon';
import TableFilterList from '../src/components/TableFilterList';
import getTextLabels from '../src/textLabels';
import Chip from '@mui/material/Chip';

describe('<TableFilterList />', function() {
  let data;
  let columns;
  let filterData;

  beforeEach(() => {
    columns = [
      { name: 'name', label: 'Name', display: true, sort: true, filter: true },
      { name: 'company', label: 'Company', display: true, sort: true, filter: true },
      { name: 'city', label: 'City Label', display: true, sort: true, filter: true },
      { name: 'state', label: 'State', display: true, sort: true, filter: true },
    ];

    data = [
      ['Joe James', 'Test Corp', 'Yonkers', 'NY'],
      ['John Walsh', 'Test Corp', 'Hartford', 'CT'],
      ['Bob Herm', 'Test Corp', 'Tampa', 'FL'],
      ['James Houston', 'Test Corp', 'Dallas', 'TX'],
    ];

    filterData = [
      ['Joe James', 'John Walsh', 'Bob Herm', 'James Houston'],
      ['Test Corp'],
      ['Yonkers', 'Hartford', 'Tampa', 'Dallas'],
      ['NY', 'CT', 'FL', 'TX'],
    ];
  });

  it('should render a filter chip for a filter', () => {
    const options = { textLabels: getTextLabels() };
    const filterList = [['Joe James'], [], [], []];
    const filterUpdate = spy();
    const columnNames = columns.map(column => ({
      name: column.name,
      filterType: column.filterType || options.filterType,
    }));
    const wrapper = mount(
      <TableFilterList
        options={options}
        filterListRenderers={columns.map(c => {
          if (c.customFilterListOptions && c.customFilterListOptions.render) return c.customFilterListOptions.render;
          if (c.customFilterListRender) return c.customFilterListRender;
          return f => f;
        })}
        customFilterListUpdate={columns.map(c => {
          return c.customFilterListOptions && c.customFilterListOptions.update
            ? c.customFilterListOptions.update
            : null;
        })}
        filterList={filterList}
        filterUpdate={filterUpdate}
        columnNames={columnNames}
      />,
    );

    let numChips = wrapper.find(Chip).length;

    assert.strictEqual(numChips, 1);

    wrapper.unmount();
  });

  it('should place a class onto the filter chip', () => {
    const options = {
      textLabels: getTextLabels(),
      setFilterChipProps: (a, b, c) => {
        return {
          className: 'testClass123',
        };
      },
    };
    const filterList = [['Joe James'], [], [], []];
    const filterUpdate = spy();
    const columnNames = columns.map(column => ({
      name: column.name,
      filterType: column.filterType || options.filterType,
    }));
    const wrapper = mount(
      <TableFilterList
        options={options}
        filterListRenderers={columns.map(c => {
          if (c.customFilterListOptions && c.customFilterListOptions.render) return c.customFilterListOptions.render;
          if (c.customFilterListRender) return c.customFilterListRender;
          return f => f;
        })}
        customFilterListUpdate={columns.map(c => {
          return c.customFilterListOptions && c.customFilterListOptions.update
            ? c.customFilterListOptions.update
            : null;
        })}
        filterList={filterList}
        filterUpdate={filterUpdate}
        columnNames={columnNames}
      />,
    );

    let numChips = wrapper.find('.testClass123').hostNodes().length;
    assert.strictEqual(numChips, 1);
    wrapper.unmount();
  });

  it('should remove a filter chip and call onFilterChipClose when its X icon is clicked', () => {
    const options = {
      textLabels: getTextLabels(),
      onFilterChipClose: spy(),
    };
    const filterList = [['Joe James'], [], [], []];
    const filterUpdateCall = spy();
    const filterUpdate = (index, filterValue, columnName, filterType, tmp, next) => {
      filterUpdateCall();
      next();
    };
    const columnNames = columns.map(column => ({
      name: column.name,
      filterType: column.filterType || options.filterType,
    }));
    const wrapper = mount(
      <TableFilterList
        options={options}
        filterListRenderers={columns.map(c => {
          if (c.customFilterListOptions && c.customFilterListOptions.render) return c.customFilterListOptions.render;
          if (c.customFilterListRender) return c.customFilterListRender;
          return f => f;
        })}
        customFilterListUpdate={columns.map(c => {
          return c.customFilterListOptions && c.customFilterListOptions.update
            ? c.customFilterListOptions.update
            : null;
        })}
        filterList={filterList}
        filterUpdate={filterUpdate}
        columnNames={columnNames}
      />,
    );

    wrapper
      .find('.MuiChip-deleteIcon')
      .at(0)
      .simulate('click');

    wrapper.unmount();

    assert.strictEqual(filterUpdateCall.callCount, 1); // ensures the call to update the filters was made
    assert.strictEqual(options.onFilterChipClose.callCount, 1); // ensures the call to onFilterChipClose occurred
  });

  it('should correctly call customFilterListOptions.render and customFilterListOptions.update', () => {
    const renderCall = spy();
    const updateCall = spy();
    const columnsWithCustomFilterListOptions = [
      {
        name: 'name',
        label: 'Name',
        display: true,
        sort: true,
        filter: true,
        // buildColumns in MUIDataTables spreads options over the column object, so no need to nest this within options
        filterType: 'custom',
        customFilterListOptions: {
          render: () => {
            renderCall();
            return 'label!';
          },
          update: () => {
            updateCall();
            return [];
          },
        },
      },
      { name: 'company', label: 'Company', display: true, sort: true, filter: true, sortDirection: 'desc' },
      { name: 'city', label: 'City Label', display: true, sort: true, filter: true, sortDirection: 'desc' },
      { name: 'state', label: 'State', display: true, sort: true, filter: true, sortDirection: 'desc' },
    ];

    const options = {
      textLabels: getTextLabels(),
      onFilterChipClose: spy(),
    };
    const filterList = [['Joe James'], [], [], []];
    const filterUpdateCall = spy();
    const filterUpdate = (index, filterValue, columnName, filterType, customUpdate, next) => {
      if (customUpdate) customUpdate();
      filterUpdateCall();
      next();
    };
    const columnNames = columnsWithCustomFilterListOptions.map(column => ({
      name: column.name,
      filterType: column.filterType || options.filterType,
    }));

    const wrapper = mount(
      <TableFilterList
        options={options}
        filterListRenderers={columnsWithCustomFilterListOptions.map(c => {
          if (c.customFilterListOptions && c.customFilterListOptions.render) return c.customFilterListOptions.render;
          if (c.customFilterListRender) return c.customFilterListRender;
          return f => f;
        })}
        customFilterListUpdate={columnsWithCustomFilterListOptions.map(c => {
          return c.customFilterListOptions && c.customFilterListOptions.update
            ? c.customFilterListOptions.update
            : null;
        })}
        filterList={filterList}
        filterUpdate={filterUpdate}
        columnNames={columnNames}
      />,
    );

    assert.strictEqual(renderCall.callCount, 1);
    assert.strictEqual(updateCall.callCount, 0);

    wrapper
      .find('.MuiChip-deleteIcon')
      .at(0)
      .simulate('click');

    wrapper.unmount();

    assert.strictEqual(renderCall.callCount, 1);
    assert.strictEqual(updateCall.callCount, 1);
  });
});
