import React from 'react';
import { spy, stub } from 'sinon';
import { mount, shallow } from 'enzyme';
import { assert, expect, should } from 'chai';
import Checkbox from '@material-ui/core/Checkbox';
import TableSelectCell from '../src/components/TableSelectCell';

describe('<TableSelectCell />', function() {
  before(() => {});

  it('should render table select cell', () => {
    const mountWrapper = mount(<TableSelectCell checked={false} selectableOn={true} />);

    const actualResult = mountWrapper.find(Checkbox);
    assert.strictEqual(actualResult.length, 1);
  });

  it('should render table select cell checked', () => {
    const mountWrapper = mount(<TableSelectCell checked={true} selectableOn={true} />);

    const actualResult = mountWrapper.find(Checkbox);
    assert.strictEqual(actualResult.props().checked, true);
  });

  it('should render table select cell unchecked', () => {
    const mountWrapper = mount(<TableSelectCell checked={false} selectableOn={true} />);

    const actualResult = mountWrapper.find(Checkbox);
    assert.strictEqual(actualResult.props().checked, false);
  });

  // it("should trigger onColumnUpdate prop callback when calling method handleColChange", () => {
  //   const options = {};
  //   const onColumnUpdate = spy();

  //   const shallowWrapper = shallow(
  //     <MUIDataTableViewCol
  //       columns={columns}
  //       onColumnUpdate={onColumnUpdate}
  //       viewColStyles={defaultViewColStyles}
  //       options={options}
  //     />,
  //   ).dive();

  //   const instance = shallowWrapper.instance();

  //   instance.handleColChange(0);
  //   assert.strictEqual(onColumnUpdate.callCount, 1);
  // });
});
