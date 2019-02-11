import React from 'react';
import { spy, stub } from 'sinon';
import { mount, shallow } from 'enzyme';
import { assert, expect, should } from 'chai';
import Checkbox from '@material-ui/core/Checkbox';
import TableViewCol from '../src/components/TableViewCol';
import textLabels from '../src/textLabels';
import { FormControlLabel } from '@material-ui/core';

describe('<TableViewCol />', function() {
  let columns;
  let options;

  before(() => {
    columns = [
      { name: 'a', label: 'A' },
      { name: 'b', label: 'B' },
      { name: 'c', label: 'C' },
      { name: 'd', label: 'D' },
    ];
    options = {
      textLabels,
    };
  });

  it('should render view columns', () => {
    const mountWrapper = mount(<TableViewCol columns={columns} options={options} />);

    const actualResult = mountWrapper.find(Checkbox);
    assert.strictEqual(actualResult.length, 4);
  });

  it('should labels as view column names when present', () => {
    const mountWrapper = mount(<TableViewCol columns={columns} options={options} />);
    const labels = mountWrapper.find(FormControlLabel).map(n => n.text());
    assert.deepEqual(labels, ['A', 'B', 'C', 'D']);
  });

  it('should trigger onColumnUpdate prop callback when calling method handleColChange', () => {
    const onColumnUpdate = spy();

    const shallowWrapper = shallow(
      <TableViewCol columns={columns} onColumnUpdate={onColumnUpdate} options={options} />,
    ).dive();

    const instance = shallowWrapper.instance();

    instance.handleColChange(0);
    assert.strictEqual(onColumnUpdate.callCount, 1);
  });
});
