import React from 'react';
import ReactDOM from 'react-dom';
import MUIDataTable from '../../src/';

class Example extends React.Component {
  render() {
    const columns = [
      { label: 'Name', name: 'Name', options: { sortDirection: 'none' } },
      { label: 'Title', name: 'Title', options: { sortDirection: 'none' } },
      { label: 'Location', name: 'Location', options: { sortDirection: 'none' } },
    ];

    const data = [
      ['Gabby George', 'Business Analyst', 'Minneapolis'],
      ['Aiden Lloyd', 'Business Consultant', 'Dallas'],
      ['Jaden Collins', 'Attorney', 'Santa Ana'],
      ['Franky Rees', 'Business Analyst', 'St. Petersburg'],
      ['Aaren Rose', null, 'Toledo'],
    ];

    const options = {
      filter: true,
      filterType: 'dropdown',
      responsive: 'scrollFullHeight',
      sortOrder: {},
      onColumnSortChange: (column, direction) => {
        console.log('oncolumnsortchange from options', column, direction);
      },
    };

    return <MUIDataTable title={'ACME Employee list'} data={data} columns={columns} options={options} />;
  }
}

export default Example;
