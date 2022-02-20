import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Switch, withRouter } from 'react-router-dom';
import { withStyles } from 'tss-react/mui';
import ExamplesGrid from './ExamplesGrid';
import examples from '../examples';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

const styles = {
  root: {
    display: 'flex',
    justifyContent: 'center',
  },
  contentWrapper: {
    width: '100%',
  },
};

const muiCache = createCache({
  key: 'mui-datatables',
  prepend: true,
});

class Examples extends React.Component {
  returnHome = () => {
    this.props.history.push('/');
  };

  render() {
    const { classes } = this.props;

    var returnHomeStyle = { padding: '0px', margin: '20px 0 20px 0' };

    const defaultTheme = createTheme();

    return (
      <CacheProvider value={muiCache}>
        <ThemeProvider theme={defaultTheme}>
          <main className={classes.root}>
            <div className={classes.contentWrapper}>
              <Switch>
                <Route path="/" exact render={() => <ExamplesGrid examples={examples} />} />
                {Object.keys(examples).map((label, index) => (
                  <Route
                    key={index}
                    path={`/${label.replace(/\s+/g, '-').toLowerCase()}`}
                    exact
                    component={examples[label]}
                  />
                ))}
              </Switch>
              <div>
                {this.props.location.pathname !== '/' && (
                  <div style={returnHomeStyle}>
                    <Button color="primary" onClick={this.returnHome}>
                      Back to Example Index
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </main>
        </ThemeProvider>
      </CacheProvider>
    );
  }
}

const StyledExamples = withRouter(withStyles(Examples, styles));

function App() {
  return (
    <Router hashType="noslash">
      <StyledExamples />
    </Router>
  );
}

ReactDOM.render(<App />, document.getElementById('app-root'));
