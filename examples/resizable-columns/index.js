import React from "react";
import ReactDOM from "react-dom";
import MUIDataTable from "../../src/";

class Example extends React.Component {

  constructor(props) {
    super(props);

    this.state = { counter: 1 };
  }

  // We update an arbitrary value here to test table resizing on state updates
  update = () => {
    let { counter } = this.state;
    counter += 1;

    this.setState({ counter });
  };

  render() {
    const { counter } = this.state;

    const columns = [
      {
        name: "Counter",
        options: {
          empty: true,
          customBodyRender: value => <button onClick={this.update}>+</button>
        }
      },
      {
        name: "Name",
        options: {
          sort: false,
          hint: "?"
        }
      },
      {
        name: "Title",
        options: {
          hint: "?"
        }
      },
      "Location"
    ];

    const data = [
      ["Gabby George", "Business Analyst", "Minneapolis"],
      ["Aiden Lloyd", "Business Consultant", "Dallas"],
      ["Jaden Collins", "Attorney", "Santa Ana"],
      ["Franky Rees", "Business Analyst", "St. Petersburg"],
      ["Aaren Rose", null, "Toledo"]
    ];


    const options = {
      filter: true,
      filterType: 'dropdown',
      resizableColumns: true
    };

    return (
      <MUIDataTable title={"ACME Employee list" + " [" + counter + "]"} data={data} columns={columns} options={options} />
    );

  }
}

export default Example;
