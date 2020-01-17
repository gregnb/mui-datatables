import React from "react";
import MUIDataTable from "../../src/";
import {createMuiTheme, MuiThemeProvider, withStyles} from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import classnames from 'classnames';

const customStyles = {
  BusinessAnalystRow: {
    '& td': {backgroundColor: "#FAA"}
  },
  NameCell: {
    fontWeight: 900
  },
};

class Example extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      denseTable: false,
      stacked: true
    };
  }

  getMuiTheme = () => createMuiTheme({
    overrides: {
      MUIDataTable: {
        root: {
          backgroundColor: "#AAF",
        },
        paper: {
          boxShadow: "none",
        }
      },
      MUIDataTableBodyCell: {
        root: {
          backgroundColor: "#FFF"
        }
      }
    }
  });

  toggleDenseTable = (event) => {
    this.setState({
      denseTable: event.target.checked
    });
  }

  toggleResponsive = (event) => {
    this.setState({
      stacked: event.target.checked ? true : false
    });
  }

  render() {
    const columns = [
      {
        name: "Name",
        options: {
          filter: true,
          setCellProps: (value) => {
            return {
              className: classnames(
                {
                  [this.props.classes.NameCell]: value === "Mel Brooks"
                })
            };
          },
          setCellHeaderProps: (value) => {
            return {
              className: classnames(
                {
                  [this.props.classes.NameCell]: true
                }),
                style: {
                  textDecoration: 'underline'
                }
            };
          }
        }
      },
      {
        name: "Title",
        options: {
          filter: true,
          setCellHeaderProps: (value) => ({style:{textDecoration:'underline'}}),
        }
      },
      {
        name: "Location",
        options: {
          filter: false,
        }
      },
      {
        name: "Age",
        options: {
          filter: true,
        }
      },
      {
        name: "Salary",
        options: {
          filter: true,
          sort: false
        }
      }
    ];

    const data = [
      ["Gabby George", "Business Analyst", "Minneapolis", 30, 100000],
      ["Aiden Lloyd", "Business Consultant", "Dallas", 55, 200000],
      ["Jaden Collins", "Attorney", "Santa Ana", 27, 500000],
      ["Franky Rees", "Business Analyst", "St. Petersburg", 22, 50000],
      ["Aaren Rose", "Business Consultant", "Toledo", 28, 75000],
      ["Blake Duncan", "Business Management Analyst", "San Diego", 65, 94000],
      ["Frankie Parry", "Agency Legal Counsel", "Jacksonville", 71, 210000],
      ["Lane Wilson", "Commercial Specialist", "Omaha", 19, 65000],
      ["Robin Duncan", "Business Analyst", "Los Angeles", 20, 77000],
      ["Mel Brooks", "Business Consultant", "Oklahoma City", 37, 135000],
      ["Harper White", "Attorney", "Pittsburgh", 52, 420000],
      ["Kris Humphrey", "Agency Legal Counsel", "Laredo", 30, 150000],
      ["Frankie Long", "Industrial Analyst", "Austin", 31, 170000],
      ["Brynn Robbins", "Business Analyst", "Norfolk", 22, 90000],
      ["Justice Mann", "Business Consultant", "Chicago", 24, 133000],
      ["Addison Navarro", "Business Management Analyst", "New York", 50, 295000],
      ["Jesse Welch", "Agency Legal Counsel", "Seattle", 28, 200000],
      ["Eli Mejia", "Commercial Specialist", "Long Beach", 65, 400000],
      ["Gene Leblanc", "Industrial Analyst", "Hartford", 34, 110000],
      ["Danny Leon", "Computer Scientist", "Newark", 60, 220000],
      ["Lane Lee", "Corporate Counselor", "Cincinnati", 52, 180000],
      ["Jesse Hall", "Business Analyst", "Baltimore", 44, 99000],
      ["Danni Hudson", "Agency Legal Counsel", "Tampa", 37, 90000],
      ["Terry Macdonald", "Commercial Specialist", "Miami", 39, 140000],
      ["Justice Mccarthy", "Attorney", "Tucson", 26, 330000],
      ["Silver Carey", "Computer Scientist", "Memphis", 47, 250000],
      ["Franky Miles", "Industrial Analyst", "Buffalo", 49, 190000],
      ["Glen Nixon", "Corporate Counselor", "Arlington", 44, 80000],
      ["Gabby Strickland", "Business Process Consultant", "Scottsdale", 26, 45000],
      ["Mason Ray", "Computer Scientist", "San Francisco", 39, 142000]
    ];

    const options = {
      filter: true,
      filterType: 'dropdown',
      responsive: this.state.stacked ? 'stacked' : 'scrollMaxHeight',
      fixedHeaderOptions: {
        xAxis: true,
        yAxis: true
      },
      rowHover: false,
      setRowProps: (row) => {
        return {
          className: classnames(
            {
              [this.props.classes.BusinessAnalystRow]: row[1] === "Business Analyst"
            }),
          style: {border: '3px solid blue',}
        };
      },
      setTableProps: () => {
        return {
          padding: this.state.denseTable ? "none" : "default",

          // material ui v4 only
          size: this.state.denseTable ? "small" : "medium",
        };
      }

    };

    return (
      <MuiThemeProvider theme={this.getMuiTheme()}>
        <FormGroup row>
          <FormControlLabel
            control={
              <Switch
                checked={this.state.denseTable}
                onChange={this.toggleDenseTable}
                value="denseTable"
                color="primary"
              />
            }
            label="Dense Table"
          />
          <FormControlLabel
            control={
              <Switch
                checked={this.state.stacked}
                onChange={this.toggleResponsive}
                value="stacked"
                color="primary"
              />
            }
            label="Stacked Table"
          />
        </FormGroup>
        <MUIDataTable title={"ACME Employee list"} data={data} columns={columns} options={options}/>
      </MuiThemeProvider>
    );

  }
}

export default withStyles(customStyles, {name: "ExampleCard.js"})(Example);
