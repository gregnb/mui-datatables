import React from "react";
import ReactDOM from "react-dom";
import MUIDataTable from "../src/";

class Example extends React.Component {

  state = {
    timer: 1
  };

  componentDidMount() {

    // setTimeout(() => {
    //   this.setState({ timer: this.state.timer + 1 });
    // }, 10000);

    // setTimeout(() => {
    //   this.setState({ timer: this.state.timer + 1 });
    // }, 20000);

    // setTimeout(() => {
    //   this.setState({ timer: this.state.timer + 1 });
    // }, 30000);

  }

  render() {

    const columns = ["First Name", "Company", "City", "State"];

    const data = [
     ["really long title to test", "row1-data2", "row1-data3", "row1-data4"],
     ["b", "row2-data2", "row2-data3", "row2-data4"],
     ["c", "row2-data2", "wwd-data3", "row2-data4"],
     ["d", "row2-w", "row2-data3", "row2-data4"],
     ["e", "row2-data2", "row2-w", "row2-data4"],
     ["really long title to test f", "w-data2", "row2-data3", "row2-data4"],
     ["g", "row2-data2", "wwd-data3", "row2-data4"],
     ["h", "row2-w", "row2-data3", "row2-data4"],
     ["i", "row2-data2", "row2-w", "row2-data4"],
     ["j", "w-data2", "row2-data3", "row2-data4"],
     ["k", "row2-data2", "wwd-data3", "row2-data4"],
     ["really long title to test l", "row2-w", "row2-data3", "row2-data4"],
     ["m", "row2-data2", "row2-w", "row2-data4"],
     ["n", "w-data2", "row2-data3", "row2-data4"],
     ["o", "row2-data2", "wwd-data3", "row2-data4"],
     ["p", "row2-w", "row2-data3", "row2-data4"],
     ["q", "row2-data2", "row2-w", "row2-data4"],
     ["r", "w-data2", "row2-data3", "really long title to test row2-data4"],
     ["s", "row2-data2", "wwd-data3", "row2-data4"],
     ["t", "row2-w", "row2-data3 really long title to test", "row2-data4"],
     ["u", "row2-data2", "row2-w", "row2-data4"],
     ["v", "w-data2", "row2-data3", "row2-data4"]
    ];

    // options: PropTypes.shape({
    //   sort: PropTypes.bool,
    //   filter: PropTypes.bool,
    //   filterType: PropTypes.oneOf(['dropdown', 'checkbox']),
    //   pagination: PropTypes.bool,
    //   rowHover: PropTypes.bool,
    //   rowsPerPage: PropTypes.number,
    //   rowsPerPageOptions: PropTypes.array,
    //   search: PropTypes.bool,
    //   print: PropTypes.bool,
    //   responsive: PropTypes.bool      
    // }),

    const options = {
      filter: true,
      filterType: 'checkbox',
      styles: {
        table: {
          
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
                color: "#FF0000"
              }
            },
            cell: {
              root: {
                color: "#000"
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
      <MUIDataTable data={data} columns={columns} timer={this.state.timer} options={options} />
    );

  }
}

export default Example;

ReactDOM.render(<Example />, document.getElementById("app-root"));
