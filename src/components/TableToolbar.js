import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Popover from './Popover';
import TableFilter from './TableFilter';
import TableViewCol from './TableViewCol';
import TableSearch from './TableSearch';
import SearchIcon from '@material-ui/icons/Search';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import PrintIcon from '@material-ui/icons/Print';
import ViewColumnIcon from '@material-ui/icons/ViewColumn';
import FilterIcon from '@material-ui/icons/FilterList';
import ReactToPrint from 'react-to-print';
import find from 'lodash.find';
import { makeStyles } from '@material-ui/core/styles';
import { createCSVDownload, downloadCSV } from '../utils';
import cloneDeep from 'lodash.clonedeep';
import MuiTooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles(
  theme => ({
    root: {
      '@media print': {
        display: 'none',
      },
    },
    fullWidthRoot: {},
    left: {
      flex: '1 1 auto',
    },
    fullWidthLeft: {
      flex: '1 1 auto',
    },
    actions: {
      flex: '1 1 auto',
      textAlign: 'right',
    },
    fullWidthActions: {
      flex: '1 1 auto',
      textAlign: 'right',
    },
    titleRoot: {},
    titleText: {},
    fullWidthTitleText: {
      textAlign: 'left',
    },
    icon: {
      '&:hover': {
        color: theme.palette.primary.main,
      },
    },
    iconActive: {
      color: theme.palette.primary.main,
    },
    filterPaper: {
      maxWidth: '50%',
    },
    filterCloseIcon: {
      position: 'absolute',
      right: 0,
      top: 0,
      zIndex: 100,
    },
    searchIcon: {
      display: 'inline-flex',
      marginTop: '10px',
      marginRight: '8px',
    },
    [theme.breakpoints.down('sm')]: {
      titleRoot: {},
      titleText: {
        fontSize: '16px',
      },
      spacer: {
        display: 'none',
      },
      left: {
        // flex: "1 1 40%",
        padding: '8px 0px',
      },
      actions: {
        // flex: "1 1 60%",
        textAlign: 'right',
      },
    },
    [theme.breakpoints.down('xs')]: {
      root: {
        display: 'block',
        '@media print': {
          display: 'none !important',
        },
      },
      left: {
        padding: '8px 0px 0px 0px',
      },
      titleText: {
        textAlign: 'center',
      },
      actions: {
        textAlign: 'center',
      },
    },
    '@media screen and (max-width: 480px)': {},
  }),
  { name: 'MUIDataTableToolbar' },
);

const RESPONSIVE_FULL_WIDTH_NAME = 'scrollFullHeightFullWidth';

const TableToolbar = ({
  columns,
  components = {},
                        colOrder,
  data,
  displayData,
  filterData,
  filterList,
  filterUpdate,
  options,
  resetFilters,
  searchClose,
  searchText,
  searchTextUpdate,
  setTableAction,
  tableRef,
  title,
  toggleViewColumn,
  updateFilterByType,
}) => {
  const classes = useStyles();
  const [iconActiveState, setIconActive] = useState(null);
  const [showSearchState, setShowSearch] = useState(Boolean(searchText || options.searchText || options.searchOpen));
  const [searchTextState, setSearchText] = useState(searchText || null);
  const [hideFilterPopover, setHideFilterPopover] = useState(null);

  useEffect(() => {
    if (searchText !== searchTextState) {
      setSearchText(searchText);
    }
  }, [searchText, searchTextState]);

  const handleCSVDownload = () => {
    let dataToDownload = cloneDeep(data);
    let columnsToDownload = columns;
    let columnOrder = Array.isArray(colOrder) ? columnOrder.slice(0) : [];

    if (columnOrder.length === 0) {
      columnOrder = columns.map( (item, idx) => (idx));
    }

    data.forEach( row => {
      let newRow = {index: row.index, data: []};
      columnOrder.forEach( idx => {
        newRow.data.push( row.data[idx] );
      });
      dataToDownload.push(newRow);
    });

    columnOrder.forEach( idx => {
      columnsToDownload.push( columns[idx] );
    });


    if (options.downloadOptions && options.downloadOptions.filterOptions) {
      // check rows first:
      if (options.downloadOptions.filterOptions.useDisplayedRowsOnly) {
        dataToDownload = displayData.map((row, index) => {
          let i = -1;

          // Help to preserve sort order in custom render columns
          row.index = index;

          return {
            data: row.data.map(column => {
              i += 1;

              // if we have a custom render, which will appear as a react element, we must grab the actual value from data
              // that matches the dataIndex and column
              // TODO: Create a utility function for checking whether or not something is a react object
              return typeof column === 'object' && column !== null && !Array.isArray(column)
                ? find(data, d => d.index === row.dataIndex).data[i]
                : column;
            }),
          };
        });
      }

      // now, check columns:
      if (options.downloadOptions.filterOptions.useDisplayedColumnsOnly) {
        columnsToDownload = columns.filter(_ => _.display === 'true');

        dataToDownload = dataToDownload.map(row => {
          row.data = row.data.filter((_, index) => columns[index].display === 'true');
          return row;
        });
      }
    }
    createCSVDownload(columnsToDownload, dataToDownload, options, downloadCSV);
  };

  const setActiveIcon = iconName => {
    setShowSearch(isSearchShown(iconName));
    setIconActive(prevState => {
      const prevIconActive = prevState;

      if (iconActiveState === 'filter') {
        setTableAction('onFilterDialogOpen');
        if (options.onFilterDialogOpen) {
          options.onFilterDialogOpen();
        }
      }
      if (iconActiveState === undefined && prevIconActive === 'filter') {
        setTableAction('onFilterDialogClose');
        if (options.onFilterDialogClose) {
          options.onFilterDialogClose();
        }
      }
    });
  };

  const isSearchShown = iconName => {
    let nextVal = false;
    if (showSearchState) {
      if (searchTextState) {
        nextVal = true;
      } else {
        const { onSearchClose } = options;
        setTableAction('onSearchClose');
        if (onSearchClose) onSearchClose();
        nextVal = false;
      }
    } else if (iconName === 'search') {
      nextVal = showSearch();
    }
    return nextVal;
  };

  const getActiveIcon = (styles, iconName) => {
    let isActive = iconActiveState === iconName;
    if (iconName === 'search') {
      isActive = isActive || showSearchState || searchTextState;
    }
    return isActive ? styles.iconActive : styles.icon;
  };

  const showSearch = () => {
    setTableAction('onSearchOpen');
    !!options.onSearchOpen && options.onSearchOpen();
    return true;
  };

  const hideSearch = () => {
    const { onSearchClose } = options;

    setTableAction('onSearchClose');
    if (onSearchClose) onSearchClose();
    searchClose();

    setIconActive(null);
    setShowSearch(false);
    setSearchText(null);
  };

  const handleSearch = value => {
    setSearchText(value);
    searchTextUpdate(value);
  };

  const handleSearchIconClick = () => {
    if (showSearchState && !searchTextState) {
      hideSearch();
    } else {
      setActiveIcon('search');
    }
  };

  const Tooltip = components.Tooltip || MuiTooltip;
  const { search, downloadCsv, print, viewColumns, filterTable } = options.textLabels.toolbar;

  const filterPopoverExit = () => {
    setHideFilterPopover(false);
    setActiveIcon();
  };

  const closeFilterPopover = () => {
    setHideFilterPopover(true);
  };

  return (
    <Toolbar
      className={options.responsive !== RESPONSIVE_FULL_WIDTH_NAME ? classes.root : classes.fullWidthRoot}
      role={'toolbar'}
      aria-label={'Table Toolbar'}>
      <div className={options.responsive !== RESPONSIVE_FULL_WIDTH_NAME ? classes.left : classes.fullWidthLeft}>
        {showSearchState === true ? (
          options.customSearchRender ? (
            options.customSearchRender(searchTextState, handleSearch, hideSearch, options)
          ) : (
            <TableSearch searchText={searchTextState} onSearch={handleSearch} onHide={hideSearch} options={options} />
          )
        ) : typeof title !== 'string' ? (
          title
        ) : (
          <div className={classes.titleRoot} aria-hidden={'true'}>
            <Typography
              variant="h6"
              className={
                options.responsive !== RESPONSIVE_FULL_WIDTH_NAME ? classes.titleText : classes.fullWidthTitleText
              }>
              {title}
            </Typography>
          </div>
        )}
      </div>
      <div className={options.responsive !== RESPONSIVE_FULL_WIDTH_NAME ? classes.actions : classes.fullWidthActions}>
        {options.search && (
          <Tooltip title={search} disableFocusListener>
            <IconButton
              aria-label={search}
              data-testid={search + '-iconButton'}
              classes={{ root: getActiveIcon(classes, 'search') }}
              onClick={handleSearchIconClick}>
              <SearchIcon />
            </IconButton>
          </Tooltip>
        )}
        {options.download && (
          <Tooltip title={downloadCsv}>
            <IconButton
              data-testid={downloadCsv + '-iconButton'}
              aria-label={downloadCsv}
              classes={{ root: classes.icon }}
              onClick={handleCSVDownload}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        )}
        {options.print && (
          <span>
            <ReactToPrint
              trigger={() => (
                <span>
                  <Tooltip title={print}>
                    <IconButton data-testid={print + '-iconButton'} aria-label={print} classes={{ root: classes.icon }}>
                      <PrintIcon />
                    </IconButton>
                  </Tooltip>
                </span>
              )}
              content={() => tableRef()}
            />
          </span>
        )}
        {options.viewColumns && (
          <Popover
            refExit={() => setActiveIcon()}
            classes={{ closeIcon: classes.filterCloseIcon }}
            trigger={
              <Tooltip title={viewColumns} disableFocusListener>
                <IconButton
                  data-testid={viewColumns + '-iconButton'}
                  aria-label={viewColumns}
                  classes={{ root: getActiveIcon(classes, 'viewcolumns') }}
                  onClick={() => setActiveIcon('viewcolumns')}>
                  <ViewColumnIcon />
                </IconButton>
              </Tooltip>
            }
            content={<TableViewCol data={data} columns={columns} options={options} onColumnUpdate={toggleViewColumn} />}
          />
        )}
        {options.filter && (
          <Popover
            refExit={filterPopoverExit}
            hide={hideFilterPopover}
            classes={{ paper: classes.filterPaper, closeIcon: classes.filterCloseIcon }}
            trigger={
              <Tooltip title={filterTable} disableFocusListener>
                <IconButton
                  data-testid={filterTable + '-iconButton'}
                  aria-label={filterTable}
                  classes={{ root: getActiveIcon(classes, 'filter') }}
                  onClick={() => setActiveIcon('filter')}>
                  <FilterIcon />
                </IconButton>
              </Tooltip>
            }
            content={
              <TableFilter
                customFooter={options.customFilterDialogFooter}
                columns={columns}
                options={options}
                filterList={filterList}
                filterData={filterData}
                onFilterUpdate={filterUpdate}
                onFilterReset={resetFilters}
                handleClose={closeFilterPopover}
                updateFilterByType={updateFilterByType}
              />
            }
          />
        )}
        {options.customToolbar && options.customToolbar()}
      </div>
    </Toolbar>
  );
};

export default TableToolbar;
