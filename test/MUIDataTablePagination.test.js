import React from 'react';
import { spy } from 'sinon';
import { mount, shallow } from 'enzyme';
import { assert } from 'chai';
import MuiTablePagination from '@mui/material/TablePagination';
import getTextLabels from '../src/textLabels';
import TablePagination from '../src/components/TablePagination';

describe('<TablePagination />', function() {
  let options;

  before(() => {
    options = {
      rowsPerPageOptions: [5, 10, 15],
      textLabels: getTextLabels(),
    };
  });

  it('should render a table footer with pagination', () => {
    const mountWrapper = mount(<TablePagination options={options} count={100} page={1} rowsPerPage={10} />);

    const actualResult = mountWrapper.find(MuiTablePagination);
    assert.strictEqual(actualResult.length, 1);
  });

  it('should trigger changePage prop callback when page is changed', () => {
    const changePage = spy();
    const wrapper = mount(
      <TablePagination options={options} count={100} page={1} rowsPerPage={10} changePage={changePage} />,
    );

    wrapper
      .find('#pagination-next')
      .at(0)
      .simulate('click');
    wrapper.unmount();

    assert.strictEqual(changePage.callCount, 1);
  });

  it('should correctly change page to be in bounds if out of bounds page was set', () => {
    // Set a page that is too high for the count and rowsPerPage
    const mountWrapper = mount(<TablePagination options={options} count={5} page={1} rowsPerPage={10} />);
    const actualResult = mountWrapper.find(MuiTablePagination).props().page;

    // material-ui v3 does some internal calculations to protect against out of bounds pages, but material v4 does not
    assert.strictEqual(actualResult, 0);
  });
});
