import React, { Fragment, Component } from "react";
import { Waypoint } from "react-waypoint";
import PropTypes from "prop-types";
import MUIDataTable from "../../src/";
import { createTheme } from "@mui/material/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";
import { withStyles } from "tss-react/mui";

const styles = theme => ({
  root: {
    width: "100%",
    overflowX: "auto",
    height: 300,
    flexGrow: 1
  },
  head: {
    backgroundColor: theme.palette.primary.main,
    color: "#fff",
    position: "sticky",
    fontSize: ".6rem",
    top: 0
  },
  table: {
    minWidth: 700,
    height: 200
  },
  tableCell: {
    fontSize: ".6rem"
  }
});

class MessageManager extends Component {
  constructor(props) {
    super(props);
    this.props = props;

    this.state = {
      filteredMessages: []
    };
  }

  componentDidMount() {
    this.getMessages(0);
  }

  columns = [
    {
      name: "Id",
      options: {
        filter: false,
        sort: false,
        customBodyRenderLite: (dataIndex, rowIndex) => {
          const { filteredMessages } = this.state;
          let value = filteredMessages[dataIndex][0];
          
          if (rowIndex === filteredMessages.length - 10) {
            return (
              <Fragment>
                <Waypoint
                  onEnter={() => {
                    console.log("WAYPOINT REACHED");
                    const newData = this.buildTestData(
                      30,
                      filteredMessages.length
                    );
                    
                    this.setState({
                      filteredMessages: [...filteredMessages, ...newData]
                    });
                  }}
                />
                {value}*
              </Fragment>
            );
          } else {
            return <Fragment>{value}</Fragment>;
          }
        }
      }
    },
    {
      name: "Message",
      options:{
        sort: false,
      }
    },
    {
      name: "Requester",
      options:{
        sort: false,
      }
    }
  ];

  options = {
    filter: false,
    fixedHeader: true,
    filterType: "dropdown",
    responsive: "standard",
    selectableRows: "none",
    pagination: false,
    tableBodyHeight:'500px',
    onRowClick(rowNode) {
      console.log(rowNode);
    }
  };

  /*eslint-disable */
  buildTestData(count, startingIndex) {
    const data = [
      ["Template 1", "Requester Jerry"],
      ["Template 2", "Test user 1"],
      ["Order66", "Test user 2"],
      ["Live Message", "Another Person"],
      ["Future Message", "John Doe"],
      ["Expired Message", "Jane Doe"],
      ["Retired Message", "Some Guy"]
    ];

    function createData(id, message, requester) {
      return [id, message, requester];
    }

    const rows = [];

    for (let i = 0; i < count; i += 1) {
      const randomSelection = data[Math.floor(Math.random() * data.length)];
      const id = i + 1 + startingIndex;
      rows.push(createData(id, ...randomSelection));
    }
    return rows;
  }
  /* eslint-enable */

  getMessages(pageNum) {
    const THIRTYROWS = 30;
    const messages = this.buildTestData(THIRTYROWS, 0);
    this.setState({
      filteredMessages: messages
    });
  }

  getMuiTheme = () =>
    createTheme({
      typography: {
        useNextVariants: true
      },
      overrides: {
        MUIDataTable: {
          root: {}
        },
        MUIDataTableBodyRow: {
          root: {
            "&:nth-child(odd)": {
              backgroundColor: "#f6f6f6"
            }
          }
        },
        MUIDataTableBodyCell: {}
      }
    });

  // eslint-disable-next-line max-lines-per-function
  render() {
    const { classes } = this.props;
    const { filteredMessages } = this.state;
    return (
      <Fragment>
            <MUIDataTable
              data={filteredMessages}
              columns={this.columns}
              options={this.options}
            />
      </Fragment>
    );
  }
}
MessageManager.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(MessageManager, styles);