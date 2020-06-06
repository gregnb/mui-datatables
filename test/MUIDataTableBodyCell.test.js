import React from 'react';
import { spy, stub } from 'sinon';
import { mount, shallow } from 'enzyme';
import { assert, expect, should } from 'chai';
import MUIDataTable from '../src/MUIDataTable';
import TableBodyCell from '../src/components/TableBodyCell';

describe('<TableBodyCell />', function() {
  let data;
  let columns;

  before(() => {
    columns = [
      {
        name: 'Name',
      },
      'Company',
      { name: 'City', label: 'City Label', options: { filterType: 'textField' } },
      {
        name: 'State',
        options: { filterType: 'multiselect' },
      },
      { name: 'Empty', options: { empty: true, filterType: 'checkbox' } },
    ];
    data = [
      ['Joe James', 'Test Corp', 'Yonkers', 'NY'],
      ['John Walsh', 'Test Corp', 'Hartford', null],
      ['Bob Herm', 'Test Corp', 'Tampa', 'FL'],
      ['James Houston', 'Test Corp', 'Dallas', 'TX'],
    ];
  });

  it('should execute "onCellClick" prop when clicked if provided', () => {
    var clickCount = 0;
    const options = {
      onCellClick: () => {
        clickCount++;
      }
    };

    const fullWrapper = mount(<MUIDataTable columns={columns} data={data} options={options} />);

    fullWrapper
      .find('[data-testid="MuiDataTableBodyCell-0-0"]')
      .at(0)
      .simulate('click');
    assert.strictEqual(clickCount, 1);

  });

});
