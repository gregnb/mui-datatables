import React from "react";
import ReactDOM from "react-dom";
import MUIDataTable from "../../src/";

class Example extends React.Component {

  render() {

    const columns = [
      {
        name: "Name",
        options: {
          filter: true,
          setCellProps: () => ({style: {whiteSpace:'nowrap'}})
        }
      },      
      {
        name: "Title",
        options: {
          filter: true,
          setCellProps: () => ({style: {whiteSpace:'nowrap'}})
        }
      },
      {
        name: "Location",
        options: {
          filter: false,
          setCellProps: () => ({style: {whiteSpace:'nowrap'}})
        }
      },
      {
        name: "Age",
        options: {
          filter: true,
        }
      },
      {
        name: "Salary",
        options: {
          filter: true,
          sort: false
        }
      },
      {
        name: "Phone Number",
        options: {
          filter: true,
          sort: false,
          setCellProps: () => ({style: {whiteSpace:'nowrap'}})
        }
      },
    ];


    const data = [
      ["Gabby George", "Business Analyst", "Minneapolis", 30, "$100,000", "555-5555"],
      ["Aiden Lloyd", "Business Consultant", "Dallas",  55, "$200,000", ""],
      ["Jaden Collins", "Attorney", "Santa Ana", 27, "$500,000", ""],
      ["Franky Rees", "Business Analyst", "St. Petersburg", 22, "$50,000", "555-5555"],
      ["Aaren Rose", "Business Consultant", "Toledo", 28, "$75,000", "555-5555"],
      ["Blake Duncan", "Consultant and Business Management Analyst", "San Diego", 65, "$94,000", "555-5555"],
      ["Frankie Parry", "Agency Legal Counsel", "Jacksonville", 71, "$210,000", "555-5555"],
      ["Lane Wilson", "Commercial Specialist", "Omaha", 19, "$65,000", ""],
      ["Robin Duncan", "Business Analyst", "Los Angeles", 20, "$77,000", ""],
      ["Mel Brooks", "Business Consultant", "Oklahoma City", 37, "$135,000", ""],
      ["Harper White", "Attorney", "Pittsburgh", 52, "$420,000", ""],
      ["Kris Humphrey", "Agency Legal Counsel", "Laredo", 30, "$150,000", "555-5555"],
      ["Frankie Long", "Industrial Analyst", "Austin", 31, "$170,000", ""],
      ["Brynn Robbins", "Business Analyst", "Norfolk", 22, "$90,000", ""],
      ["Justice Mann", "Business Consultant", "Chicago", 24, "$133,000", "555-5555"],
      ["Addison Navarro", "Business Management Analyst", "New York", 50, "$295,000", "555-5555"],
      ["Jesse Welch", "Agency Legal Counsel", "Seattle", 28, "$200,000", "555-5555"],
      ["Eli Mejia", "Commercial Specialist", "Long Beach", 65, "$400,000", "555-5555"],
      ["Gene Leblanc", "Industrial Analyst", "Hartford", 34, "$110,000", "555-5555"],
      ["Danny Leon", "Computer Scientist", "Newark", 60, "$220,000", "555-5555"],
      ["Lane Lee", "Corporate Counselor", "Cincinnati", 52, "$180,000", "555-5555"],
      ["Jesse Hall", "Business Analyst", "Baltimore", 44, "$99,000", "555-5555"],
      ["Danni Hudson", "Agency Legal Counsel", "Tampa", 37, "$90,000", "555-5555"],
      ["Terry Macdonald", "Commercial Specialist", "Miami", 39, "$140,000", "555-5555"],
      ["Justice Mccarthy", "Attorney", "Tucson", 26, "$330,000", ""],
      ["Silver Carey", "Computer Scientist", "Memphis", 47, "$250,000", ""],
      ["Franky Miles", "Industrial Analyst", "Buffalo", 49, "$190,000", "555-5555"],
      ["Glen Nixon", "Corporate Counselor", "Arlington", 44, "$80,000", "555-5555"],
      ["Gabby Strickland", "Business Process Consultant", "Scottsdale", 26, "$45,000", "555-5555"],
      ["Mason Ray", "Computer Scientist", "San Francisco", 39, "$142,000", "555-5555"]
    ];

    const options = {
      filter: true,
      filterType: 'dropdown',
      responsive: 'scrollMaxHeight',
      fixedHeader: true,
      fixedSelectColumn: false
    };

    return (
      <MUIDataTable title={"ACME Employee list"} data={data} columns={columns} options={options} />
    );

  }
}

export default Example;
