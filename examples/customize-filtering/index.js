import React from "react";
import ReactDOM from "react-dom";
import MUIDataTable from "../../src/";
import TextField from "@material-ui/core/TextField";

/**
 * Get the filter value text from the react element
 */
function getFilterValueFromReactElement(input) {
  return input ? input.props.children : undefined;
}

class Example extends React.Component {

  render() {

    const columns = [
      {
        name: "Name",
        options: {
          filter: false,
          sort: true,
        }
      },
      {
        name: "Birthday",
        options: {
          filter: true,
          sort: true,
          customBodyRender: (x) => <b>{new Date(x).toISOString()}</b>,
          customFilterValueRender: (columnValue) => {
            // If we return a ReactComponent instead of a string here,
            // we need to extract the value in the customFilterRender and customFilterFn
            return <b>{new Date(columnValue).toISOString().split('T')[0]}</b>;
          },
          customFilterFn: (filterValue, columnValue) => {
            if(!filterValue) return false;

            const date = getFilterValueFromReactElement(filterValue);
            return new Date(date).getTime() >= new Date(columnValue).getTime();
          },
          customFilterRender: (filterValue, onChange, className) => {
            const date = getFilterValueFromReactElement(filterValue) || "1995-05-01";

            return (
              <TextField
                id="Birthday"
                key="Birthday"
                label="Birthday"
                className={className}
                type="date"
                value={date}
                InputLabelProps={{
                  shrink: true,
                }}
                /* DO NOT FORGET TO CALL THE `onChange` METHOD! */
                onChange={(e) => onChange(e.target.value)}
              />
            );
          },
        }
      },
      {
        name: "Company",
        options: {
          filter: true,
          sort: false,
        }
      },
      {
        name: "City",
        options: {
          filter: true,
          sort: false,
        }
      },
      {
        name: "State",
        options: {
          filter: true,
          sort: false,
        }
      },
    ];

    const data = [
      ["Joe James", 1543941056517, "Test Corp", "Yonkers", "NY"],
      ["John Walsh", 1503541556517, "Test Corp", "Hartford", "CT"],
      ["Bob Herm", 1000041556517, "Test Corp", "Tampa", "FL"],
      ["James Houston", 800041556517, "Test Corp", "Dallas", "TX"],
    ];

    const options = {
      filter: true,
      filterType: 'dropdown',
      responsive: 'stacked',
      customSort: (data, colIndex, order) => {
        return data.sort((a, b) => {
          return a.data[colIndex].length > b.data[colIndex].length * (order === "asc" ? -1 : 1);
        });
      }
    };

    return (
      <MUIDataTable title={"Survey Scores"} data={data} columns={columns} options={options}/>
    );

  }
}

ReactDOM.render(<Example/>, document.getElementById("app-root"));
