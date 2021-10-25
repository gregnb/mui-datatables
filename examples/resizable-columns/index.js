import React, { useState } from "react";
import ReactDOM from "react-dom";
import MUIDataTable from "../../src/";

import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

function Example(props) {

  const [marginLeft, setMarginLeft] = useState(10);
  const [selectableRows, setSelectableRows] = useState("multiple");

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
    selectableRows: selectableRows,
    draggableColumns: {
      enabled: true,
    }
  };

  return (
    <>
      <FormGroup row>
        <FormControl>
          <TextField label="Left Margin" type="number" value={marginLeft} onChange={(e) => setMarginLeft(e.target.value)} />
        </FormControl>
        <FormControlLabel
          control={
            <Switch
              checked={selectableRows === "multiple"}
              onChange={(e) => setSelectableRows(event.target.checked ? "multiple" : "none")}
              value="true"
              color="primary"
            />
          }
          label="Selectable Rows"
        />
      </FormGroup>
      <div style={{marginLeft: marginLeft + 'px'}}>
        <MUIDataTable title={"ACME Employee list" + " [" + counter + "]"} data={data} columns={columns} options={options} />
        <div>
          <MUIDataTable title={"ACME Employee list"} data={data} columns={columns} options={options} />
        </div>
        <MUIDataTable title={"ACME Employee list"} data={data} columns={columns} options={options} />
      </div>
    </>
  );
}

export default Example;
