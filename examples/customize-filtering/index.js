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
          customBodyRender: (x) => new Date(x).toISOString(),
          customFilterValueRender: (columnValue) => <b>{new Date(columnValue).toISOString()}</b>,
          customFilterFn: (filterValue, columnValue) => {
            return new Date(filterValue).getTime() >= new Date(columnValue).getTime();
          },
          customFilterRender: (column, index, onChange, className) =>
            (
              <TextField
                id={column.name}
                key={column.name}
                label={column.name}
                className={className}
                type="date"
                defaultValue="1995-05-09"
                InputLabelProps={{
                  shrink: true,
                }}
                /* DO NOT FORGET TO CALL THE `onFilterUpdate` METHOD! */
                onChange={(e) => onChange(index, e.target.value, "dropdown")}
              />
            ),
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
