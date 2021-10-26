import React, { useState } from "react";
import ReactDOM from "react-dom";
import MUIDataTable from "../../src";
import Chip from '@mui/material/Chip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

function Example() {
  // const allTags = ['leave-message', 'frequently-busy', 'nice', 'grumpy', 'in-person', 'preferred', 'second-choice'];
  const [filterArrayFullMatch, setFilterArrayFullMatch] = useState(true);

  const columns = [
    {
      name: "Name",
      options: {
        filter: true,
        display: 'excluded',
      }
    },
    {
      label: "Modified Title Label",
      name: "Title",
      options: {
        filter: true,
      }
    },
    {
      name: "Location",
      options: {
        print: false,
        filter: false,
      }
    },
    {
      name: "Age",
      options: {
        filter: true,
        print: false,
      }
    },
    {
      name: "Salary",
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'Tags',
      options: {
        filter: true,
        filterType: 'multiselect',
        customBodyRenderLite: (dataIndex) => {
          let value = data[dataIndex][5];
          return value.map((val, key) => {
            return <Chip label={val} key={key} />;
          });
        },
      }
    },
  ];


  const data = [
    ["Gabby George", "Business Analyst", "Minneapolis", 30, "$100,000", ['nice', 'preferred']],
    ["Aiden Lloyd", "Business Consultant", "Dallas", 55, "$200,000", ['grumpy', 'second-choice']],
    ["Jaden Collins", "Attorney", "Santa Ana", 27, "$500,000", ['frequently-busy', 'leave-message']],
    ["Franky Rees", "Business Analyst", "St. Petersburg", 22, "$50,000", ['in-person', 'nice']],
    ["Aaren Rose", "Business Consultant", "Toledo", 28, "$75,000", ['preferred']],
    ["Blake Duncan", "Business Management Analyst", "San Diego", 65, "$94,000", ['nice']],
    ["Frankie Parry", "Agency Legal Counsel", "Jacksonville", 71, "$210,000", ['nice', 'preferred']],
    ["Lane Wilson", "Commercial Specialist", "Omaha", 19, "$65,000", ['frequently-busy', 'leave-message']],
    ["Robin Duncan", "Business Analyst", "Los Angeles", 20, "$77,000", ['frequently-busy', 'leave-message', 'nice']],
    ["Mel Brooks", "Business Consultant", "Oklahoma City", 37, "$135,000", ['grumpy', 'second-choice']],
    ["Harper White", "Attorney", "Pittsburgh", 52, "$420,000", ['preferred']],
    ["Kris Humphrey", "Agency Legal Counsel", "Laredo", 30, "$150,000", ['preferred']],
    ["Frankie Long", "Industrial Analyst", "Austin", 31, "$170,000", ['preferred']],
    ["Brynn Robbins", "Business Analyst", "Norfolk", 22, "$90,000", ['preferred']],
    ["Justice Mann", "Business Consultant", "Chicago", 24, "$133,000", ['preferred']],
    ["Addison Navarro", "Business Management Analyst", "New York", 50, "$295,000", ['preferred']],
    ["Jesse Welch", "Agency Legal Counsel", "Seattle", 28, "$200,000", ['preferred']],
    ["Eli Mejia", "Commercial Specialist", "Long Beach", 65, "$400,000", ['preferred']],
    ["Gene Leblanc", "Industrial Analyst", "Hartford", 34, "$110,000", ['preferred']],
    ["Danny Leon", "Computer Scientist", "Newark", 60, "$220,000", ['preferred']],
    ["Lane Lee", "Corporate Counselor", "Cincinnati", 52, "$180,000", ['preferred']],
    ["Jesse Hall", "Business Analyst", "Baltimore", 44, "$99,000", ['preferred']],
    ["Danni Hudson", "Agency Legal Counsel", "Tampa", 37, "$90,000", ['preferred']],
    ["Terry Macdonald", "Commercial Specialist", "Miami", 39, "$140,000", ['preferred']],
    ["Justice Mccarthy", "Attorney", "Tucson", 26, "$330,000", ['preferred']],
    ["Silver Carey", "Computer Scientist", "Memphis", 47, "$250,000", ['preferred']],
    ["Franky Miles", "Industrial Analyst", "Buffalo", 49, "$190,000", ['preferred']],
    ["Glen Nixon", "Corporate Counselor", "Arlington", 44, "$80,000", ['preferred']],
    ["Gabby Strickland", "Business Process Consultant", "Scottsdale", 26, "$45,000", ['preferred']],
    ["Mason Ray", "Computer Scientist", "San Francisco", 39, "$142,000", ['preferred']]
  ];

  const options = {
    filter: true,
    filterArrayFullMatch: filterArrayFullMatch,
    filterType: 'dropdown',
    responsive: 'standard',
  };

  return (
    <>
      <FormControlLabel
        control={
          <Switch
            checked={filterArrayFullMatch}
            onChange={e => setFilterArrayFullMatch(e.target.checked)}
            value="filterArray"
            color="primary"
          />
        }
        label="Fullmatch for Array filter"
      />
      <MUIDataTable title={"ACME Employee list"} data={data} columns={columns} options={options} />
    </>
  );

}

export default Example;
