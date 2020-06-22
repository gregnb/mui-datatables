import React, { useState } from "react";
import ReactDOM from "react-dom";
import MUIDataTable from "../../src/";

import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

function Example(props) {

  const [marginLeft, setMarginLeft] = useState(10);

  const [counter, setCounter] = useState(1);
  const incrCount = () => { // We update an arbitrary value here to test table resizing on state updates
    setCounter(counter + 1);
  };

  const columns = [
    {
      name: "Counter",
      options: {
        sort: false,
        empty: true,
        customBodyRender: value => <button onClick={incrCount}>+</button>
      }
    },
    {
      name: "Name",
      options: {
        hint: "?",
        setCellProps: () => ({style: {whiteSpace:'nowrap'}})
      }
    },
    {
      name: "Business Title",
      options: {
        hint: "?",
        customBodyRender: (val) => {
          let parentStyle = {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            boxSizing: 'border-box',
            display: 'block',
            width: '100%',
          };
          let cellStyle = {
            boxSizing: 'border-box',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          };
          return (
            <div style={{position:'relative', height: '20px'}}>
              <div style={parentStyle}>
                <div style={cellStyle}>
                  {val}
                </div>
              </div>
            </div>
          );
        }
      }
    },
    "Location"
  ];

  const data = [
    ["Gabby George ", "Business Analyst", "Minneapolis"],
    ["Aiden Lloyd", "Business Consultant at Tony's Burger Palace and CEO of Johnny's Blueberry Sundaes", "Dallas"],
    ["Jaden Collins", "Attorney", "Santa Ana"],
    ["Franky Rees", "Business Analyst", "St. Petersburg"],
    ["Aaren Rose", null, "Toledo"]
  ];

  const options = {
    filter: true,
    filterType: 'dropdown',
    resizableColumns: true,
    draggableColumns: {
      enabled: true,
    }
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
