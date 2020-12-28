import React, { useState } from 'react';
import MUIDataTable from '../../src/';

function Example() {

  const columns = [
    {
      "label": "Name",
      "name": "serviceName",
      options: {
        "type": "prim-group",
        setCellHeaderProps: () => ({
          style: {
            width: '45%'
          }
        }),
      }
    },
    {
      "label": "Region",
      "name": "region",
      options: {
        display: false,
      }
    },
    {
      "label": "Sub-Category",
      "name": "subCat",
      options: {
        display: false,
      }
    },
    {
      "label": "Quantity",
      "name": "qty",
      "display": true
    },
    {
      "label": "Provider Rate",
      "name": "pRate",
      "display": true
    },
    {
      "label": "Provider Cost",
      "name": "pCost",
      "display": true
    },
    {
      "label": "Final Rate",
      "name": "fRate",
      "display": true
    },
    {
      "label": "Final Cost",
      "name": "fCost"
    }
  ];

  const options = {
    filter: false,
    filterType: 'dropdown',
    selectableRows: false,
    pagination: false,
    draggableColumns: {
      enabled: true,
    },
    onTableChange: (action, state) => {
      console.log(action);
    },
    onGroupExpansionChange: (group, expanded) => {
    },
    grouping: {
      columnIndexes: [0,
        1,
        2],
      rowHeaderVisible: false,
    }
  };

  const data = [
    {
      "serviceName": "Azure",
      "region": "North",
      "subCat": "domain-1",
      "qty": 1.0,
      "pRate": 42,
      "pCost": 0.88,
      "fRate": 29,
      "fCost": 75
    },
    {
      "serviceName": "GCP",
      "region": "US",
      "subCat": "domain-132",
      "qty": 1.0,
      "pRate": 75,
      "pCost": 0.18,
      "fRate": 36,
      "fCost": 71
    },
    {
      "serviceName": "GCP",
      "region": "US",
      "subCat": "domain-132",
      "qty": 1.0,
      "pRate": 66,
      "pCost": 0.86,
      "fRate": 82,
      "fCost": 57
    },
    {
      "serviceName": "GCP",
      "region": "US",
      "subCat": "domain-123",
      "qty": 1.0,
      "pRate": 76,
      "pCost": 0.83,
      "fRate": 71,
      "fCost": 77
    },
    {
      "serviceName": "GCP",
      "region": "Philippines",
      "subCat": "domain-143",
      "qty": 1.0,
      "pRate": 75,
      "pCost": 1.1,
      "fRate": 3,
      "fCost": 84
    },
    {
      "serviceName": "GCP",
      "region": "US",
      "subCat": "domain-143",
      "qty": 1.0,
      "pRate": 82,
      "pCost": 0.76,
      "fRate": 55,
      "fCost": 2
    },
    {
      "serviceName": "AWS",
      "region": "US",
      "subCat": "domain-143",
      "qty": 1.0,
      "pRate": 38,
      "pCost": 0.92,
      "fRate": 86,
      "fCost": 23
    },
    {
      "serviceName": "GCP",
      "region": "East",
      "subCat": "domain-143",
      "qty": 1.0,
      "pRate": 10,
      "pCost": 0.92,
      "fRate": 84,
      "fCost": 25
    },
    {
      "serviceName": "Digital Ocean",
      "region": "US",
      "subCat": "domain-123",
      "qty": 1.0,
      "pRate": 61,
      "pCost": 1.61,
      "fRate": 12,
      "fCost": 32
    },
    {
      "serviceName": "AWS",
      "region": "North",
      "subCat": "domain-1",
      "qty": 1.0,
      "pRate": 45,
      "pCost": 1.51,
      "fRate": 95,
      "fCost": 23
    },
    {
      "serviceName": "AWS",
      "region": "West",
      "subCat": "domain-1",
      "qty": 1.0,
      "pRate": 2,
      "pCost": 1.98,
      "fRate": 6,
      "fCost": 25
    },
    {
      "serviceName": "AWS",
      "region": "US",
      "subCat": "domain-1",
      "qty": 1.0,
      "pRate": 46,
      "pCost": 1.42,
      "fRate": 68,
      "fCost": 6
    },
    {
      "serviceName": "AWS",
      "region": "East",
      "subCat": "domain-1",
      "qty": 1.0,
      "pRate": 79,
      "pCost": 0.34,
      "fRate": 98,
      "fCost": 56
    },
    {
      "serviceName": "AWS",
      "region": "East",
      "subCat": "domain-1",
      "qty": 1.0,
      "pRate": 9,
      "pCost": 0.94,
      "fRate": 28,
      "fCost": 89
    },
    {
      "serviceName": "AWS",
      "region": "East",
      "subCat": "domain-1",
      "qty": 1.0,
      "pRate": 27,
      "pCost": 1.69,
      "fRate": 84,
      "fCost": 76
    },
    {
      "serviceName": "Digital Ocean",
      "region": "US",
      "subCat": "domain-1",
      "qty": 1.0,
      "pRate": 35,
      "pCost": 1.08,
      "fRate": 19,
      "fCost": 10
    },
    {
      "serviceName": "Digital Ocean",
      "region": "Philippines",
      "subCat": "domain-1",
      "qty": 1.0,
      "pRate": 9,
      "pCost": 0.93,
      "fRate": 3,
      "fCost": 23
    },
    {
      "serviceName": "Digital Ocean",
      "region": "US",
      "subCat": "domain-1",
      "qty": 1.0,
      "pRate": 60,
      "pCost": 1.66,
      "fRate": 75,
      "fCost": 35
    },
    {
      "serviceName": "Digital Ocean",
      "region": "US",
      "subCat": "domain-1",
      "qty": 1.0,
      "pRate": 64,
      "pCost": 1.12,
      "fRate": 88,
      "fCost": 29
    },
    {
      "serviceName": "GCP",
      "region": "Philippines",
      "subCat": "domain-1",
      "qty": 1.0,
      "pRate": 92,
      "pCost": 0.09,
      "fRate": 17,
      "fCost": 44
    },
    {
      "serviceName": "Digital Ocean",
      "region": "US",
      "subCat": "domain-1",
      "qty": 1.0,
      "pRate": 87,
      "pCost": 0.36,
      "fRate": 82,
      "fCost": 12
    },
    {
      "serviceName": "Digital Ocean",
      "region": "Philippines",
      "subCat": "domain-1",
      "qty": 1.0,
      "pRate": 73,
      "pCost": 0.66,
      "fRate": 33,
      "fCost": 66
    },
    {
      "serviceName": "AWS",
      "region": "US",
      "subCat": "domain-1",
      "qty": 1.0,
      "pRate": 83,
      "pCost": 1.13,
      "fRate": 43,
      "fCost": 50
    },
    {
      "serviceName": "GCP",
      "region": "Philippines",
      "subCat": "domain-1",
      "qty": 1.0,
      "pRate": 69,
      "pCost": 1.24,
      "fRate": 26,
      "fCost": 31
    },
    {
      "serviceName": "Digital Ocean",
      "region": "West",
      "subCat": "domain-1",
      "qty": 1.0,
      "pRate": 95,
      "pCost": 1.06,
      "fRate": 85,
      "fCost": 4
    },
    {
      "serviceName": "AWS",
      "region": "East",
      "subCat": "domain-1",
      "qty": 1.0,
      "pRate": 65,
      "pCost": 0.86,
      "fRate": 12,
      "fCost": 93
    },
    {
      "serviceName": "Digital Ocean",
      "region": "Georgia",
      "subCat": "domain-1",
      "qty": 1.0,
      "pRate": 10,
      "pCost": 0.0,
      "fRate": 28,
      "fCost": 65
    },
    {
      "serviceName": "Azure",
      "region": "France",
      "subCat": "domain-1",
      "qty": 1.0,
      "pRate": 1,
      "pCost": 0.55,
      "fRate": 92,
      "fCost": 46
    },
    {
      "serviceName": "Azure",
      "region": "West",
      "subCat": "domain-1",
      "qty": 1.0,
      "pRate": 66,
      "pCost": 0.21,
      "fRate": 100,
      "fCost": 32
    },
    {
      "serviceName": "Azure",
      "region": "India",
      "subCat": "domain-1",
      "qty": 1.0,
      "pRate": 71,
      "pCost": 1.01,
      "fRate": 13,
      "fCost": 89
    },
    {
      "serviceName": "AWS",
      "region": "East",
      "subCat": "domain-1",
      "qty": 1.0,
      "pRate": 91,
      "pCost": 0.16,
      "fRate": 93,
      "fCost": 92
    },
    {
      "serviceName": "Azure",
      "region": "East",
      "subCat": "domain-144",
      "qty": 1.0,
      "pRate": 13,
      "pCost": 0.43,
      "fRate": 89,
      "fCost": 85
    },
    {
      "serviceName": "Azure",
      "region": "Brazil",
      "subCat": "domain-144",
      "qty": 1.0,
      "pRate": 71,
      "pCost": 1.13,
      "fRate": 9,
      "fCost": 26
    },
    {
      "serviceName": "Digital Ocean",
      "region": "Philippines",
      "subCat": "domain-1",
      "qty": 1.0,
      "pRate": 91,
      "pCost": 1.81,
      "fRate": 5,
      "fCost": 70
    },
    {
      "serviceName": "AWS",
      "region": "East",
      "subCat": "domain-133",
      "qty": 1.0,
      "pRate": 94,
      "pCost": 0.61,
      "fRate": 41,
      "fCost": 57
    },
    {
      "serviceName": "Azure",
      "region": "Brazil",
      "subCat": "domain-133",
      "qty": 1.0,
      "pRate": 31,
      "pCost": 0.02,
      "fRate": 57,
      "fCost": 52
    },
    {
      "serviceName": "Digital Ocean",
      "region": "East",
      "subCat": "domain-166",
      "qty": 1.0,
      "pRate": 96,
      "pCost": 0.97,
      "fRate": 51,
      "fCost": 66
    },
    {
      "serviceName": "GCP",
      "region": "India",
      "subCat": "domain-166",
      "qty": 1.0,
      "pRate": 37,
      "pCost": 0.85,
      "fRate": 65,
      "fCost": 84
    },
    {
      "serviceName": "AWS",
      "region": "East",
      "subCat": "domain-1",
      "qty": 1.0,
      "pRate": 16,
      "pCost": 1.22,
      "fRate": 3,
      "fCost": 96
    },
    {
      "serviceName": "Digital Ocean",
      "region": "North",
      "subCat": "domain-1",
      "qty": 1.0,
      "pRate": 99,
      "pCost": 0.22,
      "fRate": 39,
      "fCost": 17
    },
    {
      "serviceName": "Azure",
      "region": "France",
      "subCat": "domain-166",
      "qty": 1.0,
      "pRate": 61,
      "pCost": 0.7,
      "fRate": 79,
      "fCost": 64
    },
    {
      "serviceName": "Digital Ocean",
      "region": "East",
      "subCat": "domain-166",
      "qty": 1.0,
      "pRate": 74,
      "pCost": 1.9,
      "fRate": 12,
      "fCost": 38
    },
    {
      "serviceName": "Digital Ocean",
      "region": "North",
      "subCat": "domain-133",
      "qty": 1.0,
      "pRate": 98,
      "pCost": 1.69,
      "fRate": 92,
      "fCost": 74
    },
    {
      "serviceName": "Digital Ocean",
      "region": "North",
      "subCat": "domain-133",
      "qty": 1.0,
      "pRate": 18,
      "pCost": 1.24,
      "fRate": 90,
      "fCost": 86
    },
    {
      "serviceName": "Digital Ocean",
      "region": "Vietnam",
      "subCat": "domain-1",
      "qty": 1.0,
      "pRate": 83,
      "pCost": 1.87,
      "fRate": 47,
      "fCost": 37
    },
    {
      "serviceName": "Digital Ocean",
      "region": "Japan",
      "subCat": "domain-1",
      "qty": 1.0,
      "pRate": 87,
      "pCost": 0.31,
      "fRate": 75,
      "fCost": 94
    },
    {
      "serviceName": "AWS",
      "region": "Ukraine",
      "subCat": "domain-1",
      "qty": 1.0,
      "pRate": 24,
      "pCost": 0.57,
      "fRate": 29,
      "fCost": 65
    },
    {
      "serviceName": "Digital Ocean",
      "region": "Peru",
      "subCat": "domain-1",
      "qty": 1.0,
      "pRate": 32,
      "pCost": 1.79,
      "fRate": 43,
      "fCost": 6
    },
    {
      "serviceName": "Azure",
      "region": "Canada",
      "subCat": "domain-1",
      "qty": 1.0,
      "pRate": 1,
      "pCost": 1.63,
      "fRate": 89,
      "fCost": 35
    },
    {
      "serviceName": "GCP",
      "region": "Indonesia",
      "subCat": "domain-133",
      "qty": 1.0,
      "pRate": 59,
      "pCost": 1.81,
      "fRate": 79,
      "fCost": 58
    }
  ];
  const aggData = [
    {
        "key": "Azure",
        "data": {
            "qty": 1.0,
            "pRate": 42,
            "pCost": 0.88,
            "fRate": 29,
            "fCost": 75
        },
        "childs": [
            {
                "key": "North",
                "data": {
                    "qty": 176.0,
                    "pRate": 5467,
                    "pCost": 0.45,
                    "fRate": 343,
                    "fCost": 11
                },
                "childs": [
                    {
                        "key": "domain-1",
                        "data": {
                            "qty": 1.0,
                            "pRate": 75,
                            "pCost": 1.1,
                            "fRate": 3,
                            "fCost": 84
                        }
                    },
                    {
                        "key": "domain-2",
                        "data": {
                            "qty": 1.0,
                            "pRate": 9,
                            "pCost": 0.94,
                            "fRate": 28,
                            "fCost": 89
                        }
                    }
                ]
            },
            {
                "key": "South",
                "data": {
                    "qty": 3.0,
                    "pRate": 23,
                    "pCost": 3.88,
                    "fRate": 49,
                    "fCost": 65
                }
            }
        ]
    },
    {
        "key": "AWS",
        "data": {
            "qty": 5.0,
            "pRate": 77,
            "pCost": 9.88,
            "fRate": 33,
            "fCost": 777
        }
    }
];


  return (
    <React.Fragment>
      <MUIDataTable title={'ACME Employee list'} data={data} aggData={aggData} columns={columns} options={options} />
    </React.Fragment>
  );
}

export default Example;
