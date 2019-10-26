import { assembleCSV, getPageValue } from '../src/utils';
import { expect, assert } from 'chai';

describe('utils.js', () => {
  describe('assembleCSV', () => {
    const options = {
      downloadOptions: {
        separator: ';',
      },
      onDownload: null,
    };

    const columns = [
      {
        name: 'firstname',
        download: true,
      },
      {
        name: 'lastname',
        download: true,
      },
    ];

    describe('when given two rows', () => {
      const dataSet = [['anton', 'abraham'], ['berta', 'buchel']].map(data => ({ data }));

      const csv = assembleCSV(columns, dataSet, options);

      it('renders a two-record csv', () => {
        expect(csv).to.equal('"firstname";"lastname"\r\n' + '"anton";"abraham"\r\n' + '"berta";"buchel"');
      });
    });

    describe('when given an empty dataset', () => {
      const columns = [
        {
          name: 'firstname',
          download: true,
        },
        {
          name: 'lastname',
          download: true,
        },
      ];

      const dataSet = [];

      const csv = assembleCSV(columns, dataSet, options);

      it('returns an empty csv with header', () => {
        expect(csv).to.equal('"firstname";"lastname"');
      });
    });


    describe("when switched off by returning `false` in `onDownload`", () => {
      const dataSet = [['anton', 'abraham'], ['berta', 'buchel']].map(data => ({ data }));

      const csv = assembleCSV(columns, dataSet, {
        downloadOptions: {
          separator: ";"
        },
        onDownload: () => false
      });

      it("returns null", () => {
        expect(csv).to.be.null;
      })
    });
  });

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