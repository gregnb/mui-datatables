import React, { useState } from 'react';
import MUIDataTable from '../../src/';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function Example() {
  const [responsive, setResponsive] = useState('vertical');
  const [tableBodyHeight, setTableBodyHeight] = useState('400px');
  const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState('');
  const [searchBtn, setSearchBtn] = useState(true);
  const [downloadBtn, setDownloadBtn] = useState(true);
  const [printBtn, setPrintBtn] = useState(true);
  const [viewColumnBtn, setViewColumnBtn] = useState(true);
  const [filterBtn, setFilterBtn] = useState(true);

  const columns = [{ name: 'Name', options: { filterOptions: { fullWidth: true } } }, 'Title', 'Location'];

  const options = {
    search: searchBtn,
    download: downloadBtn,
    print: printBtn,
    viewColumns: viewColumnBtn,
    filter: filterBtn,
    filterType: 'dropdown',
    responsive,
    tableBodyHeight,
    tableBodyMaxHeight,
    onTableChange: (action, state) => {
      console.log(action);
      console.dir(state);
    },
  };

  const data = [
    ['Gabby George', 'Business Analyst', 'Minneapolis'],
    ['Aiden Lloyd', "Business Consultant for an International Company and CEO of Tony's Burger Palace", 'Dallas'],
    ['Jaden Collins', 'Attorney', 'Santa Ana'],
    ['Franky Rees', 'Business Analyst', 'St. Petersburg'],
    ['Aaren Rose', null, 'Toledo'],
    ['Johnny Jones', 'Business Analyst', 'St. Petersburg'],
    ['Jimmy Johns', 'Business Analyst', 'Baltimore'],
    ['Jack Jackson', 'Business Analyst', 'El Paso'],
    ['Joe Jones', 'Computer Programmer', 'El Paso'],
    ['Jacky Jackson', 'Business Consultant', 'Baltimore'],
    ['Jo Jo', 'Software Developer', 'Washington DC'],
    ['Donna Marie', 'Business Manager', 'Annapolis'],
  ];

  return (
    <React.Fragment>
      <FormControl>
        <InputLabel id="demo-simple-select-label">Responsive Option</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={responsive}
          style={{ width: '200px', marginBottom: '10px', marginRight: 10 }}
          onChange={e => setResponsive(e.target.value)}>
          <MenuItem value={'vertical'}>vertical</MenuItem>
          <MenuItem value={'standard'}>standard</MenuItem>
          <MenuItem value={'simple'}>simple</MenuItem>

          <MenuItem value={'scroll'}>scroll (deprecated)</MenuItem>
          <MenuItem value={'scrollMaxHeight'}>scrollMaxHeight (deprecated)</MenuItem>
          <MenuItem value={'stacked'}>stacked (deprecated)</MenuItem>
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel id="demo-simple-select-label">Table Body Height</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={tableBodyHeight}
          style={{ width: '200px', marginBottom: '10px', marginRight: 10 }}
          onChange={e => setTableBodyHeight(e.target.value)}>
          <MenuItem value={''}>[blank]</MenuItem>
          <MenuItem value={'400px'}>400px</MenuItem>
          <MenuItem value={'800px'}>800px</MenuItem>
          <MenuItem value={'100%'}>100%</MenuItem>
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel id="demo-simple-select-label">Max Table Body Height</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={tableBodyMaxHeight}
          style={{ width: '200px', marginBottom: '10px' }}
          onChange={e => setTableBodyMaxHeight(e.target.value)}>
          <MenuItem value={''}>[blank]</MenuItem>
          <MenuItem value={'400px'}>400px</MenuItem>
          <MenuItem value={'800px'}>800px</MenuItem>
          <MenuItem value={'100%'}>100%</MenuItem>
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel id="demo-simple-select-label">Search Button</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={searchBtn}
          style={{ width: '200px', marginBottom: '10px' }}
          onChange={e => setSearchBtn(e.target.value)}>
          <MenuItem value={'true'}>{'true'}</MenuItem>
          <MenuItem value={'false'}>{'false'}</MenuItem>
          <MenuItem value={'disabled'}>disabled</MenuItem>
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel id="demo-simple-select-label">Download Button</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={downloadBtn}
          style={{ width: '200px', marginBottom: '10px' }}
          onChange={e => setDownloadBtn(e.target.value)}>
          <MenuItem value={'true'}>{'true'}</MenuItem>
          <MenuItem value={'false'}>{'false'}</MenuItem>
          <MenuItem value={'disabled'}>disabled</MenuItem>
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel id="demo-simple-select-label">Print Button</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={printBtn}
          style={{ width: '200px', marginBottom: '10px' }}
          onChange={e => setPrintBtn(e.target.value)}>
          <MenuItem value={'true'}>{'true'}</MenuItem>
          <MenuItem value={'false'}>{'false'}</MenuItem>
          <MenuItem value={'disabled'}>disabled</MenuItem>
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel id="demo-simple-select-label">View Column Button</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={viewColumnBtn}
          style={{ width: '200px', marginBottom: '10px' }}
          onChange={e => setViewColumnBtn(e.target.value)}>
          <MenuItem value={'true'}>{'true'}</MenuItem>
          <MenuItem value={'false'}>{'false'}</MenuItem>
          <MenuItem value={'disabled'}>disabled</MenuItem>
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel id="demo-simple-select-label">Filter Button</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={filterBtn}
          style={{ width: '200px', marginBottom: '10px' }}
          onChange={e => setFilterBtn(e.target.value)}>
          <MenuItem value={'true'}>{'true'}</MenuItem>
          <MenuItem value={'false'}>{'false'}</MenuItem>
          <MenuItem value={'disabled'}>disabled</MenuItem>
        </Select>
      </FormControl>
      <MUIDataTable title={'ACME Employee list'} data={data} columns={columns} options={options} />
    </React.Fragment>
  );
}

export default Example;
