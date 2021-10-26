import React, { useEffect } from 'react';
import Grow from '@mui/material/Grow';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import { withStyles } from '@mui/styles';

function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this,
      args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

const defaultStyles = theme => ({
  main: {
    display: 'flex',
    flex: '1 0 auto',
    alignItems: 'center',
  },
  searchIcon: {
    color: theme.palette.text.secondary,
    marginRight: '8px',
  },
  searchText: {
    flex: '0.8 0',
  },
  clearIcon: {
    '&:hover': {
      color: theme.palette.error.main,
    },
  },
});

class _DebounceTableSearch extends React.Component {
  handleTextChangeWrapper = debouncedSearch => {
    return function(event) {
      debouncedSearch(event.target.value);
    };
  };

  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown, false);
  }

  onKeyDown = event => {
    if (event.keyCode === 27) {
      this.props.onHide();
    }
  };

  render() {
    const { classes, options, onHide, searchText, debounceWait } = this.props;

    const debouncedSearch = debounce(value => {
      this.props.onSearch(value);
    }, debounceWait);

    return (
      <Grow appear in={true} timeout={300}>
        <div className={classes.main}>
          <SearchIcon className={classes.searchIcon} />
          <TextField
            variant={'standard'}
            className={classes.searchText}
            autoFocus={true}
            InputProps={{
              'data-test-id': options.textLabels.toolbar.search,
              'aria-label': options.textLabels.toolbar.search,
            }}
            defaultValue={searchText}
            onChange={this.handleTextChangeWrapper(debouncedSearch)}
            fullWidth={true}
            inputRef={el => (this.searchField = el)}
            placeholder={options.searchPlaceholder}
            {...(options.searchProps ? options.searchProps : {})}
          />
          <IconButton className={classes.clearIcon} onClick={onHide}>
            <ClearIcon />
          </IconButton>
        </div>
      </Grow>
    );
  }
}

var DebounceTableSearch = withStyles(defaultStyles, { name: 'MUIDataTableSearch' })(_DebounceTableSearch);
export { DebounceTableSearch };

export function debounceSearchRender(debounceWait = 200) {
  return (searchText, handleSearch, hideSearch, options) => {
    return (
      <DebounceTableSearch
        searchText={searchText}
        onSearch={handleSearch}
        onHide={hideSearch}
        options={options}
        debounceWait={debounceWait}
      />
    );
  };
}
