import React from "react";
import ReactDOM from "react-dom";
import MUIDataTable from "../../src/";
import data from "./data";

class Example extends React.Component {
  render() {

    const columns = ["Name", "Title", "Location", "State", "Company", "Age", "Employed"];

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
