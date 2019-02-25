import React from 'react';
import ReactDOM from 'react-dom';
import MUIDataTable from '../../src/';

const LOCALSTORAGEID = 'MuiDataTable-IState';

class Example extends React.Component {
  render() {
    const columns = [
      {
        name: 'Name',
        options: {
          filter: true,
          // filterList: ['Business Analyst'],
          filterOptions: ['a', 'b', 'c', 'Business Analyst'],
        },
      },
      {
        name: 'Title',
        options: {
          filter: true,
        },
      },
      {
        name: 'Location',
        options: {
          filter: false,
        },
      },
      {
        name: 'Age',
        options: {
          filter: true,
        },
      },
      {
        name: 'Salary',
        options: {
          filter: true,
          sort: false,
        },
      },
    ];
    const data = [
      ['Gabby George', 'Business Analyst', 'Minneapolis', 30, 100000],
      ['Business Analyst', 'Business Consultant', 'Dallas', 55, 200000],
      ['Jaden Collins', 'Attorney', 'Santa Ana', 27, 500000],
      ['Franky Rees', 'Business Analyst', 'St. Petersburg', 22, 50000],
      ['Aaren Rose', 'Business Consultant', 'Toledo', 28, 75000],
      ['Blake Duncan', 'Business Management Analyst', 'San Diego', 65, 94000],
      ['Frankie Parry', 'Agency Legal Counsel', 'Jacksonville', 71, 210000],
      ['Lane Wilson', 'Commercial Specialist', 'Omaha', 19, 65000],
      ['Robin Duncan', 'Business Analyst', 'Los Angeles', 20, 77000],
      ['Mel Brooks', 'Business Consultant', 'Oklahoma City', 37, 135000],
      ['Harper White', 'Attorney', 'Pittsburgh', 52, 420000],
      ['Kris Humphrey', 'Agency Legal Counsel', 'Laredo', 30, 150000],
      ['Frankie Long', 'Industrial Analyst', 'Austin', 31, 170000],
      ['Brynn Robbins', 'Business Analyst', 'Norfolk', 22, 90000],
      ['Justice Mann', 'Business Consultant', 'Chicago', 24, 133000],
      ['Addison Navarro', 'Business Management Analyst', 'New York', 50, 295000],
      ['Jesse Welch', 'Agency Legal Counsel', 'Seattle', 28, 200000],
      ['Eli Mejia', 'Commercial Specialist', 'Long Beach', 65, 400000],
      ['Gene Leblanc', 'Industrial Analyst', 'Hartford', 34, 110000],
      ['Danny Leon', 'Computer Scientist', 'Newark', 60, 220000],
      ['Lane Lee', 'Corporate Counselor', 'Cincinnati', 52, 180000],
      ['Jesse Hall', 'Business Analyst', 'Baltimore', 44, 99000],
      ['Danni Hudson', 'Agency Legal Counsel', 'Tampa', 37, 90000],
      ['Terry Macdonald', 'Commercial Specialist', 'Miami', 39, 140000],
      ['Justice Mccarthy', 'Attorney', 'Tucson', 26, 330000],
      ['Silver Carey', 'Computer Scientist', 'Memphis', 47, 250000],
      ['Franky Miles', 'Industrial Analyst', 'Buffalo', 49, 190000],
      ['Glen Nixon', 'Corporate Counselor', 'Arlington', 44, 80000],
      ['Gabby Strickland', 'Business Process Consultant', 'Scottsdale', 26, 45000],
      ['Mason Ray', 'Computer Scientist', 'San Francisco', 39, 142000],
      ['Jesse Welch', 'Agency Legal Counsel', 'Seattle', 28, 200000],
      ['Eli Mejia', 'Commercial Specialist', 'Long Beach', 65, 400000],
      ['Gene Leblanc', 'Industrial Analyst', 'Hartford', 34, 110000],
      ['Danny Leon', 'Computer Scientist', 'Newark', 60, 220000],
      ['Lane Lee', 'Corporate Counselor', 'Cincinnati', 52, 180000],
      ['Jesse Hall', 'Business Analyst', 'Baltimore', 44, 99000],
      ['Danni Hudson', 'Agency Legal Counsel', 'Tampa', 37, 90000],
      ['Terry Macdonald', 'Commercial Specialist', 'Miami', 39, 140000],
      ['Justice Mccarthy', 'Attorney', 'Tucson', 26, 330000],
      ['Silver Carey', 'Computer Scientist', 'Memphis', 47, 250000],
      ['Franky Miles', 'Industrial Analyst', 'Buffalo', 49, 190000],
      ['Glen Nixon', 'Corporate Counselor', 'Arlington', 44, 80000],
      ['Gabby Strickland', 'Business Process Consultant', 'Scottsdale', 26, 45000],
      ['Mason Ray', 'Computer Scientist', 'San Francisco', 39, 142000],
      ['Gabby Strickland', 'Business Process Consultant', 'Scottsdale', 26, 45000],
      ['Mason Ray', 'Computer Scientist', 'San Francisco', 39, 142000],
      ['Jesse Welch', 'Agency Legal Counsel', 'Seattle', 28, 200000],
      ['Eli Mejia', 'Commercial Specialist', 'Long Beach', 65, 400000],
      ['Gene Leblanc', 'Industrial Analyst', 'Hartford', 34, 110000],
      ['Danny Leon', 'Computer Scientist', 'Newark', 60, 220000],
      ['Lane Lee', 'Corporate Counselor', 'Cincinnati', 52, 180000],
      ['Jesse Hall', 'Business Analyst', 'Baltimore', 44, 99000],
      ['Danni Hudson', 'Agency Legal Counsel', 'Tampa', 37, 90000],
      ['Terry Macdonald', 'Commercial Specialist', 'Miami', 39, 140000],
      ['Justice Mccarthy', 'Attorney', 'Tucson', 26, 330000],
      ['Silver Carey', 'Computer Scientist', 'Memphis', 47, 250000],
      ['Franky Miles', 'Industrial Analyst', 'Buffalo', 49, 190000],
      ['Glen Nixon', 'Corporate Counselor', 'Arlington', 44, 80000],
      ['Gabby Strickland', 'Business Process Consultant', 'Scottsdale', 26, 45000],
      ['Mason Ray', 'Computer Scientist', 'San Francisco', 39, 142000],
      ['Gabby Strickland', 'Business Process Consultant', 'Scottsdale', 26, 45000],
      ['Mason Ray', 'Computer Scientist', 'San Francisco', 39, 142000],
      ['Jesse Welch', 'Agency Legal Counsel', 'Seattle', 28, 200000],
      ['Eli Mejia', 'Commercial Specialist', 'Long Beach', 65, 400000],
      ['Gene Leblanc', 'Industrial Analyst', 'Hartford', 34, 110000],
      ['Danny Leon', 'Computer Scientist', 'Newark', 60, 220000],
      ['Lane Lee', 'Corporate Counselor', 'Cincinnati', 52, 180000],
      ['Jesse Hall', 'Business Analyst', 'Baltimore', 44, 99000],
      ['Danni Hudson', 'Agency Legal Counsel', 'Tampa', 37, 90000],
      ['Terry Macdonald', 'Commercial Specialist', 'Miami', 39, 140000],
      ['Justice Mccarthy', 'Attorney', 'Tucson', 26, 330000],
      ['Silver Carey', 'Computer Scientist', 'Memphis', 47, 250000],
      ['Franky Miles', 'Industrial Analyst', 'Buffalo', 49, 190000],
      ['Glen Nixon', 'Corporate Counselor', 'Arlington', 44, 80000],
      ['Gabby Strickland', 'Business Process Consultant', 'Scottsdale', 26, 45000],
      ['NRDEV88', 'Computer Scientist', 'San Francisco', 39, 342000],
      ['NRDEV88', 'Computer Scientist', 'San Francisco', 39, 342000],
      ['NRDEV88', 'Computer Scientist', 'San Francisco', 39, 342000],
      ['NRDEV88', 'Computer Scientist', 'San Francisco', 39, 342000],
      ['NRDEV88', 'Computer Scientist', 'San Francisco', 39, 342000],
      ['NRDEV88', 'Computer Scientist', 'San Francisco', 39, 342000],
      ['NRDEV88', 'Computer Scientist', 'San Francisco', 39, 342000],
      ['NRDEV88', 'Computer Scientist', 'San Francisco', 39, 342000],
      ['NRDEV88', 'Computer Scientist', 'San Francisco', 39, 342000],
      ['NRDEV88', 'Computer Scientist', 'San Francisco', 39, 342000],
      ['NRDEV88', 'Computer Scientist', 'San Francisco', 39, 342000],
      ['NRDEV88', 'Computer Scientist', 'San Francisco', 39, 342000],
      ['NRDEV88', 'Computer Scientist', 'San Francisco', 39, 342000],
      ['NRDEV88', 'Computer Scientist', 'San Francisco', 39, 342000],
      ['NRDEV88', 'Computer Scientist', 'San Francisco', 39, 342000],
      ['NRDEV88', 'Computer Scientist', 'San Francisco', 39, 342000],
      ['NRDEV88', 'Computer Scientist', 'San Francisco', 39, 342000],
      ['NRDEV88', 'Computer Scientist', 'San Francisco', 39, 342000],
      ['NRDEV88', 'Computer Scientist', 'San Francisco', 39, 342000],
      ['NRDEV88', 'Computer Scientist', 'San Francisco', 39, 342000],
      ['NRDEV88', 'Computer Scientist', 'San Francisco', 39, 342000],
      ['NRDEV88', 'Computer Scientist', 'San Francisco', 39, 342000],
      ['NRDEV88', 'Computer Scientist', 'San Francisco', 39, 342000],
      ['NRDEV88', 'Computer Scientist', 'San Francisco', 39, 342000],
      ['NRDEV88', 'Computer Scientist', 'San Francisco', 39, 342000],
      ['NRDEV88', 'Computer Scientist', 'San Francisco', 39, 342000],
      ['NRDEV88', 'Computer Scientist', 'San Francisco', 39, 342000],
      ['NRDEV88', 'Computer Scientist', 'San Francisco', 39, 342000],
      ['NRDEV88', 'Computer Scientist', 'San Francisco', 39, 342000],
      ['NRDEV88', 'Computer Scientist', 'San Francisco', 39, 342000],
      ['NRDEV88', 'Computer Scientist', 'San Francisco', 39, 342000],
      ['NRDEV88', 'Computer Scientist', 'San Francisco', 39, 342000],
      ['NRDEV88', 'Computer Scientist', 'San Francisco', 39, 342000],
      ['NRDEV88', 'Computer Scientist', 'San Francisco', 39, 342000],
      ['NRDEV88', 'Computer Scientist', 'San Francisco', 39, 342000],
      ['NRDEV88', 'Computer Scientist', 'San Francisco', 39, 342000],
    ];

    function initialStateStore(tableState) {
      const store = {
        page: tableState.page,
        rowsPerPage: tableState.rowsPerPage,
        searchText: tableState.searchText,
        sort: {
          column: tableState.activeColumn,
          direction:
            tableState.activeColumn || tableState.activeColumn === 0
              ? tableState.columns[tableState.activeColumn].sortDirection
              : null,
        },
        filters: tableState.filterList,
        columnOptions: (() => {
          const result = [];

          tableState.columns.map((column, ix) => {
            if (column.display === 'false') {
              result.push({
                hidden: column.display === 'false',
              });
            } else {
              result.push({});
            }
          });

          return result;
        })(),
      };

      localStorage.setItem(LOCALSTORAGEID, JSON.stringify(store));
    }

    function initialStateRetrieve() {
      let store = localStorage.getItem(LOCALSTORAGEID);

      if (store) {
        store = JSON.parse(store);

        return store;
      }

      return {};
    }

    const options = {
      filter: true,
      selectableRows: true,
      filterType: 'dropdown',
      responsive: 'stacked',
      rowsPerPageOptions: [5, 10, 15, 20],
      onTableChange: function(action, tableState) {
        initialStateStore(tableState);
      },
    };

    const initialState = {
      page: 0,
      rowsPerPage: 10,
      ...initialStateRetrieve(),
    };

    return (
      <MUIDataTable
        title={'ACME Employee list'}
        data={data}
        columns={columns}
        options={options}
        initialState={initialState}
      />
    );
  }
}

ReactDOM.render(<Example />, document.getElementById('app-root'));
