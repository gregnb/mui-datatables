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
        })
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
      "display": true,
      customBodyRender: (value, tableMeta, updateValue) => (
        <div >{`#### ${value}`}</div>
      )
    },
    {
      "label": "Provider Rate",
      "name": "pRate",
      "display": true,
      customBodyRender: (value, tableMeta, updateValue) => (
        <div >{`#### ${value}`}</div>
      )
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
      "key": "Azure",
      "data": {
        "serviceName": "Azure",
        "qty": 1232,
        "pRate": 422332.67,
        "pCost": 4343.88,
        "fRate": 29343433,
        "fCost": 7434435
      },
      "childs": [
        {
          "key": "North",
          "data": {
            "serviceName": "Azure",
            "region": "North",
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
              },
              "childs": [
                {
                  "isLeaf": true,
                  "data": {
                    "serviceName": "Azure",
                    "region": "North",
                    "subCat": "domain-1",
                    "qty": 5.4,
                    "pRate": 45,
                    "pCost": 67.1,
                    "fRate": 300,
                    "fCost": 8004,
                    "currency": "USD"
                  }
                }
              ]
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
            "qty": 3008756,
            "pRate": 23,
            "pCost": 3.88,
            "fRate": 49,
            "fCost": 65
          },
          "childs": [
            {
              "key": "domain-1",
              "data": {
                "qty": 14,
                "pRate": 75,
                "pCost": 5.1,
                "fRate": 66,
                "fCost": 88
              },
              "childs": [
                {
                  "isLeaf": true,
                  "data": {
                    "serviceName": "Azure",
                    "region": "South",
                    "subCat": "domain-1",
                    "qty": 73008756,
                    "pRate": 77,
                    "pCost": 77.1,
                    "fRate": 770,
                    "fCost": 7004,
                    "currency": "USD"
                  }
                },
                {
                  "isLeaf": true,
                  "data": {
                    "serviceName": "Azure",
                    "region": "South",
                    "subCat": "domain-1",
                    "qty": -5,
                    "pRate": 66,
                    "pCost": 888.1,
                    "fRate": 8656,
                    "fCost": 6574.43,
                    "currency": "EUR"
                  }
                }
              ]
            }
          ]
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



  function formAggDataForDataGrid(data, parent) {
    let fData = {};

    data.forEach(row => {
      let key = parent ? `${parent}___GROUPJOIN___${row.key}` : row.key;
      fData[key] = row.data;
      if (Array.isArray(row.childs)) {
        fData = { ...formAggDataForDataGrid(row.childs, key), ...fData };
      }
    });
    return fData;
  }

  function formRootLevelDataForDataGrid(data, acc = []) {

    data.forEach(row => {
      if (row.isLeaf) {
        acc = acc.concat(row.data);
      } else if (Array.isArray(row.childs)) {
        acc = formRootLevelDataForDataGrid(row.childs, acc);
      }
    });

    return acc;
  }

  function customAggDataRender(value) {
    return `custom-${value}`;
  }


  return (
    <React.Fragment>
      <MUIDataTable title={'ACME Employee list'} data={formRootLevelDataForDataGrid(data)} aggData={formAggDataForDataGrid(data)} columns={columns} options={options}
        customAggDataRender={customAggDataRender}
      />
    </React.Fragment>
  );
}

export default Example;
