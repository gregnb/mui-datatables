import { assembleCSV } from '../src/utils';
import { expect } from 'chai';

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
  });
});
