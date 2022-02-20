import React from 'react';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';

const PREFIX = 'CustomToolbar';

const classes = {
  iconButton: `${PREFIX}-iconButton`,
};

const StyledTooltip = styled(Tooltip)({
  [`& .${classes.iconButton}`]: {},
});

class CustomToolbar extends React.Component {
  handleClick = () => {
    console.log('clicked on icon!');
  };

  render() {
    const {} = this.props;

    return (
      <StyledTooltip title={'custom icon'}>
        <IconButton className={classes.iconButton} onClick={this.handleClick}>
          <AddIcon className={classes.deleteIcon} />
        </IconButton>
      </StyledTooltip>
    );
  }
}

export default CustomToolbar;
