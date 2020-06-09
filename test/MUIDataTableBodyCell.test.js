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
      ['Bob Herm', 'Test Corp X', 'Tampa', 'FL'],
      ['James Houston', 'Test Corp', 'Dallas', 'TX'],
    ];
  });

  it('should execute "onCellClick" prop when clicked if provided', () => {
    var clickCount = 0;
    var colIndex, rowIndex, colData;
    const options = {
      onCellClick: (val, colMeta) => {
        clickCount++;
        colIndex = colMeta.colIndex;
        rowIndex = colMeta.rowIndex;
        colData = val;
      },
    };

    const fullWrapper = mount(<MUIDataTable columns={columns} data={data} options={options} />);

    fullWrapper
      .find('[data-testid="MuiDataTableBodyCell-0-0"]')
      .at(0)
      .simulate('click');
    assert.strictEqual(clickCount, 1);
    assert.strictEqual(colIndex, 0);
    assert.strictEqual(rowIndex, 0);
    assert.strictEqual(colData, 'Joe James');

    fullWrapper
      .find('[data-testid="MuiDataTableBodyCell-2-3"]')
      .at(0)
      .simulate('click');
    assert.strictEqual(clickCount, 2);
    assert.strictEqual(colIndex, 2);
    assert.strictEqual(rowIndex, 3);
    assert.strictEqual(colData, 'Dallas');

    fullWrapper
      .find('[data-testid="MuiDataTableBodyCell-1-2"]')
      .at(0)
      .simulate('click');
    assert.strictEqual(clickCount, 3);
    assert.strictEqual(colIndex, 1);
    assert.strictEqual(rowIndex, 2);
    assert.strictEqual(colData, 'Test Corp X');
  });
});
