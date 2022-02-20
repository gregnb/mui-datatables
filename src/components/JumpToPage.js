import React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { getPageValue } from '../utils.js';
import clsx from 'clsx';

const PREFIX = 'MUIDataTableJumpToPage';

const classes = {
  root: `${PREFIX}-root`,
  caption: `${PREFIX}-caption`,
  selectRoot: `${PREFIX}-selectRoot`,
  select: `${PREFIX}-select`,
  selectIcon: `${PREFIX}-selectIcon`,
  input: `${PREFIX}-input`
};

const StyledToolbar = styled(Toolbar)((
  {
    theme
  }
) => ({
  [`&.${classes.root}`]: {
    color: theme.palette.text.primary,
  },

  [`& .${classes.caption}`]: {
    flexShrink: 0,
  },

  /*  Styles applied to the Select component root element */
  [`& .${classes.selectRoot}`]: {
    marginRight: 32,
    marginLeft: 8,
  },

  [`& .${classes.select}`]: {
    paddingTop: 6,
    paddingBottom: 7,
    paddingLeft: 8,
    paddingRight: 24,
    textAlign: 'right',
    textAlignLast: 'right',
    fontSize: theme.typography.pxToRem(14),
  },

  /* Styles applied to Select component icon class */
  [`& .${classes.selectIcon}`]: {},

  /* Styles applied to InputBase component */
  [`& .${classes.input}`]: {
    color: 'inhert',
    fontSize: 'inhert',
    flexShrink: 0,
  }
}));

function JumpToPage(props) {


  const handlePageChange = event => {
    props.changePage(parseInt(event.target.value, 10));
  };

  const { count, textLabels, rowsPerPage, page, changePage } = props;

  const textLabel = textLabels.pagination.jumpToPage;

  let pages = [];
  let lastPage = Math.min(1000, getPageValue(count, rowsPerPage, 1000000));

  for (let ii = 0; ii <= lastPage; ii++) {
    pages.push(ii);
  }
  const MenuItemComponent = MenuItem;

  let myStyle = {
    display: 'flex',
    minHeight: '52px',
    alignItems: 'center',
  };

  return (
    <StyledToolbar style={myStyle} className={classes.root}>
      <Typography color="inherit" variant="body2" className={classes.caption}>
        {textLabel}
      </Typography>
      <Select
        classes={{ select: classes.select, icon: classes.selectIcon }}
        input={<InputBase className={clsx(classes.input, classes.selectRoot)} />}
        value={getPageValue(count, rowsPerPage, page)}
        onChange={handlePageChange}
        style={{ marginRight: 0 }}>
        {pages.map(pageVal => (
          <MenuItemComponent className={classes.menuItem} key={pageVal} value={pageVal}>
            {pageVal + 1}
          </MenuItemComponent>
        ))}
      </Select>
    </StyledToolbar>
  );
}

JumpToPage.propTypes = {
  count: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  textLabels: PropTypes.object.isRequired,
};

export default JumpToPage;
