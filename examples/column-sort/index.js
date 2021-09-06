import React from "react";
import ReactDOM from "react-dom";
import { Chip } from "@mui/material";
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
        options: {
          /*
            In this case, age is a string, but we want to compare it as if it was a number.
            If you comment out the sortCompare method, you'll see how sorting as a string
            is different than sorting as a number. Typically an age field would be a number
            so we wouldn't need to write a function like this. But the sortCompare is available
            if you run into a situation like this.
          */
          sortCompare: (order) => {
            return (obj1, obj2) => {
              console.log(order);
              let val1 = parseInt(obj1.data, 10);
              let val2 = parseInt(obj2.data, 10);
              return (val1 - val2) * (order === 'asc' ? 1 : -1);
            };
          }
        }
      },
      {
        name: "Hobbies",
        options: {
          sortCompare: (order) =>
            ({ data: hobbyList1 }, { data: hobbyList2 }) =>
              (hobbyList1.length - hobbyList2.length) * (order === 'asc' ? 1 : -1),
          hint: 'Sort by amount of hobbies',
          customBodyRender: hobbies => hobbies.map((hobby, index) => <Chip key={index} label={hobby} />)
        }
      }
    ];
    const data = [
      ["Gabby George", "Business Analyst", "30", ["Sports"]],
      ["Business Analyst", "Business Consultant", "55", ["Water Polo"]],
      ["Jaden Collins", "Attorney", "27", ["Sports", "TV"]],
      ["Franky Rees", "Business Analyst", "22", ["Baking", "Hiking"]],
      ["Aaren Rose", "Business Consultant", "28", ["Hiking"]],
      ["Blake Duncan", "Business Management Analyst", "65", ["Sprots", "Cooking", "Baking"]],
      ["Frankie Parry", "Agency Legal Counsel", "71", []],
      ["Lane Wilson", "Commercial Specialist", "19", ["Cooking"]],
      ["Robin Duncan", "Business Analyst", "20", ["Acting"]],
      ["Mel Brooks", "Business Consultant", "37", ["Puzzles", "Sewing"]],
      ["Harper White", "Attorney", "52", ["Fising"]],
      ["Kris Humphrey", "Agency Legal Counsel", "30", []],
      ["Frankie Long", "Industrial Analyst", "31", []],
      ["Brynn Robbins", "Business Analyst", "22", ["Fishing", "Hiking"]],
      ["Justice Mann", "Business Consultant", "24", ["Footbal"]],
      ["JoJo", "Business Consultant", "2", ["Sleeping"]],
      ["Bobby Smith", "Business Consultant", "3", []],
      ["Addison Navarro", "Business Management Analyst", "50", ["Photography"]]
    ];

    const options = {
      filter: true,
      filterType: 'dropdown',
      responsive: 'vertical',
      rowsPerPage: 50,
      rowsPerPageOptions: [50],
    };

    return (
      <MUIDataTable title={"ACME Employee list"} data={data} columns={columns} options={options} />
    );

  }
}

export default Example;
