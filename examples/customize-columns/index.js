import React from 'react';
import MUIDataTable from '../../src/';
import TranslateIcon from '@material-ui/icons/Translate';

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
        name: 'Language',
        options: {
          customHeadLabelRender: () => <TranslateIcon />,
        },
      },
      {
        label: 'Modified Title Label',
        name: 'Title',
        options: {
          filter: true,
          sortDirection: 'asc',
        },
      },
      {
        name: 'Location',
        options: {
          filter: false,
          customHeadRender: (columnMeta, updateDirection) => (
            <th key={columnMeta.index} onClick={() => updateDirection(columnMeta.index)} style={{ cursor: 'pointer' }}>
              {columnMeta.name}
            </th>
          ),
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
      ['Gabby George', 'En', 'Business Analyst', 'Minneapolis', 30, '$100,000'],
      ['Aiden Lloyd', 'En', 'Business Consultant', 'Dallas', 55, '$200,000'],
      ['Jaden Collins', 'En', 'Attorney', 'Santa Ana', 27, '$500,000'],
      ['Franky Rees', 'En', 'Business Analyst', 'St. Petersburg', 22, '$50,000'],
      ['Aaren Rose', 'En', 'Business Consultant', 'Toledo', 28, '$75,000'],
      ['Blake Duncan', 'En', 'Business Management Analyst', 'San Diego', 65, '$94,000'],
      ['Frankie Parry', 'En', 'Agency Legal Counsel', 'Jacksonville', 71, '$210,000'],
      ['Lane Wilson', 'En', 'Commercial Specialist', 'Omaha', 19, '$65,000'],
      ['Robin Duncan', 'En', 'Business Analyst', 'Los Angeles', 20, '$77,000'],
      ['Mel Brooks', 'En', 'Business Consultant', 'Oklahoma City', 37, '$135,000'],
      ['Harper White', 'En', 'Attorney', 'Pittsburgh', 52, '$420,000'],
      ['Kris Humphrey', 'Fr', 'Agency Legal Counsel', 'Laredo', 30, '$150,000'],
      ['Frankie Long', 'Fr', 'Industrial Analyst', 'Austin', 31, '$170,000'],
      ['Brynn Robbins', 'Ch', 'Business Analyst', 'Norfolk', 22, '$90,000'],
      ['Justice Mann', 'Fr', 'Business Consultant', 'Chicago', 24, '$133,000'],
      ['Addison Navarro', 'Ch', 'Business Management Analyst', 'New York', 50, '$295,000'],
      ['Jesse Welch', 'Ch', 'Agency Legal Counsel', 'Seattle', 28, '$200,000'],
      ['Eli Mejia', 'Ch', 'Commercial Specialist', 'Long Beach', 65, '$400,000'],
      ['Gene Leblanc', 'Fr', 'Industrial Analyst', 'Hartford', 34, '$110,000'],
      ['Danny Leon', 'Ch', 'Computer Scientist', 'Newark', 60, '$220,000'],
      ['Lane Lee', 'Fr', 'Corporate Counselor', 'Cincinnati', 52, '$180,000'],
      ['Jesse Hall', 'Ch', 'Business Analyst', 'Baltimore', 44, '$99,000'],
      ['Danni Hudson', 'Fr', 'Agency Legal Counsel', 'Tampa', 37, '$90,000'],
      ['Terry Macdonald', 'Ch', 'Commercial Specialist', 'Miami', 39, '$140,000'],
      ['Justice Mccarthy', 'Ch', 'Attorney', 'Tucson', 26, '$330,000'],
      ['Silver Carey', 'Ch', 'Computer Scientist', 'Memphis', 47, '$250,000'],
      ['Franky Miles', 'Ch', 'Industrial Analyst', 'Buffalo', 49, '$190,000'],
      ['Glen Nixon', 'Ch', 'Corporate Counselor', 'Arlington', 44, '$80,000'],
      ['Gabby Strickland', 'Ch', 'Business Process Consultant', 'Scottsdale', 26, '$45,000'],
      ['Mason Ray', 'Ch', 'Computer Scientist', 'San Francisco', 39, '$142,000'],
    ];

    const options = {
      filter: true,
      filterType: 'dropdown',
      responsive: 'stacked',
    };

    return <MUIDataTable title={'ACME Employee list'} data={data} columns={columns} options={options} />;
  }
}

export default Example;
