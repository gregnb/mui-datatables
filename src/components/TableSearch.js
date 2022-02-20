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
  clearIcon: `${PREFIX}-clearIcon`
};

const StyledGrow = styled(Grow)((
  {
    theme
  }
) => ({
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
  }
}));

const TableSearch = ({ options, searchText, onSearch, onHide }) => {


  const handleTextChange = event => {
    onSearch(event.target.value);
  };

  const onKeyDown = event => {
    if (event.key === 'Escape') {
      onHide();
    }
  };

  const clearIconVisibility = options.searchAlwaysOpen ? 'hidden' : 'visible';

  return (
    <StyledGrow appear in={true} timeout={300}>
      <div className={classes.main}>
        <SearchIcon className={classes.searchIcon} />
        <TextField
          className={classes.searchText}
          autoFocus={true}
          variant={'standard'}
          InputProps={{
            'data-test-id': options.textLabels.toolbar.search,
          }}
          inputProps={{
            'aria-label': options.textLabels.toolbar.search,
          }}
          value={searchText || ''}
          onKeyDown={onKeyDown}
          onChange={handleTextChange}
          fullWidth={true}
          placeholder={options.searchPlaceholder}
          {...(options.searchProps ? options.searchProps : {})}
        />
        <IconButton className={classes.clearIcon} style={{ visibility: clearIconVisibility }} onClick={onHide}>
          <ClearIcon />
        </IconButton>
      </div>
    </StyledGrow>
  );
};

export default TableSearch;
