import { Button, CircularProgress } from '@material-ui/core';
import React from 'react';
import ReactDOM from 'react-dom';
import MUIDataTable from '../../src';

class Example extends React.Component {
  state = {
    filters: [[], [], [], [], []],
    isLoading: false,
    data: [
      ['Gabby George', 'Business Analyst', 'Minneapolis', 30, '$100,000'],
      ['Aiden Lloyd', 'Business Consultant', 'Dallas', 55, '$200,000'],
      ['Jaden Collins', 'Attorney', 'Santa Ana', 27, '$500,000'],
      ['Franky Rees', 'Business Analyst', 'St. Petersburg', 22, '$50,000'],
      ['Aaren Rose', 'Business Consultant', 'Toledo', 28, '$75,000'],
      ['Blake Duncan', 'Business Management Analyst', 'San Diego', 65, '$94,000'],
      ['Frankie Parry', 'Agency Legal Counsel', 'Jacksonville', 71, '$210,000'],
      ['Lane Wilson', 'Commercial Specialist', 'Chicago', 19, '$65,000'],
      ['Robin Duncan', 'Business Analyst', 'Los Angeles', 20, '$77,000'],
      ['Mel Brooks', 'Business Consultant', 'Oklahoma City', 37, '$135,000'],
      ['Harper White', 'Attorney', 'Pittsburgh', 52, '$420,000'],
      ['Kris Humphrey', 'Agency Legal Counsel', 'Laredo', 30, '$150,000'],
      ['Frankie Long', 'Industrial Analyst', 'Austin', 31, '$170,000'],
      ['Brynn Robbins', 'Business Analyst', 'Norfolk', 22, '$90,000'],
      ['Justice Mann', 'Business Consultant', 'Chicago', 24, '$133,000'],
      ['Addison Navarro', 'Business Management Analyst', 'New York', 50, '$295,000'],
      ['Jesse Welch', 'Agency Legal Counsel', 'Seattle', 28, '$200,000'],
      ['Eli Mejia', 'Commercial Specialist', 'Long Beach', 65, '$400,000'],
      ['Gene Leblanc', 'Industrial Analyst', 'Hartford', 34, '$110,000'],
      ['Danny Leon', 'Computer Scientist', 'Newark', 60, '$220,000'],
      ['Lane Lee', 'Corporate Counselor', 'Cincinnati', 52, '$180,000'],
      ['Jesse Hall', 'Business Analyst', 'Baltimore', 44, '$99,000'],
      ['Danni Hudson', 'Agency Legal Counsel', 'Tampa', 37, '$90,000'],
      ['Terry Macdonald', 'Commercial Specialist', 'Miami', 39, '$140,000'],
      ['Justice Mccarthy', 'Attorney', 'Tucson', 26, '$330,000'],
      ['Silver Carey', 'Computer Scientist', 'Memphis', 47, '$250,000'],
      ['Franky Miles', 'Industrial Analyst', 'Buffalo', 49, '$190,000'],
      ['Glen Nixon', 'Corporate Counselor', 'Arlington', 44, '$80,000'],
      ['Gabby Strickland', 'Business Process Consultant', 'Scottsdale', 26, '$45,000'],
      ['Mason Ray', 'Computer Scientist', 'San Francisco', 39, '$142,000'],
    ]
  };

  // mock async function
  xhrRequest = (url, filterList) => {
    return new Promise(resolve => {
      window.setTimeout(
        () => {
          var data = [
            ['Gabby George', 'Business Analyst', 'Minneapolis', 30, '$100,000'],
            ['Aiden Lloyd', 'Business Consultant', 'Dallas', 55, '$200,000'],
            ['Jaden Collins', 'Attorney', 'Santa Ana', 27, '$500,000'],
            ['Franky Rees', 'Business Analyst', 'St. Petersburg', 22, '$50,000'],
            ['Aaren Rose', 'Business Consultant', 'Toledo', 28, '$75,000'],
            ['Blake Duncan', 'Business Management Analyst', 'San Diego', 65, '$94,000'],
            ['Frankie Parry', 'Agency Legal Counsel', 'Jacksonville', 71, '$210,000'],
            ['Lane Wilson', 'Commercial Specialist', 'Chicago', 19, '$65,000'],
            ['Robin Duncan', 'Business Analyst', 'Los Angeles', 20, '$77,000'],
            ['Mel Brooks', 'Business Consultant', 'Oklahoma City', 37, '$135,000'],
            ['Harper White', 'Attorney', 'Pittsburgh', 52, '$420,000'],
            ['Kris Humphrey', 'Agency Legal Counsel', 'Laredo', 30, '$150,000'],
            ['Frankie Long', 'Industrial Analyst', 'Austin', 31, '$170,000'],
            ['Brynn Robbins', 'Business Analyst', 'Norfolk', 22, '$90,000'],
            ['Justice Mann', 'Business Consultant', 'Chicago', 24, '$133,000'],
            ['Addison Navarro', 'Business Management Analyst', 'New York', 50, '$295,000'],
            ['Jesse Welch', 'Agency Legal Counsel', 'Seattle', 28, '$200,000'],
            ['Eli Mejia', 'Commercial Specialist', 'Long Beach', 65, '$400,000'],
            ['Gene Leblanc', 'Industrial Analyst', 'Hartford', 34, '$110,000'],
            ['Danny Leon', 'Computer Scientist', 'Newark', 60, '$220,000'],
            ['Lane Lee', 'Corporate Counselor', 'Cincinnati', 52, '$180,000'],
            ['Jesse Hall', 'Business Analyst', 'Baltimore', 44, '$99,000'],
            ['Danni Hudson', 'Agency Legal Counsel', 'Tampa', 37, '$90,000'],
            ['Terry Macdonald', 'Commercial Specialist', 'Miami', 39, '$140,000'],
            ['Justice Mccarthy', 'Attorney', 'Tucson', 26, '$330,000'],
            ['Silver Carey', 'Computer Scientist', 'Memphis', 47, '$250,000'],
            ['Franky Miles', 'Industrial Analyst', 'Buffalo', 49, '$190,000'],
            ['Glen Nixon', 'Corporate Counselor', 'Arlington', 44, '$80,000'],
            ['Gabby Strickland', 'Business Process Consultant', 'Scottsdale', 26, '$45,000'],
            ['Mason Ray', 'Computer Scientist', 'San Francisco', 39, '$142,000'],
          ];

          /*
            This code simulates filtering that would occur on the back-end
          */
          var filteredData = data.filter(row => {
            var ret = true;

            for (var ii = 0; ii <= 4; ii++) {
              if (filterList[ii].length) {
                ret = ret && filterList[ii].filter(ff => {
                  return row[ii] == ff;
                }).length > 0;
              }
            }
            return ret;
          });
          resolve({ data: filteredData });
        },
        2000
      );
    });
  }

  handleFilterSubmit = (applyFilters) => () => {
    /*
      applyFilters applies the selected filters to the table's internal filterList state.
      The return value is the new master filterList for the table.
    */
    var filterList = applyFilters();
    this.requestData(filterList);
  };

  requestData(filterList) {
    this.setState({ isLoading: true, filters: filterList });

    // fake async request
    this.xhrRequest(`/myApiServer?filters=${filterList}`, filterList).then(res => {
      this.setState({ isLoading: false, data: res.data });
    });
  }

  render() {
    const columns = [
      {
        name: 'Name',
        options: {
          filter: true,
          filterList: this.state.filters[0],
        },
      },
      {
        label: 'Title',
        name: 'Title',
        options: {
          filter: true,
          filterList: this.state.filters[1],
        },
      },
      {
        name: 'Location',
        options: {
          filter: true,
          filterList: this.state.filters[2],
        },
      },
      {
        name: 'Age',
        options: {
          filter: true,
          filterList: this.state.filters[3],
        },
      },
      {
        name: 'Salary',
        options: {
          filter: true,
          filterList: this.state.filters[4],
        },
      },
    ];

    const options = {
      filter: true,
      filterType: 'dropdown',
      responsive: 'scrollMaxHeight',
      serverSide: true,
      confirmFilters: true,
      onFilterDialogOpen: () => {
        console.log('filter dialog opened');
      },
      onFilterDialogClose: () => {
        console.log('filter dialog closed');
      },
      onFilterChange: (column, filterList, type) => {
        if (type === 'chip') {
          console.log('updating filters via chip');
          this.requestData(filterList);
        }
        if (column === null) {
          console.log('filters were reset');
          this.requestData(filterList);
        }
      },
      customFilterDialogFooter: (currentFilterList, applyFilters) => {
        return (
          <div style={{ marginTop: '40px' }}>
            <Button variant="contained" onClick={this.handleFilterSubmit(applyFilters)}>Apply Filters*</Button>
            <p><em>*(Simulates selecting "Chicago" from "Location")</em></p>
          </div>
        );
      }
    };

    return (
      <React.Fragment>
        {this.state.isLoading && (
          <div style={{ position: 'absolute', top: '50%', left: '50%' }}>
            <CircularProgress />
          </div>
        )}
        <MUIDataTable title={'ACME Employee list'} data={this.state.data} columns={columns} options={options} />
      </React.Fragment>
    );
  }
}

export default Example;
