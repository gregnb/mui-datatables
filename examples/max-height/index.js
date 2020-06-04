import React from "react";
import MUIDataTable from "../../src/";

class Example extends React.Component {
    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
    }

  state = {
    counter: 0,
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
      ],
    maxHeight : 700
  }

  rerender = () => {
        console.log(this.inputRef.current.value);
    this.setState((prevState) => ({
      counter: prevState.counter + 1,
      maxHeight: this.inputRef.current.value
    })); 
  }

  render() {

    const columns = ["Name", "Title", "Location", "Age", "Salary"];
    console.log(this.state.maxHeight);
    const options = {
      maxHeight : this.state.maxHeight,
      filter: true,
      filterType: 'dropdown',
      rowsPerPage: 100,
      rowsPerPageOptions : [10, 25, 50, 100],
      responsive: 'scrollMaxHeight',
    };

    return (
      <React.Fragment>
        <div>
          <button onClick={this.rerender}>Re-render - {this.state.counter}</button>
        </div>
        <div>
          <label htmlFor="lname">MaxHeight ['none', 'max-content', 'min-content', 'fit-content', 'fill-available', number]: </label>
          <input type="text" id="maxHeight" name="maxHeight" ref={this.inputRef} />
        </div>
        <MUIDataTable title={"ACME Employee list"} data={this.state.data} columns={columns} options={options} />
      </React.Fragment>
    );

  }
}

export default Example;