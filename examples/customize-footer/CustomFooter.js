import React, { useState } from "react";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import MuiTablePagination from "@material-ui/core/TablePagination";
import { withStyles } from "@material-ui/core/styles";

const defaultFooterStyles = {
};

const CustomFooter = ({ count, classes, textLabels, rowsPerPage, page, tableState, columnStats, changeRowsPerPage, changePage }) => {

  const handleRowChange = event => {
    changeRowsPerPage(event.target.value);
  };

  const handlePageChange = (_, page) => {
    changePage(page);
  };

  const footerStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '0px 24px 0px 24px'
  };

  const calcSum = (valArr) => {
    return valArr.reduce((a, b) => {
      return a + b;
    }, 0);
  };

  const statColumns = tableState.columns.map((col, colIndex) => {

    // calculate statistics only for visible columns
    if (col.display !== 'true') {
      return col;
    }

    // init stats
    let stats = {};

    // data for single column
    const colDataArr = tableState.displayData.map(col => col.data[colIndex]);
    const dataLength = colDataArr.length;

    // stats to calculate
    const statsArr = columnStats[colIndex];

    // no stats to calculate
    if (statsArr.length === 0) {
      stats = null;
    }

    // check what should be calculated
    for (let statName of statsArr) {

      try {
        switch (statName) {
          case 'count':
            stats = { ...stats, dataLength };
            break;
          case 'sum':
            const sum = calcSum(colDataArr);
            stats = { ...stats, sum };
            break;
          case 'mean':
            try {
              const sum = stats.sum ? stats.sum : calcSum(colDataArr);
              const mean = sum / dataLength;
              stats = { ...stats, mean };
            } catch (error) {
              stats = { ...stats, mean: null };
            }
            break;
          case 'sd':
            break;
          case 'mode':
            break;
          case 'median':
            let median = null;
            const sortedDataArr = colDataArr.sort();

            switch (dataLength) {
              case 0:
                break;
              case 1:
                median = sortedDataArr[0];
                break;
              default:
                const halfIndexFloor = Math.floor(dataLength / 2) - 1;
                if (dataLength % 2 === 0) {
                  // even
                  median = (sortedDataArr[halfIndexFloor] + sortedDataArr[halfIndexFloor + 1]) / 2;
                } else {
                  // odd
                  median = sortedDataArr[halfIndexFloor];
                }
            }

            stats = { ...stats, median };
            break;
          default:
            throw new Error(statName + ' is not valid method for statistics');
        }
      } catch (e) {
        console.error(e.name + ': ' + e.message);
      }

    };

    col = { ...col, stats };

    return col;

  });

  return (
    <TableFooter>
      <TableRow>
        <TableCell colSpan={6}>
          {statColumns.map((col, index) => (
            col.display === 'true' && col.stats ?
              <TableCell>{col.name}
                {Object.entries(col.stats).map(([statName, val]) => <p>{`${statName} ${val}`}</p>)}
              </TableCell> :
              null
          ))}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={footerStyle} colSpan={1000}>
          <button>Custom Option</button>

          <MuiTablePagination
            component="div"
            count={count}
            rowsPerPage={rowsPerPage}
            page={page}
            labelRowsPerPage={textLabels.rowsPerPage}
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} ${textLabels.displayRows} ${count}`}
            backIconButtonProps={{
              'aria-label': textLabels.previous,
            }}
            nextIconButtonProps={{
              'aria-label': textLabels.next,
            }}
            rowsPerPageOptions={[10, 20, 100]}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handleRowChange}
          />
        </TableCell>
      </TableRow>
    </TableFooter>
  );
};

export default withStyles(defaultFooterStyles, { name: "CustomFooter" })(CustomFooter);