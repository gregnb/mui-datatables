import React from "react";
import ReactDOM from "react-dom";
import MUIDataTable from "../../src/";

class Example extends React.Component {

  state = {
    counter: 0,
    data: [
        ["Gabby George", "Business Analyst", "Minneapolis"],
        ["Aiden Lloyd", "Business Consultant", "Dallas"],
        ["Jaden Collins", "Attorney", "Santa Ana"],
        ["Franky Rees", "Business Analyst", "St. Petersburg"],
        ["Aaren Rose", null, "Toledo"]
      ]
  }

  rerender = () => {
    this.setState((prevState, props) => ({
      counter: prevState.counter + 1
    })); 
  }

  render() {

    const columns = ["Name", "Title", "Location"];

    const options = {
      filter: true,
      filterType: 'dropdown',
      responsive: 'stacked',
    };

    return (
      <React.Fragment>
        <button onClick={this.rerender}>Re-render - {this.state.counter}</button>
        <MUIDataTable title={"ACME Employee list"} data={this.state.data} columns={columns} options={options} />
      </React.Fragment>
    );

  }
}

export default Example;