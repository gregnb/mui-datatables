import React, {useState} from "react";
import ReactDOM from "react-dom";
import MUIDataTable from "../../src/";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function Example() {

  const [responsive, setResponsive] = useState("vertical");
  const [tableBodyHeight, setTableBodyHeight] = useState("400px");
  const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState("");
  const [transitionTime, setTransitionTime] = useState(300);
  const [selectableRows, setSelectableRows] = useState('none');

  const [treeData, setTreeData] = useState([
        { title: 'Chicken', children: [{ title: 'Egg' }] },
        { title: 'Fish', children: [{ title: 'fingerline'}] }
      ]);

  const columns = [{
    name: 'hidden',
    options: {
      display: 'excluded'
    }
  },"Name", "Title", "Location", {
    name: 'No Drag',
    options: {
      draggable: false,
    }
  }, "Phone"];

  const options = {
    filter: true,
    filterType: 'dropdown',
    responsive,
    tableBodyHeight,
    tableBodyMaxHeight,
    draggableColumns: {
      enabled: true,
      transitionTime
    },
    selectableRows: selectableRows,
  };

  const data = [
    ["1","Gabby George", "Business Analyst", "Minneapolis","1","555-1234"],
    ["1","Aiden Lloyd", "Business Consultant for an International Company and CEO of Tony's Burger Palace", "Dallas","2","555-1234"],
    ["1","Jaden Collins", "Attorney", "Santa Ana","1","555-5555"],
    ["1","Franky Rees", "Business Analyst", "St. Petersburg","1","555-3333"],
    ["1","Aaren Rose", null, "Toledo","1","555-4444"],
    ["1","Johnny Jones", "Business Analyst", "St. Petersburg","3","555-2468"],
    ["1","Jimmy Johns", "Business Analyst", "Baltimore","1","555-1357"],
    ["1","Jack Jackson", "Business Analyst", "El Paso","1","555-4321"],
    ["1","Joe Jones", "Computer Programmer", "El Paso","1","555-4321"],
    ["1","Jacky Jackson", "Business Consultant", "Baltimore","4","555-1234"],
    ["1","Jo Jo", "Software Developer", "Washington DC","4","555-1122"],
    ["1","Donna Marie", "Business Manager", "Annapolis","5","555-5555"],

  ];

  return (
    <>
      <FormControl>
        <InputLabel id="demo-simple-select-label">Responsive Option</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={responsive}
          style={{width:'200px', marginBottom:'10px', marginRight:10}}
          onChange={(e) => setResponsive(e.target.value)}
        >
          <MenuItem value={"vertical"}>vertical</MenuItem>
          <MenuItem value={"standard"}>standard</MenuItem>
          <MenuItem value={"simple"}>simple</MenuItem>

          <MenuItem value={"scroll"}>scroll (deprecated)</MenuItem>
          <MenuItem value={"scrollMaxHeight"}>scrollMaxHeight (deprecated)</MenuItem>
          <MenuItem value={"stacked"}>stacked (deprecated)</MenuItem>
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel id="demo-simple-select-label">Table Body Height</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={tableBodyHeight}
          style={{width:'200px', marginBottom:'10px', marginRight:10}}
          onChange={(e) => setTableBodyHeight(e.target.value)}
        >
          <MenuItem value={""}>[blank]</MenuItem>
          <MenuItem value={"400px"}>400px</MenuItem>
          <MenuItem value={"800px"}>800px</MenuItem>
          <MenuItem value={"100%"}>100%</MenuItem>
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel id="demo-simple-select-label">Max Table Body Height</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={tableBodyMaxHeight}
          style={{width:'200px', marginBottom:'10px',marginRight:10}}
          onChange={(e) => setTableBodyMaxHeight(e.target.value)}
        >
          <MenuItem value={""}>[blank]</MenuItem>
          <MenuItem value={"400px"}>400px</MenuItem>
          <MenuItem value={"800px"}>800px</MenuItem>
          <MenuItem value={"100%"}>100%</MenuItem>
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel id="demo-simple-select-label">Selectable Rows:</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectableRows}
          style={{width:'200px', marginBottom:'10px',marginRight:10}}
          onChange={(e) => setSelectableRows(e.target.value)}
        >
          <MenuItem value={"none"}>none</MenuItem>
          <MenuItem value={"single"}>single</MenuItem>
          <MenuItem value={"multiple"}>multiple</MenuItem>
        </Select>
      </FormControl>
      <FormControl>
        <TextField label="Transition Time" type="number" value={transitionTime} onChange={(e) => setTransitionTime(e.target.value)} />
      </FormControl>
      <MUIDataTable title={"ACME Employee list"} data={data} columns={columns} options={options} />
    </>
  );
}

export default Example;