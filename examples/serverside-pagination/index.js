import React from "react";
import ReactDOM from "react-dom";
import { CircularProgress, Typography } from '@material-ui/core';
import MUIDataTable from "../../src/";

class Example extends React.Component {

  state = {
    page: 0,
    count: 1,
    data: [["Loading Data..."]],
    isLoading: false
  };

  componentDidMount() {
    this.getData();
  }

  // get data
  getData = () => {
    this.setState({ isLoading: true });
    this.xhrRequest().then(res => {
      this.setState({ data: res.data, isLoading: false, count: res.total });
    });
  }

  // mock async function
  xhrRequest = () => {

    return new Promise((resolve, reject) => {
      const total = 124;  // mock record count from server
      // mock page data
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
        resolve({
          data, total
        });
      }, 2500);

    });

  }

  changePage = (page) => {
    this.setState({
      isLoading: true,
    });
    this.xhrRequest(`/myApiServer?page=${page}`).then(res => {
      this.setState({
        isLoading: false,
        page: page,
        data: res.data,
        count: res.total,
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
        <MUIDataTable title={<Typography variant="title">
          ACME Employee list
          {isLoading && <CircularProgress size={24} style={{marginLeft: 15, position: 'relative', top: 4}} />}
          </Typography>
          } data={data} columns={columns} options={options} />
      </div>
    );

  }
}

export default Example;
