import React from "react";
import MUIDataTable from "../../src/";
import {RadioGroup, FormControl, FormLabel, Radio, FormControlLabel} from '@material-ui/core';

class Example extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      responsiveStyle: "stacked"
    };
  }
  
  onChange = (e) => this.setState({responsiveStyle: e.target.value});
  
  render(){
    const columns = ["Name", "Title", "Location", "Age", "Salary", "Name", "Title", "Location", "Age", "Salary"];
  
    let data = [
      ["Gabby George", "Business Analyst", "Minneapolis", 30, 100000, "Gabby George", "Business Analyst", "Minneapolis", 30, 100000],
      ["Aiden Lloyd", "Business Consultant", "Dallas",  55, 200000, "Gabby George", "Business Analyst", "Minneapolis", 30, 100000],
      ["Jaden Collins", "Attorney", "Santa Ana", 27, 500000, "Gabby George", "Business Analyst", "Minneapolis", 30, 100000],
      ["Franky Rees", "Business Analyst", "St. Petersburg", 22, 50000, "Gabby George", "Business Analyst", "Minneapolis", 30, 100000],
      ["Aaren Rose", "Business Consultant", "Toledo", 28, 75000, "Gabby George", "Business Analyst", "Minneapolis", 30, 100000],
      ["Blake Duncan", "Business Management Analyst", "San Diego", 65, 94000, "Gabby George", "Business Analyst", "Minneapolis", 30, 100000],
      ["Frankie Parry", "Agency Legal Counsel", "Jacksonville", 71, 210000, "Gabby George", "Business Analyst", "Minneapolis", 30, 100000],
      ["Lane Wilson", "Commercial Specialist", "Omaha", 19, 65000, "Gabby George", "Business Analyst", "Minneapolis", 30, 100000],
      ["Robin Duncan", "Business Analyst", "Los Angeles", 20, 77000, "Gabby George", "Business Analyst", "Minneapolis", 30, 100000],
      ["Mel Brooks", "Business Consultant", "Oklahoma City", 37, 135000, "Gabby George", "Business Analyst", "Minneapolis", 30, 100000],
      ["Harper White", "Attorney", "Pittsburgh", 52, 420000, "Gabby George", "Business Analyst", "Minneapolis", 30, 100000],
      ["Kris Humphrey", "Agency Legal Counsel", "Laredo", 30, 150000, "Gabby George", "Business Analyst", "Minneapolis", 30, 100000],
      ["Frankie Long", "Industrial Analyst", "Austin", 31, 170000, "Gabby George", "Business Analyst", "Minneapolis", 30, 100000],
      ["Brynn Robbins", "Business Analyst", "Norfolk", 22, 90000, "Gabby George", "Business Analyst", "Minneapolis", 30, 100000],
      ["Justice Mann", "Business Consultant", "Chicago", 24, 133000, "Gabby George", "Business Analyst", "Minneapolis", 30, 100000],
      ["Addison Navarro", "Business Management Analyst", "New York", 50, 295000, "Gabby George", "Business Analyst", "Minneapolis", 30, 100000],
      ["Jesse Welch", "Agency Legal Counsel", "Seattle", 28, 200000, "Gabby George", "Business Analyst", "Minneapolis", 30, 100000],
      ["Eli Mejia", "Commercial Specialist", "Long Beach", 65, 400000, "Gabby George", "Business Analyst", "Minneapolis", 30, 100000],
      ["Gene Leblanc", "Industrial Analyst", "Hartford", 34, 110000, "Gabby George", "Business Analyst", "Minneapolis", 30, 100000],
      ["Danny Leon", "Computer Scientist", "Newark", 60, 220000, "Gabby George", "Business Analyst", "Minneapolis", 30, 100000],
      ["Lane Lee", "Corporate Counselor", "Cincinnati", 52, 180000, "Gabby George", "Business Analyst", "Minneapolis", 30, 100000],
      ["Jesse Hall", "Business Analyst", "Baltimore", 44, 99000, "Gabby George", "Business Analyst", "Minneapolis", 30, 100000],
      ["Danni Hudson", "Agency Legal Counsel", "Tampa", 37, 90000, "Gabby George", "Business Analyst", "Minneapolis", 30, 100000],
      ["Terry Macdonald", "Commercial Specialist", "Miami", 39, 140000, "Gabby George", "Business Analyst", "Minneapolis", 30, 100000],
      ["Justice Mccarthy", "Attorney", "Tucson", 26, 330000, "Gabby George", "Business Analyst", "Minneapolis", 30, 100000],
      ["Silver Carey", "Computer Scientist", "Memphis", 47, 250000, "Gabby George", "Business Analyst", "Minneapolis", 30, 100000],
      ["Franky Miles", "Industrial Analyst", "Buffalo", 49, 190000, "Gabby George", "Business Analyst", "Minneapolis", 30, 100000],
      ["Glen Nixon", "Corporate Counselor", "Arlington", 44, 80000, "Gabby George", "Business Analyst", "Minneapolis", 30, 100000],
      ["Gabby Strickland", "Business Process Consultant", "Scottsdale", 26, 45000, "Gabby George", "Business Analyst", "Minneapolis", 30, 100000],
      ["Mason Ray", "Computer Scientist", "San Francisco", 39, 142000, "Gabby George", "Business Analyst", "Minneapolis", 30, 100000]
    ];
    const options = {
      filter: true,
      filterType: 'dropdown',
      responsive: this.state.responsiveStyle,
      rowsPerPage: 10,
    };
    return(
      <React.Fragment>
      <FormControl>
        <FormLabel component="legend">Choose Responsive Style</FormLabel>
        <RadioGroup row value={this.state.responsiveStyle} onChange={this.onChange}>
          <FormControlLabel control={<Radio/>} label={"stacked"} value={"stacked"}/>
          <FormControlLabel control={<Radio/>} label={"scrollMaxHeight"} value={"scrollMaxHeight"} />
          <FormControlLabel control={<Radio/>} label={"scrollFullHeight"} value={"scrollFullHeight"}/>
        </RadioGroup>
      </FormControl>
        <MUIDataTable title={"ACME Employee list"} data={data} columns={columns} options={options} />

      </React.Fragment>
    );
  }
}

export default Example;
