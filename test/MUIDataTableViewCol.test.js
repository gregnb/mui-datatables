import React from 'react';
import { spy, stub } from 'sinon';
import { mount, shallow } from 'enzyme';
import { assert, expect, should } from 'chai';
import Checkbox from '@mui/material/Checkbox';
import TableViewCol from '../src/components/TableViewCol';
import getTextLabels from '../src/textLabels';
import { FormControlLabel } from '@mui/material';

describe('<TableViewCol />', function() {
  let columns;
  let options;

  before(() => {
    columns = [
      { name: 'a', label: 'A', display: 'true' },
      { name: 'b', label: 'B', display: 'true' },
      { name: 'c', label: 'C', display: 'true' },
      { name: 'd', label: 'D', display: 'true' },
    ];
    options = {
      textLabels: getTextLabels(),
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

    const wrapper = mount(<TableViewCol columns={columns} onColumnUpdate={onColumnUpdate} options={options} />);

    wrapper
      .find('input[type="checkbox"]')
      .at(0)
      .simulate('change', { target: { checked: false, value: false } });
    wrapper.unmount();

    assert.strictEqual(onColumnUpdate.callCount, 1);
  });
});
