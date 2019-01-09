import React from 'react';
import { spy, stub } from 'sinon';
import { mount, shallow } from 'enzyme';
import { assert, expect, should } from 'chai';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import MuiTablePagination from '@material-ui/core/TablePagination';
import textLabels from '../src/textLabels';
import TablePagination from '../src/components/TablePagination';

describe('<TablePagination />', function() {
  let options;

  before(() => {
    options = {
      rowsPerPageOptions: [5, 10, 15],
      textLabels,
    };
  });

  it('should render a table footer with pagination', () => {
    const mountWrapper = mount(<TablePagination options={options} count={100} page={1} rowsPerPage={10} />);

    const actualResult = mountWrapper.find(MuiTablePagination);
    assert.strictEqual(actualResult.length, 1);
  });

  it('should trigger changeRowsPerPage prop callback when calling method handleRowChange', () => {
    const changeRowsPerPage = spy();
    const shallowWrapper = shallow(
      <TablePagination options={options} count={100} page={1} rowsPerPage={10} changeRowsPerPage={changeRowsPerPage} />,
    ).dive();
    const instance = shallowWrapper.instance();

    instance.handleRowChange({ target: { value: '' } });
    assert.strictEqual(changeRowsPerPage.callCount, 1);
  });

  it('should trigger changePage prop callback when calling method handlePageChange', () => {
    const changePage = spy();
    const shallowWrapper = shallow(
      <TablePagination options={options} count={100} page={1} rowsPerPage={10} changePage={changePage} />,
    ).dive();
    const instance = shallowWrapper.instance();

    instance.handlePageChange(null, 1);
    assert.strictEqual(changePage.callCount, 1);
  });
});
