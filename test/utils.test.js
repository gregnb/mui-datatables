import { getPageValue, buildCSV, createCSVDownload, escapeDangerousCSVCharacters } from '../src/utils';
import { spy } from 'sinon';
import { assert } from 'chai';

describe('utils.js', () => {
  describe('escapeDangerousCSVCharacters', () => {
    it('properly escapes the first character in a string if it can be used for injection', () => {
      assert.strictEqual(escapeDangerousCSVCharacters('+SUM(1+1)'), "'+SUM(1+1)");
      assert.strictEqual(escapeDangerousCSVCharacters('-SUM(1+1)'), "'-SUM(1+1)");
      assert.strictEqual(escapeDangerousCSVCharacters('=SUM(1+1)'), "'=SUM(1+1)");
      assert.strictEqual(escapeDangerousCSVCharacters('@SUM(1+1)'), "'@SUM(1+1)");
      assert.equal(escapeDangerousCSVCharacters(123), 123);
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

  describe('buildCSV', () => {
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

    it('properly builds a csv when given a non-empty dataset', () => {
      const data = [{ data: ['anton', 'abraham'] }, { data: ['berta', 'buchel'] }];
      const csv = buildCSV(columns, data, options);

      assert.strictEqual(csv, '"firstname";"lastname"\r\n' + '"anton";"abraham"\r\n' + '"berta";"buchel"');
    });

    it('returns an empty csv with header when given an empty dataset', () => {
      const data = [];
      const csv = buildCSV(columns, data, options);

      assert.strictEqual(csv, '"firstname";"lastname"');
    });
  });

  describe('createCSVDownload', () => {
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
    const data = [{ data: ['anton', 'abraham'] }, { data: ['berta', 'buchel'] }];

    it('does not call download function if download callback returns `false`', () => {
      const options = {
        downloadOptions: {
          separator: ';',
        },
        onDownload: () => false,
      };
      const downloadCSV = spy();

      createCSVDownload(columns, data, options, downloadCSV);

      assert.strictEqual(downloadCSV.callCount, 0);
    });

    it('calls download function if download callback returns truthy', () => {
      const options = {
        downloadOptions: {
          separator: ';',
        },
        onDownload: () => true,
      };
      const downloadCSV = spy();

      createCSVDownload(columns, data, options, downloadCSV);

      assert.strictEqual(downloadCSV.callCount, 1);
    });
  });
});
