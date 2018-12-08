import React from "react";
import ReactDOM from "react-dom";
import MUIDataTable from "../../src/";
import TextField from "@material-ui/core/TextField";

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
          customFilterValueRender: (filterValue) => {
            return <b>{new Date(filterValue).toISOString().split('T')[0]}</b>;
          },
          customFilterFn: (filterValues, columnValue) => {
            return new Date(filterValues[0]).getTime() >= new Date(columnValue).getTime();
          },
          customFilterRender: (filterValues, onChange, className) => {
            return (
              <TextField
                id="Birthday"
                key="Birthday"
                label="Birthday"
                className={className}
                type="date"
                value={filterValues[0] || "1995-05-01"}
                InputLabelProps={{
                  shrink: true,
                }}
                /* DO NOT FORGET TO CALL THE `onChange` METHOD! */
                /* TYPE MULTISELECT MUST RETURN AN ARRAY!! */
                onChange={(e) => onChange([e.target.value])}
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
      filterType: 'multiselect',
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
