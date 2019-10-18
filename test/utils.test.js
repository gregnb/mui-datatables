import { getPageValue } from '../src/utils';
import { assert } from 'chai';

describe('utils.js', () => {
  it('returns the highest in bounds page value when calculating page via getPageValue', () => {
    // Test when page is out of bounds and count is greater than rowsPerPage
    let count = 30;
    let rowsPerPage = 10;
    let page = 5;
    let actualResult = getPageValue(count, rowsPerPage, page);
    assert.strictEqual(actualResult, 2);

    // Test when page is in bounds and count is greater than rowsPerPage
    count = 30;
    rowsPerPage = 10;
    page = 1;
    actualResult = getPageValue(count, rowsPerPage, page);
    assert.strictEqual(actualResult, 1);

    // Test when page is out of bounds and count is less than rowsPerPage
    count = 3;
    rowsPerPage = 10;
    page = 1;
    actualResult = getPageValue(count, rowsPerPage, page);
    assert.strictEqual(actualResult, 0);

    // Test when page is in bounds and count is less than rowsPerPage
    count = 3;
    rowsPerPage = 10;
    page = 0;
    actualResult = getPageValue(count, rowsPerPage, page);
    assert.strictEqual(actualResult, 0);

    // Test when page is out of bounds and count is equal to rowsPerPage
    count = 10;
    rowsPerPage = 10;
    page = 1;
    actualResult = getPageValue(count, rowsPerPage, page);
    assert.strictEqual(actualResult, 0);

    // Test when page is in bounds and count is equal to rowsPerPage
    count = 10;
    rowsPerPage = 10;
    page = 0;
    actualResult = getPageValue(count, rowsPerPage, page);
    assert.strictEqual(actualResult, 0);
  });
});
