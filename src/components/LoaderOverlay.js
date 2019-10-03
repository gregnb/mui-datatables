import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { fade } from '@material-ui/core/styles/colorManipulator';

const styles = theme => ({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 110,
    display: 'flex',
    width: '100%',
    height: '100%',
    backgroundColor: fade(theme.palette.background.paper, 0.7)
  },
  progressContainer: {
    margin: 'auto'
  }
})

class LoaderOverlay extends React.Component {
  render() {
    const { classes } = this.props;
    return(
      <div className={classes.overlay}>
        <div className={classes.progressContainer}>
          <CircularProgress />
        </div>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(LoaderOverlay);