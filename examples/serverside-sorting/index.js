import React from 'react';
import ReactDOM from 'react-dom';
import MUIDataTable from '../../src';
import { CircularProgress, Typography } from '@mui/material';
import Cities from './cities';

class Example extends React.Component {
  state = {
    page: 0,
    count: 26,
    data: [['Loading Data...']],
    sortOrder: {},
    loading: false,
  };

  componentDidMount() {
    this.getData();
  }

  getData = () => {
    this.setState({ loading: true });
    this.xhrRequest().then(data => {
      this.setState({ data, loading: false });
    });
  };

  // mock async function
  xhrRequest = url => {
    let page = 0;
    let order = '';
    let column = '';
    if (url != undefined) {
      page = url.page;
      order = url.order;
      column = url.column;
    }

    return new Promise((resolve, reject) => {
      const srcData = [
        ['Gabby George', 'Business Analyst', 'Minneapolis', 10, '$210,000'],
        ['Aiden Lloyd', 'Business Consultant', 'Dallas', 13, '$250,000'],
        ['Jaden Collins', 'Attorney', 'Santa Ana', 20, '$310,000'],
        ['Franky Rees', 'Business Analyst', 'St. Petersburg', 31, '$290,000'],
        ['Aaren Rose', 'Business Analyst', 'Toledo', 61, '$510,000'],
        ['Frankie Parry', 'Agency Legal Counsel', 'Jacksonville', 71, '$210,000'],
        ['Lane Wilson', 'Commercial Specialist', 'Omaha', 19, '$65,000'],
        ['Robin Duncan', 'Business Analyst', 'Los Angeles', 20, '$77,000'],
        ['Mel Brooks', 'Business Consultant', 'Oklahoma City', 37, '$135,000'],
        ['Harper White', 'Attorney', 'Pittsburgh', 52, '$420,000'],
        ['Kris Humphrey', 'Agency Legal Counsel', 'Laredo', 30, '$150,000'],
        ['Frankie Long', 'Industrial Analyst', 'Austin', 31, '$170,000'],
        ['Brynn Robbins', 'Business Analyst', 'Norfolk', 22, '$90,000'],
        ['Justice Mann', 'Business Consultant', 'Chicago', 24, '$133,000'],
        ['Jesse Welch', 'Agency Legal Counsel', 'Seattle', 28, '$200,000'],
        ['Eli Mejia', 'Commercial Specialist', 'Long Beach', 65, '$400,000'],
        ['Gene Leblanc', 'Industrial Analyst', 'Hartford', 34, '$110,000'],
        ['Danny Leon', 'Computer Scientist', 'Newark', 60, '$220,000'],
        ['Lane Lee', 'Corporate Counselor', 'Cincinnati', 52, '$180,000'],
        ['Jesse Hall', 'Business Analyst', 'Baltimore', 44, '$99,000'],
        ['Danni Hudson', 'Agency Legal Counsel', 'Tampa', 37, '$90,000'],
        ['Terry Macdonald', 'Commercial Specialist', 'Miami', 39, '$140,000'],
        ['Justice Mccarthy', 'Attorney', 'Tucson', 26, '$330,000'],
        ['Silver Carey', 'Computer Scientist', 'Memphis', 47, '$250,000'],
        ['Franky Miles', 'Industrial Analyst', 'Buffalo', 49, '$190,000'],
        ['Glen Nixon', 'Corporate Counselor', 'Arlington', 44, '$80,000'],
      ];

      // here we're faking the sorting that would happen on the server-side

      var offset = page * 10;
      var data = [];

      if (order !== '') {
        var sortCol = ['Name', 'Title', 'Location', 'Age', 'Salary'].indexOf(column);
        if (sortCol === -1) sortCol = 3;

        if (order === 'asc') {
          var tempData = srcData.sort((a, b) => {
            if ( a[sortCol] < b[sortCol] ) return -1;
            if ( a[sortCol] > b[sortCol] ) return 1;
            return 0;
          });

          data =
            offset + 10 >= srcData.length
              ? tempData.slice(offset, srcData.length)
              : tempData.slice(offset, offset + 10);
        } else {
          tempData = srcData.sort((a, b) => {
            if ( a[sortCol] < b[sortCol] ) return 1;
            if ( a[sortCol] > b[sortCol] ) return -1;
            return 0;
          });

          data =
            offset + 10 >= srcData.length
              ? tempData.slice(offset, srcData.length)
              : tempData.slice(offset, offset + 10);
        }

      } else {
        data =
          offset + 10 >= srcData.length ? srcData.slice(offset, srcData.length) : srcData.slice(offset, offset + 10);
      }

      setTimeout(() => {
        resolve(data);
      }, 250);
    });
  };

  sort = (column, order) => {
    let temp = {};
    temp.column = column;
    temp.order = order;
    temp.page = this.state.page;

    this.xhrRequest(temp).then(data => {
      this.setState({
        data,
        sortOrder: {
          name: column,
          direction: order
        }
      });
    });
  };

  render() {
    const columns = [
      {
        name: 'Name',
        options: {
          customFilterListOptions: {
            render: v => `Name: ${v}`,
          }
        },
      },
      {
        name: 'Title',
        options: {
          customFilterListOptions: {
            render: v => `Title: ${v}`,
          }
        },
      },
      {
        name: 'Location',
        options: {
          customFilterListOptions: {
            render: v => `Location: ${v}`,
          },
          customBodyRender: (value, tableMeta, updateValue) => {
            return <Cities value={value || ''} index={tableMeta.columnIndex} change={event => updateValue(event)} />;
          },
        },
      },
      {
        name: 'Age',
      },
      {
        name: 'Salary',
      },
    ];
    const { page, count, data } = this.state;

    const options = {
      filter: true,
      filterType: 'dropdown',
      responsive: 'standard',
      serverSide: true,
      count: count,
      page: page,
      onColumnSortChange: (changedColumn, direction) => {
        let order = 'desc';
        if (direction === 'asc') {
          order = 'asc';
        }

        this.sort(changedColumn, order);
      },
      onChangePage: (page) => {
        this.setState({page}, () => {
          this.sort(this.state.sortOrder.name, this.state.sortOrder.direction);
        });
      }
    };

    return (
      <div>
        <MUIDataTable
          title={
            <Typography variant="subtitle2">
              ACME Employee list{' '}
              {this.state.loading && (
                <CircularProgress size={24} style={{ marginLeft: 15, position: 'relative', top: 4 }} />
              )}
            </Typography>
          }
          data={data}
          columns={columns}
          options={options}
        />
      </div>
    );
  }
}

export default Example;
