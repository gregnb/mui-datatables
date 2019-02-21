import React from "react";
import ReactDOM from "react-dom";
import MUIDataTable from "../../src/";

class Example extends React.Component {

  render() {

    const columns = [
      {
        name: "name",
        label: "Name",
        options: {
          filter: true,
          display: 'excluded',
        }
      },      
      {
        name: "title",
        label: "Modified Title Label",
        options: {
          filter: true,
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
        Label: "Age",
        options: {
          filter: true,
        }
      },
      {
        name: "salary",
        label: "Salary",
        options: {
          filter: true,
          sort: false
        }
      }      
    ];


    const data = [
      { name: "Gabby George", title: "Business Analyst", location: "Minneapolis", age: 30, salary: "$100,000" },
      { name: "Aiden Lloyd", title: "Business Consultant", location: "Dallas",  age: 55, salary: "$200,000" },
      { name: "Jaden Collins", title: "Attorney", location: "Santa Ana", age: 27, salary: "$500,000" },
      { name: "Franky Rees", title: "Business Analyst", location: "St. Petersburg", age: 22, salary: "$50,000" }
      // ["Aaren Rose", "Business Consultant", "Toledo", 28, "$75,000"],
      // ["Blake Duncan", "Business Management Analyst", "San Diego", 65, "$94,000"],
      // ["Frankie Parry", "Agency Legal Counsel", "Jacksonville", 71, "$210,000"],
      // ["Lane Wilson", "Commercial Specialist", "Omaha", 19, "$65,000"]
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
