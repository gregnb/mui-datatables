import React from 'react';
import { mount, shallow } from 'enzyme';
import { assert } from 'chai';
import MUIDataTable from '../src/MUIDataTable';
import Chip from '@mui/material/Chip';
import TableFilterList from '../src/components/TableFilterList';

const CustomChip = props => {
  return <Chip variant="outlined" color="secondary" label={props.label} />;
};

const CustomFilterList = props => {
  return <TableFilterList {...props} ItemComponent={CustomChip} />;
};

describe('<MUIDataTable /> with custom components', function() {
  let data;
  let columns;

  before(() => {
    columns = [
      { name: 'Name' },
      {
        name: 'Company',
        options: {
          filter: true,
          filterType: 'custom',
          filterList: ['Test Corp'],
        },
      },
      { name: 'City', label: 'City Label' },
      { name: 'State' },
      { name: 'Empty', options: { empty: true, filterType: 'checkbox' } },
    ];
    data = [
      ['Joe James', 'Test Corp', 'Yonkers', 'NY'],
      ['John Walsh', 'Test Corp', 'Hartford', null],
      ['Bob Herm', 'Test Corp', 'Tampa', 'FL'],
      ['James Houston', 'Test Corp', 'Dallas', 'TX'],
    ];
  });

  it('should render a table with custom Chip in TableFilterList', () => {
    const wrapper = mount(
      <MUIDataTable
        columns={columns}
        data={data}
        components={{
          TableFilterList: CustomFilterList,
        }}
      />,
    );
    const customFilterList = wrapper.find(CustomFilterList);
    assert.lengthOf(customFilterList, 1);
    const customChip = customFilterList.find(CustomChip);
    assert.lengthOf(customChip, 1);
  });
});
