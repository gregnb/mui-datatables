import React from "react";
import ReactDOM from "react-dom";
import { CircularProgress } from '@material-ui/core';
import MUIDataTable from "../../src/";

class Example extends React.Component {

  state = {
    page: 0,
    count: 100,
    data: [["Loading Data..."]],
    isLoading: false
  };

  componentDidMount() {
    this.getData();
  }

  // get data
  getData = () => {
    this.setState({ isLoading: true });
    this.xhrRequest().then(data => {
      this.setState({ data, isLoading: false });
    });
  }

  // mock async function
  xhrRequest = () => {

    return new Promise((resolve, reject) => {
      const srcData = [
        ["Gabby George", "Business Analyst", "Minneapolis"],
        ["Aiden Lloyd", "Business Consultant", "Dallas"],
        ["Jaden Collins", "Attorney", "Santa Ana"],
        ["Franky Rees", "Business Analyst", "St. Petersburg"],
        ["Aaren Rose", "Business Analyst", "Toledo"]
      ];

      const maxRound =  Math.floor(Math.random() * 2) + 1;
      const data = [...Array(maxRound)].reduce(acc => acc.push(...srcData) && acc, []);
      data.sort((a, b) => 0.5 - Math.random());

      setTimeout(() => {
        resolve(data);
      }, 2500);

    });

  }

  changePage = (page) => {
    this.xhrRequest(`/myApiServer?page=${page}`).then(data => {
      this.setState({
        page: page,
        data
      });
    });
  };

  render() {

    const columns = ["Name", "Title", "Location"];
    const { data, page, count, isLoading } = this.state;

    const options = {
      filter: true,
      filterType: 'dropdown',
      responsive: 'stacked',
      serverSide: true,
      count: count,
      page: page,
      onTableChange: (action, tableState) => {

        console.log(action, tableState);
        // a developer could react to change on an action basis or
        // examine the state as a whole and do whatever they want

        switch (action) {
          case 'changePage':
            this.changePage(tableState.page);
            break;
        }
      }
    };

    return (
      <div>
        {isLoading && <CircularProgress style={{ marginLeft: '50%' }} />}
        <MUIDataTable title={"ACME Employee list"} data={data} columns={columns} options={options} />
      </div>
    );

  }
}

ReactDOM.render(<Example />, document.getElementById("app-root"));
