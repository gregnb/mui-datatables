import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import MUIDataTable from '../../src/';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

function Example() {
  const [responsive, setResponsive] = useState('vertical');
  const [tableBodyHeight, setTableBodyHeight] = useState('400px');
  const [tableBodyMaxHeight, setTableBodyMaxHeight] = useState('');

  const columns = [
    {
      name: 'name',
      label: 'Name',
      options: {
        setCellHeaderProps: () => ({
          style: {
            width: '25%'
          }
        }),
      }
    }, 
    {
      name: 'title',
      label: 'Title',
      options: {
        setCellHeaderProps: () => ({
          style: {
            width: '25%'
          }
        }),
      }
    }, 
    {
      name: 'location',
      label: 'Location',
      options: {
        setCellHeaderProps: () => ({
          style: {
            width: '25%'
          }
        }),
      }
    }, 
    {
      name: 'gender',
      label: 'Gender'
    }
  ];

  const options = {
    filter: true,
    filterType: 'dropdown',
    responsive,
    pagination: false,
    draggableColumns: {
      enabled: true,
    },
    onTableChange: (action, state) => {
      console.log(action);
      //console.dir(state);
    },
    onGroupExpansionChange: (group, expanded) => {
      console.dir(group);
      console.dir(expanded);
    },
    grouping: {
      columnIndexes: [1, 3],
      expanded: {
        "Business Consultant": {
          open: true
        }
      }
    }
  };

  const data = [
    ['Gabby George', 'Business Analyst', 'Minneapolis', 'female'],
    ['Aiden Lloyd', "Business Consultant", 'Dallas', 'male'],
    ['Jaden Collins', 'Attorney', 'Santa Ana', 'male'],
    ['Franky Rees', 'Business Analyst', 'St. Petersburg', 'male'],
    ['Aaren Rose', null, 'Toledo', 'male'],
    ['Johnny Jones', 'Business Analyst', 'St. Petersburg', 'male'],
    ['Jimmy Johns', 'Business Analyst', 'Baltimore', 'male'],
    ['Jack Jackson', 'Business Analyst', 'El Paso', 'male'],
    ['Joe Jones', 'Computer Programmer', 'El Paso', 'male'],
    ['Jacky Jackson', 'Business Consultant', 'Baltimore', 'female'],
    ['Jo Jo', 'Software Developer', 'Washington DC', 'male'],
    ['Donna Marie', 'Business Manager', 'Annapolis', 'female'],
    ['Armin Tamzarian', 'Principal', 'Springfield', 'male'],
    ['Gerald Strickland', 'Principal', 'Hill Valley', 'male'],
    ['Doc Brown', 'Computer Programmer', 'Hill Valley', 'male'],
    ['Angela Li', 'Principal', 'Lawndale', 'female'],
    ['Jake Morgendorffer', 'Business Analyst', 'Lawndale', 'male'],
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
      <MUIDataTable title={'ACME Employee list'} data={data} columns={columns} options={options} />
    </React.Fragment>
  );
}

export default Example;
