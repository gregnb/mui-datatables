import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { assert } from 'chai';
import { mount, shallow } from 'enzyme';
import React from 'react';
import { spy } from 'sinon';
import TableFilterList from '../src/components/TableFilterList';
import getTextLabels from '../src/textLabels';
import Chip from '@material-ui/core/Chip';

describe('<TableFilterList />', function() {
  let data;
  let columns;
  let filterData;

  beforeEach(() => {
    columns = [
      { name: 'name', label: 'Name', display: true, sort: true, filter: true, sortDirection: 'desc' },
      { name: 'company', label: 'Company', display: true, sort: true, filter: true, sortDirection: 'desc' },
      { name: 'city', label: 'City Label', display: true, sort: true, filter: true, sortDirection: 'desc' },
      { name: 'state', label: 'State', display: true, sort: true, filter: true, sortDirection: 'desc' },
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
        console.log(a, b, c);
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

    assert.strictEqual(filterUpdateCall.callCount, 1); // ensures the call to update the filters was made
    assert.strictEqual(options.onFilterChipClose.callCount, 1); // ensures the call to onFilterChipClose occurred
  });
});
