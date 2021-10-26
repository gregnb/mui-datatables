import React from "react";
import ReactDOM from "react-dom";
import MUIDataTable from "../../src/";
import { debounceSearchRender } from "../../src/";
import { Button } from '@mui/material';

class Example extends React.Component {

  constructor(props) {
    super(props);

    const rand = (size) => {
      return Math.floor( Math.random() * size );
    };

    const firstNames = ['Adam', 'Jack', 'Edward', 'Donna', 'Sarah', 'Suzie', 'Sam', 'RJ', 'Henry', 'Ryan', 'Ricky', 'James'];
    const lastNames  = ['Ronson', 'Johnson', 'Jackson', 'Campo', 'Edwards', 'Brown', 'Green', 'White', 'Simmons', 'Gates', 'Jobs'];
    const titles = ['Owner', 'Unemployed', 'Burger Flipper', 'Coder', 'Business Analyst', 'Attorney', 'Consultant', 'Singer','Painter'];
    const locations = ['New York', 'El Paso', 'DC', 'Dallas', 'Santa Ana','St. Petersburg', 'London','Paris'];
    const salarys = ['$100,000', '$50,000', '$75,000', '$80,000'];
    var data = [];
    var name = '';

    for (var ii = 0; ii < 5000; ii++) {
      name = firstNames[ rand(firstNames.length)] + ' ' + lastNames[ rand(lastNames.length) ];
      data.push({
        name: name,
        title: titles[ rand(titles.length)],
        location: locations[ rand(locations.length) ],
        salary: salarys[ rand(salarys.length )],
        phone: '555-5555',
        email: name.replace(/ /g, '_').toLowerCase() + '@example.com',
      });
    }

    this.state = {
      data: data
    };
    console.time('Render Time');
  }

  componentDidMount() {
    console.timeEnd('Render Time');
  }

  render() {

    const columns = [
      {
        name: "name",
        label: "Name",
        options: {
          filter: true,
          customBodyRenderLite: (dataIndex) => {
            let val = this.state.data[dataIndex].name;
            return val;
          }
        }
      },      
      {
        name: "title",
        label: "Modified Title Label",
        options: {
          filter: true,
          customBodyRenderLite: (dataIndex) => {
            let val = this.state.data[dataIndex].title;
            return val;
          }
        }
      },
      {        
        name: "location",
        label: "Location",
        options: {
          filter: false,
        }
      },
      {
        name: "age",
        label: "Age",
        options: {
          filter: true,
        }
      },
      {
        name: "salary",
        label: "Salary",
        options: {
          filter: true,
          sort: false,
          customBodyRenderLite: (dataIndex) => {
            let val = this.state.data[dataIndex].salary;
            return val;
          }
        }
      },
      {
        name: "phone",
        label: "Phone",
        options: {
          filter: true,
          sort: false,
          customBodyRenderLite: (dataIndex) => {
            let val = this.state.data[dataIndex].phone;
            return val;
          }
        }
      },
      {
        name: "email",
        label: "E-mail",
        options: {
          filter: true,
          sort: false,
          customBodyRenderLite: (dataIndex) => {
            let val = this.state.data[dataIndex].email;
            return val;
          }
        }
      }
    ];

    const options = {
      rowsPerPage: 100,
      rowsPerPageOptions: [10, 100, 250, 500, 1000],
      filter: true,
      filterType: 'dropdown',
      responsive: 'vertical',
      tableBodyHeight:'500px',
      customSearchRender: debounceSearchRender(500),
      jumpToPage: true,

      // These next two options allow you to make it so filters need to be confirmed.
      confirmFilters: true,

      // Calling the applyNewFilters parameter applies the selected filters to the table
      customFilterDialogFooter: (currentFilterList, applyNewFilters) => {
        return (
          <div style={{ marginTop: '40px' }}>
            <Button variant="contained" onClick={applyNewFilters}>Apply Filters</Button>
          </div>
        );
      }
    };

    return (
      <MUIDataTable title={"ACME Employee list"} data={this.state.data} columns={columns} options={options} />
    );

  }
}

export default Example;
