import React from 'react';
import { styled } from '@mui/material/styles';
import Grow from '@mui/material/Grow';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
const PREFIX = 'CustomSearchRender';

const classes = {
  main: `${PREFIX}-main`,
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

class CustomSearchRender extends React.Component {
  handleTextChange = event => {
    this.props.onSearch(event.target.value);
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
    const {  options, onHide, searchText } = this.props;

    return (
      <StyledGrow appear in={true} timeout={300}>
        <div className={classes.main} ref={el => (this.rootRef = el)}>
          <TextField
            placeholder={'Custom TableSearch without search icon'}
            className={classes.searchText}
            InputProps={{
              'aria-label': options.textLabels.toolbar.search,
            }}
            value={searchText || ''}
            onChange={this.handleTextChange}
            fullWidth={true}
            inputRef={el => (this.searchField = el)}
          />
          <IconButton className={classes.clearIcon} onClick={onHide}>
            <ClearIcon />
          </IconButton>
        </div>
      </StyledGrow>
    );
  }
}

export default (CustomSearchRender);
