import { getPageValue } from '../src/utils';
import { assert } from 'chai';

describe('utils.js', () => {
  describe('getPageValue', () => {
    it('returns the highest in bounds page value when page is out of bounds and count is greater than rowsPerPage', () => {
      const count = 30;
      const rowsPerPage = 10;
      const page = 5;

      const actualResult = getPageValue(count, rowsPerPage, page);
      assert.strictEqual(actualResult, 2);
    });

    it('returns the highest in bounds page value when page is in bounds and count is greater than rowsPerPage', () => {
      const count = 30;
      const rowsPerPage = 10;
      const page = 1;

      const actualResult = getPageValue(count, rowsPerPage, page);
      assert.strictEqual(actualResult, 1);
    });

    it('returns the highest in bounds page value when page is out of bounds and count is less than rowsPerPage', () => {
      const count = 3;
      const rowsPerPage = 10;
      const page = 1;

      const actualResult = getPageValue(count, rowsPerPage, page);
      assert.strictEqual(actualResult, 0);
    });

    it('returns the highest in bounds page value when page is in bounds and count is less than rowsPerPage', () => {
      const count = 3;
      const rowsPerPage = 10;
      const page = 0;

      const actualResult = getPageValue(count, rowsPerPage, page);
      assert.strictEqual(actualResult, 0);
    });

    it('returns the highest in bounds page value when page is out of bounds and count is equal to rowsPerPage', () => {
      const count = 10;
      const rowsPerPage = 10;
      const page = 1;

      const actualResult = getPageValue(count, rowsPerPage, page);
      assert.strictEqual(actualResult, 0);
    });

    it('returns the highest in bounds page value when page is in bounds and count is equal to rowsPerPage', () => {
      const count = 10;
      const rowsPerPage = 10;
      const page = 0;

      const actualResult = getPageValue(count, rowsPerPage, page);
      assert.strictEqual(actualResult, 0);
    });
  });
});
