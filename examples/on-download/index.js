import React from 'react';
import ReactDOM from 'react-dom';
import MUIDataTable from '../../src';

class Example extends React.Component {
  render() {
    const columns = [
      {
        name: 'Name',
        options: {
          filter: true,
          display: 'excluded',
        },
      },
      {
        label: 'Modified Title Label',
        name: 'Title',
        options: {
          filter: true,
        },
      },
      {
        name: 'Location',
        options: {
          print: false,
          filter: false,
        },
      },
      {
        name: 'Age',
        options: {
          filter: true,
          print: false,
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
      ['Gabby George', 'Business Analyst', 'Minneapolis', 30, '$100,000'],
      ['Aiden Lloyd', 'Business Consultant', 'Dallas', 55, '$200,000'],
      ['Jaden Collins', 'Attorney', 'Santa Ana', 27, '$500,000'],
      ['Franky Rees', 'Business Analyst', 'St. Petersburg', 22, '$50,000'],
      ['Aaren Rose', 'Business Consultant', 'Toledo', 28, '$75,000'],
      ['Blake Duncan', 'Business Management Analyst', 'San Diego', 65, '$94,000'],
      ['Frankie Parry', 'Agency Legal Counsel', 'Jacksonville', 71, '$210,000'],
      ['Lane Wilson', 'Commercial Specialist', 'Omaha', 19, '$65,000'],
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

    // Data for building a custom head and body with the onDownload option
    const headerNames = [
      {
        name: 'Given name',
        download: true,
      },
      {
        name: 'Role',
        download: true,
      },
      {
        name: 'City',
        download: true,
      },
      {
        name: 'Years',
        download: true,
      },
      {
        name: 'Dough',
        download: true,
      },
    ];
    const footerNames = ['Full Name', 'Job', 'Whereabouts', 'Age', 'Allowance'];

    const options = {
      filter: true,
      filterType: 'dropdown',
      responsive: 'scrollMaxHeight',
      onDownload: (buildHead, buildBody, columns, data) =>
        buildHead(headerNames) +
        buildBody(
          data.concat({
            index: data.length,
            data: footerNames,
          }),
        ),
    };

    return <MUIDataTable title={'ACME Employee list'} data={data} columns={columns} options={options} />;
  }
}

export default Example;
