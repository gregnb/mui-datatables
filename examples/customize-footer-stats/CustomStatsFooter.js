import React, { useLayoutEffect, useState } from "react";
import TableFooter from "@material-ui/core/TableFooter";
import Tooltip from '@material-ui/core/Tooltip';
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Typography from '@material-ui/core/Typography';
import MuiTablePagination from "@material-ui/core/TablePagination";
import Fade from '@material-ui/core/Fade';
import FunctionsIcon from '@material-ui/icons/Functions';
import Chip from '@material-ui/core/Chip';
import { withStyles } from "@material-ui/core/styles";
import { min, max, sum, mean, median, deviation } from 'd3-array';
import { format } from 'd3-format';
import PropTypes from 'prop-types';
import Popover from '../../src/components/Popover';
import ColStatSelect from '../../src/components/ColStatSelect';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';

const defaultFooterStyles = {
  mobileStat: {
    padding: 0,
    display: 'block',
    textAlign: 'center',
    margin: 0,
    paddingTop: '0.5em',
    '&:last-child': {
      padding: 0,
      paddingTop: '0.5em'
    }
  }
};

const CustomStatsFooter = ({ count, classes, options, rowsPerPage, page, tableState, cellRefs, changeRowsPerPage, changePage }) => {

  const [colWidthsStr, setColWidthsStr] = useState('');
  const [colWidthsArr, setColWidthsArr] = useState([]);
  const [colStats, setColStats] = useState({});

  const md = useMediaQuery('(min-width:960px)');

  const textLabels = { ...options.textLabels };

  useLayoutEffect(() => {
    updateColumnWidths();

    // add eventlisteners
    window.addEventListener('resize', updateColumnWidths, false);

    // clean up eventlisteners
    return () => {
      window.removeEventListener('resize', updateColumnWidths, false);
    };

  });

  const updateColumnWidths = () => {

    // init width ref
    let columnWidthsInDOM = {};
    for (const index in cellRefs) {

      const el = cellRefs[index];
      try {
        if (el && typeof el === 'object') {
          const colWidth = window.getComputedStyle(el).width;
          columnWidthsInDOM = { ...columnWidthsInDOM, [index]: colWidth };
        }
      } catch (error) {
        console.log(error);
      }
    }

    const strVal = Object.values(columnWidthsInDOM).join();

    // update on width change
    if (strVal !== colWidthsStr) {
      setColWidthsStr(strVal);
      setColWidthsArr(Object.values(columnWidthsInDOM));
    }
  };

  const handleRowChange = event => {
    changeRowsPerPage(event.target.value);
  };

  const handlePageChange = (_, page) => {
    changePage(page);
  };

  // d3.js formatter. Don't show decimals if there is none.
  const formatter = (value) => {
    return isNaN(value) ? '-' : (value % 1 === 0) ? format(".1d")(value) : format(".1f")(value);
  };

  const footerStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '0px 24px 0px 24px'
  };

  const footerStatsStyle = {
    display: 'flex',
    justifyContent: 'flex-start',
    margin: 0,
    padding: '0px 0px 0px 0px',
    height: 'auto'
  };

  const footerStatsStyleMobile = {
    display: 'block',
    margin: 0,
    padding: '0px 0px 0px 0px',
    height: 'auto'
  };

  const getModes = (valArr) => {
    let frequencies = {}; // object of frequencies.
    let maxFreq = 0; // holds the max frequency.
    let modes = [];

    for (let val of valArr) {
      frequencies[val] = (frequencies[val] || 0) + 1; // increment frequency.

      // update max frequency
      maxFreq = frequencies[val] > maxFreq ? frequencies[val] : maxFreq;
    }

    for (let [val, freq] of Object.entries(frequencies)) {
      // push value to array if max frequency
      if (freq === maxFreq) {
        modes.push(val);
      }
    }

    return modes;
  };

  const selColHidden = tableState.selectableRows && tableState.selectableRows === 'none';

  // add dummy item to array if selectboxes are visible
  const colsArr = selColHidden ? tableState.columns : [{ display: 'true', selectCol: true }, ...tableState.columns];

  // generate stat columns in stats footer
  const statColumns = colsArr.map((col, colIndex) => {

    // if "select row"-col is visible, decrement index by 1
    const statIndex = selColHidden ? colIndex : colIndex - 1;

    // save original index
    col.origIndex = colIndex;

    // data for single column
    const colDataArr = tableState.displayData.map(col => col.data[statIndex]);
    const dataLength = colDataArr.length;

    // data type for column This will be used to show applicable stats
    col.dataType = dataLength > 0 ? typeof (colDataArr[0]) : null;

    // calculate statistics only for visible columns
    if (col.display !== 'true') {
      return col;
    }

    // no statistics for 'select row' column
    if (col.selectCol) {
      return col;
    }

    // return if no stats selected
    if (!colStats[colIndex]) {
      col = { ...col, stats: true };
      return col;
    }

    // return if stat select object is empty
    if (Object.keys(colStats[colIndex]).length === 0) {
      col = { ...col, stats: true };
      return col;
    }

    // init stats
    let stats = {};

    // stats to calculate
    const statsArr = Object.keys(colStats[colIndex]);

    // no stats to calculate
    if (!statsArr || statsArr.length === 0) {
      return col;
    }

    // check what should be calculated
    for (let statName of statsArr) {

      try {
        switch (statName) {
          case 'min':
            stats = { ...stats, min: formatter(min(colDataArr)) };
            break;
          case 'max':
            stats = { ...stats, max: formatter(max(colDataArr)) };
            break;
          case 'qty':
            stats = { ...stats, qty: dataLength };
            break;
          case 'sum':
            stats = { ...stats, sum: formatter(sum(colDataArr)) };
            break;
          case 'mean':
            // mean
            stats = { ...stats, mean: formatter(mean(colDataArr)) };
            break;
          case 'sd':
            // standard deviation
            stats = { ...stats, sd: formatter(deviation(colDataArr)) };
            break;
          case 'mode':
            // mode => most common value in array
            const mode = getModes(colDataArr).join(', ');
            stats = { ...stats, mode };
            break;
          case 'median':
            // median => middle value of array
            stats = { ...stats, median: formatter(median(colDataArr)) };
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

  const handleFilterClick = colIndex => (stat, isChecked) => {
    if (isChecked) {
      // add object
      const newColStats = { ...colStats, [colIndex]: { ...colStats[colIndex], [stat]: true } };
      setColStats(newColStats);
    } else {
      // remove property if exists
      if (colStats[colIndex] && colStats[colIndex][stat]) {
        let newColStats = { ...colStats };
        delete newColStats[colIndex][stat];
        setColStats(newColStats);
      }
    }
  };

  return (
    <TableFooter>
      {/* statistics footer */}
      <TableRow style={md ? footerStatsStyle : footerStatsStyleMobile} colSpan={1000}>
        {statColumns.filter(col => col.display === 'true').map((col, index) => {
          if (col.selectCol) {
            return md ? <TableCell key={`${col.name}-${index}-dummy`} style={{ padding: '4px 0px 4px 24px' }} width={md ? colWidthsArr[index] : 'auto'} /> : null;
          } else if (!col.stats) {
            return md ? <TableCell key={`${col.name}-${index}`} width={md ? colWidthsArr[index] : 'auto'} /> : null;
          } else {
            return (!md && col.dataType !== 'number') ? null :
              <TableCell className={md ? null : classes.mobileStat} width={md ? colWidthsArr[index] : 'unset'} key={`${col.name}-${index}`}>
                {col.dataType === 'number' ? (
                  <Popover
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    classes={{ paper: classes.filterPaper }}
                    trigger={
                      <Tooltip title={textLabels.stats.toolTip} disableFocusListener>
                        <Chip
                          icon={<FunctionsIcon fontSize="small" />}
                          label={col.name}
                          variant="outlined"
                          onClick={() => null}
                          size="small"
                          style={{ marginBottom: '0.3em', marginTop: '0.3em' }}
                        />
                      </Tooltip>
                    }
                    content={
                      <ColStatSelect
                        selections={colStats[col.origIndex]}
                        dataType={col.dataType}
                        options={options}
                        onFilterClick={handleFilterClick(col.origIndex)}
                      />
                    }
                  />
                ) : null}
                {Object.entries(col.stats).map(([statName, val]) => (
                  <Fade key={`${col.name}-${index}-${statName}`} in={true}>
                    <Typography variant="caption" display="block" gutterBottom>
                      {`${textLabels.stats.types[statName]} ${val}`}
                    </Typography>
                  </Fade>
                )
                )}
              </TableCell>;
          }
        })}
      </TableRow>

      {/* pagination control footer */}
      <TableRow>
        <TableCell style={footerStyle} colSpan={1000}>
          <MuiTablePagination
            component="div"
            count={count}
            rowsPerPage={rowsPerPage}
            page={page}
            labelRowsPerPage={textLabels.pagination.rowsPerPage}
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} ${textLabels.pagination.displayRows} ${count}`}
            backIconButtonProps={{
              'aria-label': textLabels.pagination.previous,
            }}
            nextIconButtonProps={{
              'aria-label': textLabels.pagination.next,
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

export default withStyles(defaultFooterStyles, { name: "CustomStatsFooter" })(CustomStatsFooter);

CustomStatsFooter.propTypes = {
  tableState: PropTypes.object,
  columnStats: PropTypes.array
};