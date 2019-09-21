import React from "react";
import ReactDOM from "react-dom";
import { Chip } from "@material-ui/core";
import MUIDataTable from "../../src/";

class Example extends React.Component {

  render() {

    const columns = [
      {
        name: "Name",
      },
      {
        name: "Title",
      },
      {
        name: "Age",
      },
      {
        name: "Hobbies",
        options: {
          sortFn: (order) =>
            ({ data: hobbyList1 }, { data: hobbyList2 }) =>
              (hobbyList1.length - hobbyList2.length) * (order === 'asc' ? 1 : -1),
          hint: 'Sort by amount of hobbies',
          customBodyRender: hobbies => hobbies.map((hobby, index) => <Chip key={index} label={hobby} />)
        }
      }
    ];
    const data = [
      ["Gabby George", "Business Analyst", 30, ["Sports"]],
      ["Business Analyst", "Business Consultant", 55, ["Water Polo"]],
      ["Jaden Collins", "Attorney", 27, ["Sports", "TV"]],
      ["Franky Rees", "Business Analyst", 22, ["Baking", "Hiking"]],
      ["Aaren Rose", "Business Consultant", 28, ["Hiking"]],
      ["Blake Duncan", "Business Management Analyst", 65, ["Sprots", "Cooking", "Baking"]],
      ["Frankie Parry", "Agency Legal Counsel", 71, []],
      ["Lane Wilson", "Commercial Specialist", 19, ["Cooking"]],
      ["Robin Duncan", "Business Analyst", 20, ["Acting"]],
      ["Mel Brooks", "Business Consultant", 37, ["Puzzles", "Sewing"]],
      ["Harper White", "Attorney", 52, ["Fising"]],
      ["Kris Humphrey", "Agency Legal Counsel", 30, []],
      ["Frankie Long", "Industrial Analyst", 31, []],
      ["Brynn Robbins", "Business Analyst", 22, ["Fishing", "Hiking"]],
      ["Justice Mann", "Business Consultant", 24, ["Footbal"]],
      ["Addison Navarro", "Business Management Analyst", 50, ["Photography"]]
    ];

    const options = {
      filter: true,
      filterType: 'dropdown',
      responsive: 'stacked',
      rowsPerPage: 50,
    };

    return (
      <MUIDataTable title={"ACME Employee list"} data={data} columns={columns} options={options} />
    );

  }
}

export default Example;
