import React from "react";
import ReactDOM from "react-dom";
import MUIDataTable from "../src/";
import Titles from "./titles";

class Example extends React.Component {

  render() {

    const columns = ["Name", "Title", "Location", "Age", "Salary"];

    const data = [
      ["Gabby George", <Titles value="Business Analyst" />, "Minneapolis", 30, "$100,000"],
      ["Aiden Lloyd", <Titles value="Business Consultant" />, "Dallas",  55, "$200,000"],
      ["Jaden Collins", <Titles value="Attorney" />, "Santa Ana", 27, "$500,000"],
      ["Franky Rees", <Titles value="Business Analyst" />, "St. Petersburg", 22, "$50,000"],
      ["Aaren Rose", <Titles value="Business Consultant" />, "Toledo", 28, "$75,000"],
      ["Blake Duncan", <Titles value="Business Management Analyst" />, "San Diego", 65, "$94,000"],
      ["Frankie Parry", <Titles value="Agency Legal Counsel" />, "Jacksonville", 71, "$210,000"],
      ["Lane Wilson", <Titles value="Commercial Specialist" />, "Omaha", 19, "$65,000"],
      ["Robin Duncan", <Titles value="Business Analyst" />, "Los Angeles", 20, "$77,000"],
      ["Mel Brooks", <Titles value="Business Consultant" />, "Oklahoma City", 37, "$135,000"],
      ["Harper White", <Titles value="Attorney" />, "Pittsburgh", 52, "$420,000"],
      ["Kris Humphrey", <Titles value="Agency Legal Counsel" />, "Laredo", 30, "$150,000"],
      ["Frankie Long", <Titles value="Industrial Analyst" />, "Austin", 31, "$170,000"],
      ["Brynn Robbins", <Titles value="Business Analyst" />, "Norfolk", 22, "$90,000"],
      ["Justice Mann", <Titles value="Business Consultant" />, "Chicago", 24, "$133,000"],
      ["Addison Navarro", <Titles value="Business Management Analyst" />, "New York", 50, "$295,000"],
      ["Jesse Welch", <Titles value="Agency Legal Counsel" />, "Seattle", 28, "$200,000"],
      ["Eli Mejia", <Titles value="Commercial Specialist" />, "Long Beach", 65, "$400,000"],
      ["Gene Leblanc", <Titles value="Industrial Analyst" />, "Hartford", 34, "$110,000"],
      ["Danny Leon", <Titles value="Computer Scientist" />, "Newark", 60, "$220,000"],
      ["Lane Lee", <Titles value="Corporate Counselor" />, "Cincinnati", 52, "$180,000"],
      ["Jesse Hall", <Titles value="Business Analyst" />, "Baltimore", 44, "$99,000"],
      ["Danni Hudson", <Titles value="Agency Legal Counsel" />, "Tampa", 37, "$90,000"],
      ["Terry Macdonald", <Titles value="Commercial Specialist" />, "Miami", 39, "$140,000"],
      ["Justice Mccarthy", <Titles value="Attorney" />, "Tucson", 26, "$330,000"],
      ["Silver Carey", <Titles value="Computer Scientist" />, "Memphis", 47, "$250,000" ],
      ["Franky Miles", <Titles value="Industrial Analyst" />, "Buffalo", 49, "$190,000"],
      ["Glen Nixon", <Titles value="Corporate Counselor" />, "Arlington", 44, "$80,000"],
      ["Gabby Strickland", <Titles value="Business Process Consultant" />, "Scottsdale", 26, "$45,000"],
      ["Mason Ray", <Titles value="Computer Scientist" />, "San Francisco", 39, "$142,000"]
    ];


    const options = {
      filter: true,
      filterType: 'dropdown',
      responsive: 'stacked',
      styles: {
        table: {
          
          main: {
            root: {
            },
            responsiveScroll: {

            },
            responsiveStacked: {
            }
          },

          head: {

            row: {
            },
            
            cell: {
              root: {
              },
              sortLabel: {
              },
            }

          },
          body: {

            main: {

            },

            row: {
              root: {
              }
            },
            cell: {
              root: {
              }
            }

          },

        },
        toolbar: {
          root: {},
          spacer: {
          },
          actions: {
          },
          titleRoot: {
          },
          titleText: {
          },
          icon: {
            "&:hover": {
            },
          },
          iconActive: {
          },
          searchIcon: {
          },
        },
        filterView: {
        },
        filterList: {
          root: {
            color: "#000"
          },
          chip: {
            color: "#FEFEF0"
          },
        },
        pagination: {
          root: {
            border: "solid 1px #000"
          }
        },
        viewColumns: {

        },
        search: {
          main: {
          },
          searchIcon: {
          },
          searchText: {
          },
          clearIcon: {
          },          
        }
      }
    };

    return (
      <MUIDataTable title={"ACME Employee list"} data={data} columns={columns} options={options} />
    );

  }
}

ReactDOM.render(<Example />, document.getElementById("app-root"));
