import React, { useState } from "react";
import ReactDOM from "react-dom";
import MUIDataTable from "../../src/";

import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

function Example(props) {

  const [marginLeft, setMarginLeft] = useState(200);

  const [counter, setCounter] = useState(1);
  const incrCount = () => { // We update an arbitrary value here to test table resizing on state updates
    setCounter(counter + 1);
  };

  const columns = [
    {
      name: "Counter",
      options: {
        empty: true,
        customBodyRender: value => <button onClick={incrCount}>+</button>
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
      name: "Business Title",
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
    resizableColumns: true,
  };

  return (
    <>
      <FormControl>
        <TextField label="Left Margin" type="number" value={marginLeft} onChange={(e) => setMarginLeft(e.target.value)} />
      </FormControl>
      <div style={{marginLeft: marginLeft + 'px'}}>
        <MUIDataTable title={"ACME Employee list" + " [" + counter + "]"} data={data} columns={columns} options={options} />
      </div>
    </>
  );
}

export default Example;
