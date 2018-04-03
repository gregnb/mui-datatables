import React from "react";
import ReactDOM from "react-dom";
import { FormControlLabel } from 'material-ui/Form';
import Switch from 'material-ui/Switch';
import MUIDataTable from "../../src/";
import Cities from "./cities";

class Example extends React.Component {

  renderCities = (index, value) => (
    <Cities
      value={value}
      index={index}
      change={event => true}
    />
  );
  
  renderActive = (index, value) => (
    <FormControlLabel
      label={value ? "Yes" : "No"}
      control={
        <Switch color="primary" checked={value} value={value ? "Yes" : "No"} />
      }
      onChange={event => true}
    />
  );

  render() {

    const columns = [
      {
        name: "Name",
        options: {
          filter: false,
        }
      },      
      {
        name: "Title",
        options: {
          filter: true,
        }
      },
      {
        name: "Location",
        options: {
          filter: true,
          renderComponent: this.renderCities
        }
      },
      {
        name: "Age",
        options: {
          filter: false,
        }
      },
      {
        name: "Salary",
        options: {
          filter: true,
          renderValue: (value) => value.toLocaleString('en-US', {style: 'currency', currency: 'USD'})
        }
      },
      {
        name: "Active",
        options: {
          filter: true,
          renderComponent: this.renderActive,
          renderValue: (value) => value ? "Yes" : "No"
        }
      }
    ];


    const data = [
      ["Gabby George", "Business Analyst", "Minneapolis", 30, 100000, true],
      ["Aiden Lloyd", "Business Consultant", "Dallas",  55, 200000, false],
      ["Jaden Collins", "Attorney", "Santa Ana", 27, 500000, true],
      ["Franky Rees", "Business Analyst", "St. Petersburg", 22, 50000, false],
      ["Aaren Rose", "Business Consultant", "Toledo", 28, 75000, true],
      ["Blake Duncan", "Business Management Analyst", "San Diego", 65, 94000, true],
      ["Frankie Parry", "Agency Legal Counsel", "Jacksonville", 71, 210000, false],
      ["Lane Wilson", "Commercial Specialist", "Omaha", 19, 65000, true],
      ["Robin Duncan", "Business Analyst", "Los Angeles", 20, 77000, false],
      ["Mel Brooks", "Business Consultant", "Oklahoma City", 37, 135000, true],
      ["Harper White", "Attorney", "Pittsburgh", 52, 420000, false],
      ["Kris Humphrey", "Agency Legal Counsel", "Laredo", 30, 150000, true],
      ["Frankie Long", "Industrial Analyst", "Austin", 31, 170000, false],
      ["Brynn Robbins", "Business Analyst", "Norfolk", 22, 90000, true],
      ["Justice Mann", "Business Consultant", "Chicago", 24, 133000, false],
      ["Addison Navarro", "Business Management Analyst", "New York", 50, 295000, true],
      ["Jesse Welch", "Agency Legal Counsel", "Seattle", 28, 200000, false],
      ["Eli Mejia", "Commercial Specialist", "Long Beach", 65, 400000, true],
      ["Gene Leblanc", "Industrial Analyst", "Hartford", 34, 110000, false],
      ["Danny Leon", "Computer Scientist", "Newark", 60, 220000, true],
      ["Lane Lee", "Corporate Counselor", "Cincinnati", 52, 180000, false],
      ["Jesse Hall", "Business Analyst", "Baltimore", 44, 99000, true],
      ["Danni Hudson", "Agency Legal Counsel", "Tampa", 37, 90000, false],
      ["Terry Macdonald", "Commercial Specialist", "Miami", 39, 140000, true],
      ["Justice Mccarthy", "Attorney", "Tucson", 26, 330000, false],
      ["Silver Carey", "Computer Scientist", "Memphis", 47, 250000, true],
      ["Franky Miles", "Industrial Analyst", "Buffalo", 49, 190000, false],
      ["Glen Nixon", "Corporate Counselor", "Arlington", 44, 80000, true],
      ["Gabby Strickland", "Business Process Consultant", "Scottsdale", 26, 45000, false],
      ["Mason Ray", "Computer Scientist", "San Francisco", 39, 142000, true]
    ];

    const options = {
      filter: true,
      filterType: 'dropdown',
      responsive: 'stacked',
    };

    return (
      <MUIDataTable title={"ACME Employee list"} data={data} columns={columns} options={options} />
    );

  }
}

ReactDOM.render(<Example />, document.getElementById("app-root"));
