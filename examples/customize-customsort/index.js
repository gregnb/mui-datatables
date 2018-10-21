import React from "react";
import ReactDOM from "react-dom";
import MUIDataTable from "../../src/";

class Example extends React.Component {

  render() {

    const columns = ["Name", "SurveyScore", "Date"];

    const data = [
      ["Gabby George", 3, "2018-07-06T23:58:59.000Z"],
      ["Aiden Lloyd", 10, "2018-07-06T23:58:53.000Z"],
      ["Jaden Collins", 3, "2018-07-06T23:55:51.000Z"],
      ["Franky Rees", 3, "2018-07-06T22:47:56.000Z"],
      ["Aaren Rose", 8, "2018-07-06T21:59:20.000Z"]
    ];

    const options = {
      filter: true,
      filterType: 'dropdown',
      responsive: 'stacked',
      customSort: (data, col, order) => {
        // The index of the primary sort key, ie: the column that was clicked
        const primarySortColumn = col;
        // The index of the secondary sort key, ie: the "date" column
        const secondarySortColumn = columns.findIndex((columnName) => columnName == 'date');
        return data.sort((a, b) => {
          if (a.data[primarySortColumn] === null) a.data[primarySortColumn] = '';
          if (b.data[primarySortColumn] === null) b.data[primarySortColumn] = '';
          // default sorting by column values.
          let val_1 = a.data[primarySortColumn],
            val_2 = b.data[primarySortColumn],
            // added in custom sorting of another column
            date_1 = a.data[secondarySortColumn],
            date_2 = b.data[secondarySortColumn];
          return (
            (val_1 < val_2
              ? -1
              : val_1 > val_2
                ? 1
                : date_1 < date_2
                  ? -1
                  : date_1 > date_2
                    ? 1
                    : 0) * (order === 'asc' ? -1 : 1)
          )
        })
      }
    };

    return (
      <MUIDataTable title={"Survey Scores"} data={data} columns={columns} options={options} />
    );

  }
}

ReactDOM.render(<Example />, document.getElementById("app-root"));