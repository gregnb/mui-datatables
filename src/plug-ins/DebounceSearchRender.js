import React from 'react';
import { styled } from '@mui/material/styles';
import Grow from '@mui/material/Grow';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';

const PREFIX = 'MUIDataTableSearch';

const classes = {
  main: `${PREFIX}-main`,
  searchIcon: `${PREFIX}-searchIcon`,
  searchText: `${PREFIX}-searchText`,
  clearIcon: `${PREFIX}-clearIcon`,
};

const StyledDebounceTableSearch = styled(Grow)(({ theme }) => ({
  [`& .${classes.main}`]: {
    display: 'flex',
    flex: '1 0 auto',
    alignItems: 'center',
  },

  [`& .${classes.searchIcon}`]: {
    color: theme.palette.text.secondary,
    marginRight: '8px',
  },

  [`& .${classes.searchText}`]: {
    flex: '0.8 0',
  },

  [`& .${classes.clearIcon}`]: {
    '&:hover': {
      color: theme.palette.error.main,
    },
  },
}));

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
    const { options, onHide, searchText, debounceWait } = this.props;

    const debouncedSearch = debounce(value => {
      this.props.onSearch(value);
    }, debounceWait);

    const clearIconVisibility = options.searchAlwaysOpen ? 'hidden' : 'visible';

    return (
      <StyledDebounceTableSearch appear in={true} timeout={300}>
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
          <IconButton className={classes.clearIcon} style={{ visibility: clearIconVisibility }} onClick={onHide}>
            <ClearIcon />
          </IconButton>
        </div>
      </StyledDebounceTableSearch>
    );
  }
}

var DebounceTableSearch = _DebounceTableSearch;
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
