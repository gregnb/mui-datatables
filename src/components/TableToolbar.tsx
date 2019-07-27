import React from 'react';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
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
import styled from '../styled';
import { createCSVDownload } from '../utils';
import { createStyles, Theme } from '@material-ui/core';
import { StyleRules } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';

export const defaultToolbarStyles = (theme: Theme, props: TableToolbarProps) => createStyles({
  root: {},
  left: {
    flex: '1 1 auto',
  },
  actions: {
    flex: '1 1 auto',
    textAlign: 'right',
  },
  titleRoot: {},
  titleText: {},
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
  searchIcon: {
    display: 'inline-flex',
    marginTop: '10px',
    marginRight: '8px',
  },
  ...(props.options.responsive ? { ...responsiveToolbarStyles(theme) } : {}),
});

export const responsiveToolbarStyles = (theme: Theme) => ({
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
  //'@media screen and (max-width: 480px)': {},
});

type StyleRulesCallback<ClassKey extends string = string> = (
  theme: Theme,
  props: TableToolbarProps
) => StyleRules<ClassKey>;

type WithStyles<
  T extends string | StyleRules | StyleRulesCallback,
  IncludeTheme extends boolean | undefined = false
> = (IncludeTheme extends true ? { theme: Theme, props: TableToolbarProps } : {}) & {
  classes: ClassNameMap<
    T extends string
      ? T
      : T extends StyleRulesCallback<infer K>
      ? K
      : T extends StyleRules<infer K>
      ? K
      : never
  >;
};

interface TableToolbarProps extends WithStyles<typeof defaultToolbarStyles> {
  searchText: string;
  options;
  data;
  columns;
  setTableAction: (arg: string) => void;
  searchTextUpdate: (searchText: string | null) => void;
  filterData;
  filterList;
  filterUpdate;
  resetFilters;
  toggleViewColumn;
  title;
  tableRef;
}

class TableToolbar extends React.Component<TableToolbarProps> {

  private searchButton;

  state = {
    iconActive: null,
    showSearch: Boolean(this.props.searchText || this.props.options.searchText),
    searchText: this.props.searchText || null,
  };

  componentDidUpdate(prevProps) {
    if (this.props.searchText !== prevProps.searchText) {
      this.setState({ searchText: this.props.searchText });
    }
  }

  handleCSVDownload = () => {
    const { data, columns, options } = this.props;
    createCSVDownload(columns, data, options);
  };

  setActiveIcon = iconName => {
    this.setState(() => ({
      showSearch: this.isSearchShown(iconName),
      iconActive: iconName,
    }));
  };

  isSearchShown = iconName => {
    let nextVal = false;
    if (this.state.showSearch) {
      if (this.state.searchText) {
        nextVal = true;
      } else {
        const { onSearchClose } = this.props.options;
        if (onSearchClose) onSearchClose();
        nextVal = false;
      }
    } else if (iconName === 'search') {
      nextVal = this.showSearch();
    }
    return nextVal;
  };

  getActiveIcon = (styles, iconName) => {
    return this.state.iconActive !== iconName ? styles.icon : styles.iconActive;
  };

  showSearch = () => {
    !!this.props.options.onSearchOpen && this.props.options.onSearchOpen();
    this.props.setTableAction('onSearchOpen');
    return true;
  };

  hideSearch = () => {
    const { onSearchClose } = this.props.options;

    if (onSearchClose) onSearchClose();
    this.props.searchTextUpdate(null);

    this.setState(() => ({
      iconActive: null,
      showSearch: false,
      searchText: null,
    }));

    this.searchButton.focus();
  };

  handleSearch = value => {
    this.setState({ searchText: value });
    this.props.searchTextUpdate(value);
  };

  render() {
    const {
      data,
      options,
      classes,
      columns,
      filterData,
      filterList,
      filterUpdate,
      resetFilters,
      toggleViewColumn,
      title,
      tableRef,
    } = this.props;

    const { search, downloadCsv, print, viewColumns, filterTable } = options.textLabels.toolbar;
    const { showSearch, searchText } = this.state;

    return (
      <Toolbar className={classes.root} role={'toolbar'} aria-label={'Table Toolbar'}>
        <div className={classes.left}>
          {showSearch === true ? (
            <TableSearch
              // @ts-ignore
              searchText={searchText}
              onSearch={this.handleSearch}
              onHide={this.hideSearch}
              options={options}
            />
          ) : typeof title !== 'string' ? (
            title
          ) : (
            <div className={classes.titleRoot} aria-hidden={'true'}>
              <Typography variant="h6" className={classes.titleText}>
                {title}
              </Typography>
            </div>
          )}
        </div>
        <div className={classes.actions}>
          {options.search && (
            <Tooltip title={search} disableFocusListener>
              <IconButton
                aria-label={search}
                buttonRef={el => (this.searchButton = el)}
                classes={{ root: this.getActiveIcon(classes, 'search') }}
                onClick={this.setActiveIcon.bind(null, 'search')}>
                <SearchIcon />
              </IconButton>
            </Tooltip>
          )}
          {options.download && (
            <Tooltip title={downloadCsv}>
              <IconButton aria-label={downloadCsv} classes={{ root: classes.icon }} onClick={this.handleCSVDownload}>
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          )}
          {options.print && (
            <span>
              <ReactToPrint
                trigger={() => (
                  <Tooltip title={print}>
                    <IconButton aria-label={print} classes={{ root: classes.icon }}>
                      <PrintIcon />
                    </IconButton>
                  </Tooltip>
                )}
                content={() => this.props.tableRef()}
              />
            </span>
          )}
          {options.viewColumns && (
            <Popover
              refExit={this.setActiveIcon.bind(null)}
              trigger={
                <Tooltip title={viewColumns} disableFocusListener>
                  <IconButton
                    aria-label={viewColumns}
                    classes={{ root: this.getActiveIcon(classes, 'viewcolumns') }}
                    onClick={this.setActiveIcon.bind(null, 'viewcolumns')}>
                    <ViewColumnIcon />
                  </IconButton>
                </Tooltip>
              }
              content={
                <TableViewCol data={data} columns={columns} options={options} onColumnUpdate={toggleViewColumn} />
              }
            />
          )}
          {options.filter && (
            // @ts-ignore
            <Popover
              refExit={this.setActiveIcon.bind(null)}
              // TODO fix me
              classes={{ paper: classes.filterPaper }}
              trigger={
                <Tooltip title={filterTable} disableFocusListener>
                  <IconButton
                    aria-label={filterTable}
                    classes={{ root: this.getActiveIcon(classes, 'filter') }}
                    onClick={this.setActiveIcon.bind(null, 'filter')}>
                    <FilterIcon />
                  </IconButton>
                </Tooltip>
              }
              content={
                <TableFilter
                  columns={columns}
                  options={options}
                  filterList={filterList}
                  filterData={filterData}
                  onFilterUpdate={filterUpdate}
                  onFilterReset={resetFilters}
                />
              }
            />
          )}
          {options.customToolbar && options.customToolbar()}
        </div>
      </Toolbar>
    );
  }
}

export default styled(TableToolbar)(defaultToolbarStyles, { name: 'MUIDataTableToolbar' });
