import React from "react";
import ReactDOM from "react-dom";
import MUIDataTable from "../../src";

class Example extends React.Component {

  render() {

    const columns = [
      {
        name: "Name",
        options: {
          filter: true,
          display: 'excluded',
        }
      },
      {
        label: "Modified Title Label",
        name: "Title",
        options: {
          filter: true,
        }
      },
      {
        name: "Location",
        options: {
          print: false,
          filter: false,
        }
      },
      {
        name: "Age",
        options: {
          filter: true,
          filterOptions: ["young", "adult", "middle-age", "senior", "elderly"],
          customFilter(age, filterVal) {
            if (filterVal.indexOf("young")>=0 && (age <= 35)) return false;
            if (filterVal.indexOf("adult")>=0 && age > 35 && age <= 45) return false;
            if (filterVal.indexOf("middle-age")>=0 && age > 45 && age <= 65) return false;
            if (filterVal.indexOf("senior")>=0 && age > 65 && age <= 75) return false;
            if (filterVal.indexOf("elderly")>=0 && age > 75) return false;
            return true;
          },
          print: false,
        }
      },
      {
        name: "Salary",
        options: {
          filter: true,
          filterType: "checkbox",
          filterOptions: ["lower", "average", "higher"],
          customFilter(salary, filterVal) {
            salary=salary.replace(/[^\d]/g, "");
            console.log(salary, filterVal);
            if (filterVal.indexOf("lower")>=0 && salary < 100000) return false;
            if (filterVal.indexOf("average")>=0 && salary >= 100000 && salary <= 200000) return false;
            if (filterVal.indexOf("higher")>=0 && salary > 200000) return false;
            return true;
          },
          sort: false
        }
      }
    ];


    const data = [
      ["Gabby George", "Business Analyst", "Minneapolis", 30, "$100,000"],
      ["Aiden Lloyd", "Business Consultant", "Dallas", 55, "$200,000"],
      ["Jaden Collins", "Attorney", "Santa Ana", 27, "$500,000"],
      ["Franky Rees", "Business Analyst", "St. Petersburg", 22, "$50,000"],
      ["Aaren Rose", "Business Consultant", "Toledo", 28, "$75,000"],
      ["Blake Duncan", "Business Management Analyst", "San Diego", 65, "$94,000"],
      ["Frankie Parry", "Agency Legal Counsel", "Jacksonville", 71, "$210,000"],
      ["Lane Wilson", "Commercial Specialist", "Omaha", 19, "$65,000"],
      ["Robin Duncan", "Business Analyst", "Los Angeles", 20, "$77,000"],
      ["Mel Brooks", "Business Consultant", "Oklahoma City", 37, "$135,000"],
      ["Harper White", "Attorney", "Pittsburgh", 52, "$420,000"],
      ["Kris Humphrey", "Agency Legal Counsel", "Laredo", 30, "$150,000"],
      ["Frankie Long", "Industrial Analyst", "Austin", 31, "$170,000"],
      ["Brynn Robbins", "Business Analyst", "Norfolk", 22, "$90,000"],
      ["Justice Mann", "Business Consultant", "Chicago", 24, "$133,000"],
      ["Addison Navarro", "Business Management Analyst", "New York", 50, "$295,000"],
      ["Jesse Welch", "Agency Legal Counsel", "Seattle", 28, "$200,000"],
      ["Eli Mejia", "Commercial Specialist", "Long Beach", 65, "$400,000"],
      ["Gene Leblanc", "Industrial Analyst", "Hartford", 34, "$110,000"],
      ["Danny Leon", "Computer Scientist", "Newark", 60, "$220,000"],
      ["Lane Lee", "Corporate Counselor", "Cincinnati", 52, "$180,000"],
      ["Jesse Hall", "Business Analyst", "Baltimore", 44, "$99,000"],
      ["Danni Hudson", "Agency Legal Counsel", "Tampa", 37, "$90,000"],
      ["Terry Macdonald", "Commercial Specialist", "Miami", 39, "$140,000"],
      ["Justice Mccarthy", "Attorney", "Tucson", 26, "$330,000"],
      ["Silver Carey", "Computer Scientist", "Memphis", 47, "$250,000"],
      ["Franky Miles", "Industrial Analyst", "Buffalo", 49, "$190,000"],
      ["Glen Nixon", "Corporate Counselor", "Arlington", 44, "$80,000"],
      ["Gabby Strickland", "Business Process Consultant", "Scottsdale", 26, "$45,000"],
      ["Mason Ray", "Computer Scientist", "San Francisco", 39, "$142,000"]
    ];

    const options = {
      filter: true,
      filterType: 'dropdown',
      responsive: 'scroll',
    };

    return (
      <MUIDataTable title={"ACME Employee list - customizeFilter"} data={data} columns={columns} options={options} />
    );

  }
}

ReactDOM.render(<Example />, document.getElementById("app-root"));