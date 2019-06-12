import React from "react";
import ReactDOM from "react-dom";
import MUIDataTable from "../../src/";

class Example extends React.Component {

  state = {
    filterList: [
      ['Franky Miles'],
      ['Business Analyst'],
      [],
      [],
      []
    ],
    filterOptions: ['this', 'test', 'is', 'working'],
    data: [
      ["Gabby George", "Business Analyst", "Minneapolis", 30, 100000],
      ["Business Analyst", "Business Consultant", "Dallas",  55, 200000],
      ["Jaden Collins", "Attorney", "Santa Ana", 27, 500000],
      ["Franky Rees", "Business Analyst", "St. Petersburg", 22, 50000],
      ["Aaren Rose", "Business Consultant", "Toledo", 28, 75000],
      ["Blake Duncan", "Business Management Analyst", "San Diego", 65, 94000],
      ["Frankie Parry", "Agency Legal Counsel", "Jacksonville", 71, 210000],
      ["Lane Wilson", "Commercial Specialist", "Omaha", 19, 65000],
      ["Robin Duncan", "Business Analyst", "Los Angeles", 20, 77000],
      ["Mel Brooks", "Business Consultant", "Oklahoma City", 37, 135000],
      ["Harper White", "Attorney", "Pittsburgh", 52, 420000],
      ["Kris Humphrey", "Agency Legal Counsel", "Laredo", 30, 150000],
      ["Frankie Long", "Industrial Analyst", "Austin", 31, 170000],
      ["Brynn Robbins", "Business Analyst", "Norfolk", 22, 90000],
      ["Justice Mann", "Business Consultant", "Chicago", 24, 133000],
      ["Addison Navarro", "Business Management Analyst", "New York", 50, 295000],
      ["Jesse Welch", "Agency Legal Counsel", "Seattle", 28, 200000],
      ["Eli Mejia", "Commercial Specialist", "Long Beach", 65, 400000],
      ["Gene Leblanc", "Industrial Analyst", "Hartford", 34, 110000],
      ["Danny Leon", "Computer Scientist", "Newark", 60, 220000],
      ["Lane Lee", "Corporate Counselor", "Cincinnati", 52, 180000],
      ["Jesse Hall", "Business Analyst", "Baltimore", 44, 99000],
      ["Danni Hudson", "Agency Legal Counsel", "Tampa", 37, 90000],
      ["Terry Macdonald", "Commercial Specialist", "Miami", 39, 140000],
      ["Justice Mccarthy", "Attorney", "Tucson", 26, 330000],
      ["Silver Carey", "Computer Scientist", "Memphis", 47, 250000],
      ["Franky Miles", "Industrial Analyst", "Buffalo", 49, 190000],
      ["Glen Nixon", "Corporate Counselor", "Arlington", 44, 80000],
      ["Gabby Strickland", "Business Process Consultant", "Scottsdale", 26, 45000],
      ["Mason Ray", "Computer Scientist", "San Francisco", 39, 142000]
    ]
  }

  handleFilterOptionsChange = (event) => {
    let array = prompt("Write a string separte by semicolon to change filterOptions in first column!");
    this.setState({ filterOptions: array.split(';') });
  }

  handleAddData = (event) => {
    const string = prompt("Write a string with 'Name', 'Title', 'Location', 'Age' and 'Salary' separted by semicolon !");
    this.setState({ data: [string.split(';'), ...this.state.data] });
  }

  render() {
    const { data, filterList, filterOptions } = this.state;

    const columns = [
      {
        name: "Name",
        options: {
          filter: true,
          filterList: filterList[0].length ? filterList[0] : null,
          customFilterListRender: v => `Name: ${v}`,
          filterOptions: {
            names: filterOptions
          },
        }
      },
      {
        name: "Title",
        options: {
          filter: true,
          filterList: filterList[1].length ? filterList[1] : null,
          customFilterListRender: v => `Title: ${v}`,
          filterType: 'textField' // set filterType's at the column level
        }
      },
      {
        name: "Location",
        options: {
          filter: false,
          filterList: filterList[2].length ? filterList[2] : null,
        }
      },
      {
        name: "Age",
        options: {
          filter: true,
          filterList: filterList[3].length ? filterList[3] : null,
          customFilterListRender: v => `Age: ${v}`,
        }
      },
      {
        name: "Salary",
        options: {
          filter: true,
          filterList: filterList[4].length ? filterList[4] : null,
          customFilterListRender: v => `Salary: ${v}`,
          sort: false
        }
      }
    ];

    const options = {
      filter: true,
      onFilterChange: (changedColumn, newFilterList) => {
        this.setState({ filterList: newFilterList });
      },
      selectableRows: true,
      filterType: 'dropdown',
      responsive: 'stacked',
      rowsPerPage: 10,
      page: 1,
    };

    return (
      <React.Fragment>
        <MUIDataTable title={"ACME Employee list"} data={data} columns={columns} options={options} />
        <button onClick={() => this.setState({
          filterList: [
            ['Franky Miles'],
            ['Business Analyst'],
            [],
            [],
            []
          ]
        })}
        >
          Set starter filters!
        </button>
        <button onClick={this.handleFilterOptionsChange}>Change filters!</button>
        <button onClick={this.handleAddData}>Add data!</button>
      </React.Fragment>
    );

  }
}

ReactDOM.render(<Example />, document.getElementById("app-root"));
