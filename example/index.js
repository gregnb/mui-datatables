import React from "react";
import ReactDOM from "react-dom";
import MUIDataTable from "../src/";
import Titles from "./titles";
import tableData from "./data.json";

class Example extends React.Component {
  state = {
    data: tableData.data
  }
  
  changeTitle = (value, index) => {
    let data = this.state.data;
    data[index][1] = value;
    this.setState({
      data: data
    });
  }
  
  getData = () => this.state.data.map((row, index) => [
    row[0],
    <Titles value={row[1]} index={index} change={this.changeTitle} />,
    row[2],
    row[3],
    row[4]
  ])

  render() {
    return (
      <MUIDataTable
        title={"ACME Employee list"}
        data={this.getData()}
        columns={tableData.columns}
        options={tableData.options}
      />
    );

  }
}

ReactDOM.render(<Example />, document.getElementById("app-root"));
