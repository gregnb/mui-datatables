import React from "react";
import ReactDOM from "react-dom";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import MUIDataTable from "../../src/";

const getMuiTheme = () => createMuiTheme({
  overrides: {
    MUIDataTableBodyRow: {
      hover: {
        '&:hover': {
          backgroundColor: '#dcdcdc !important'
        }
      },
      highlight: {
        backgroundColor: '#dcdcdc'
      }
    }
  }
});

class Example extends React.Component {

  render() {

    const columns = ["Name", "Title", "Location"];

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
      responsive: 'stacked',
      rowsHighlighted: [0, 3],
      onRowMouseEnter: (rowData, rowState) => {
        console.log(`Highlight ${rowData[0]}`);
      },
      onRowMouseLeave: (rowData, rowState) => {
        console.log(`Remove highlight ${rowData[0]}`);
      },
    };

    return (
      <MuiThemeProvider theme={getMuiTheme()}>
        <MUIDataTable title={"ACME Employee list"} data={data} columns={columns} options={options} />
      </MuiThemeProvider>
    );

  }
}

ReactDOM.render(<Example />, document.getElementById("app-root"));
