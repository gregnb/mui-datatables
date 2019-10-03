import React from "react";
import ReactDOM from "react-dom";
import MUIDataTable from "../../src/";

class Example extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [
        ["Gabby George", "Business Analyst", "Minneapolis", 30, "$100,000"],
        ["Aiden Lloyd", "Business Consultant", "Dallas",  55, "$200,000"],
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
        ["Silver Carey", "Computer Scientist", "Memphis", 47, "$250,000" ],
        ["Franky Miles", "Industrial Analyst", "Buffalo", 49, "$190,000"],
        ["Glen Nixon", "Corporate Counselor", "Arlington", 44, "$80,000"],
        ["Gabby Strickland", "Business Process Consultant", "Scottsdale", 26, "$45,000"],
        ["Mason Ray", "Computer Scientist", "San Francisco", 39, "$142,000"]
      ]
    };
  }

  render() {
    const columns = [
      {
        name: "Delete",
        options: {
          filter: false,
          sort: false,
          empty: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <button onClick={() => {
                const { data } = this.state;
                data.shift();
                this.setState({ data });
              }}>
                Delete
              </button>
            );
          }
        }
      },
      {
        name: "Edit",
        options: {
          filter: false,
          sort: false,
          empty: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <button onClick={() => window.alert(`Clicked "Edit" for row ${tableMeta.rowIndex}`)}>
                Edit
              </button>
            );
          }
        }
      },
      {
        name: "Name",
        options: {
          filter: true,
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
          filter: false,
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
          sort: false,
        }
      },
      {
        name: "Add",
        options: {
          filter: false,
          sort: false,
          empty: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <button onClick={() => {
                const { data } = this.state;
                data.unshift(["Mason Ray", "Computer Scientist", "San Francisco", 39, "$142,000"]);
                this.setState({ data });
              }}>
                Add
              </button>
            );
          }
        }
      },
    ];

    const data1 = [
      {Name: "Gabby George", Title: "Business Analyst", Location: "Minneapolis", Age: 30, Salary: "$100,000"},
      {Name: "Aiden Lloyd", Title: "Business Consultant", Location: "Dallas", Age: 55, Salary: "$200,000"},
      {Name: "Jaden Collins", Title: "Attorney", Location: "Santa Ana", Age: 27, Salary: "$500,000"},
      {Name: "Franky Rees", Title: "Business Analyst", Location: "St. Petersburg", Age: 22, Salary: "$50,000"},
      {Name: "Aaren Rose", Title: "Business Consultant", Location: "Toledo", Age: 28, Salary: "$75,000"},
      {Name: "Blake Duncan", Title: "Business Management Analyst", Location: "San Diego", Age: 65, Salary: "$94,000"},
      {Name: "Frankie Parry", Title: "Agency Legal Counsel", Location: "Jacksonville", Age: 71, Salary: "$210,000"},
      {Name: "Lane Wilson", Title: "Commercial Specialist", Location: "Omaha", Age: 19, Salary: "$65,000"},
      {Name: "Robin Duncan", Title: "Business Analyst", Location: "Los Angeles", Age: 20, Salary: "$77,000"},
      {Name: "Mel Brooks", Title: "Business Consultant", Location: "Oklahoma City", Age: 37, Salary: "$135,000"},
      {Name: "Harper White", Title: "Attorney", Location: "Pittsburgh", Age: 52, Salary: "$420,000"},
      {Name: "Kris Humphrey", Title: "Agency Legal Counsel", Location: "Laredo", Age: 30, Salary: "$150,000"},
      {Name: "Frankie Long", Title: "Industrial Analyst", Location: "Austin", Age: 31, Salary: "$170,000"},
      {Name: "Brynn Robbins", Title: "Business Analyst", Location: "Norfolk", Age: 22, Salary: "$90,000"},
      {Name: "Justice Mann", Title: "Business Consultant", Location: "Chicago", Age: 24, Salary: "$133,000"},
      {Name: "Addison Navarro", Title: "Business Management Analyst", Location: "New York", Age: 50, Salary: "$295,000"},
      {Name: "Jesse Welch", Title: "Agency Legal Counsel", Location: "Seattle", Age: 28, Salary: "$200,000"},
      {Name: "Eli Mejia", Title: "Commercial Specialist", Location: "Long Beach", Age: 65, Salary: "$400,000"},
      {Name: "Gene Leblanc", Title: "Industrial Analyst", Location: "Hartford", Age: 34, Salary: "$110,000"},
      {Name: "Danny Leon", Title: "Computer Scientist", Location: "Newark", Age: 60, Salary: "$220,000"},
      {Name: "Lane Lee", Title: "Corporate Counselor", Location: "Cincinnati", Age: 52, Salary: "$180,000"},
      {Name: "Jesse Hall", Title: "Business Analyst", Location: "Baltimore", Age: 44, Salary: "$99,000"},
      {Name: "Danni Hudson", Title: "Agency Legal Counsel", Location: "Tampa", Age: 37, Salary: "$90,000"},
      {Name: "Terry Macdonald", Title: "Commercial Specialist", Location: "Miami", Age: 39, Salary: "$140,000"},
      {Name: "Justice Mccarthy", Title: "Attorney", Location: "Tucson", Age: 26, Salary: "$330,000"},
      {Name: "Silver Carey", Title: "Computer Scientist", Location: "Memphis", Age: 47, Salary: "$250,000" },
      {Name: "Franky Miles", Title: "Industrial Analyst", Location: "Buffalo", Age: 49, Salary: "$190,000"},
      {Name: "Glen Nixon", Title: "Corporate Counselor", Location: "Arlington", Age: 44, Salary: "$80,000"},
      {Name: "Gabby Strickland", Title: "Business Process Consultant", Location: "Scottsdale", Age: 26, Salary: "$45,000"},
      {Name: "Mason Ray", Title: "Computer Scientist", Location: "San Francisco", Age: 39, Salary: "$142,000"}
    ];

    const options = {
      filter: true,
      filterType: 'dropdown',
      responsive: 'stacked',
      page: 2,
      onColumnSortChange: (changedColumn, direction) => console.log('changedColumn: ', changedColumn, 'direction: ', direction),
      onChangeRowsPerPage: numberOfRows => console.log('numberOfRows: ', numberOfRows),
      onChangePage: currentPage => console.log('currentPage: ', currentPage)
    };

    return (
      <MUIDataTable title={"ACME Employee list"} data={this.state.data} columns={columns} options={options} />
    );

  }
}

export default Example;
