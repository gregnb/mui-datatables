import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

const CustomToolbar = props => {
  return (
    <span>
      <Tooltip title={'XLS Download'}>
        <IconButton onClick={props.handleSXLSDownload}>
          <CloudDownloadIcon />
        </IconButton>
      </Tooltip>
    </span>
  );
};

export default CustomToolbar;
