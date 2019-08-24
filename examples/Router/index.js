import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter as Router, Route, Switch} from 'react-router-dom';
import {withStyles} from "@material-ui/core/styles/index";
import ExamplesGrid from "./ExamplesGrid";
import examples from "../examples";

const styles = {
    root: {
        display: 'flex',
        justifyContent: 'center',
    },
    contentWrapper: {
        width: '100%',
    },
};

function Examples(props) {
    const {classes} = props;
    return <main className={classes.root}>
        <div className={classes.contentWrapper}>
            <Router hashType="noslash">
                <Switch>
                    <Route path="/" exact render={() => <ExamplesGrid examples={examples}/>}/>
                    {Object.keys(examples).map((label, index) => (
                        <Route key={index} path={`/${label.replace(/\s+/g, '-').toLowerCase()}`} exact component={examples[label]}/>
                    ))}
                </Switch>
            </Router>
        </div>
    </main>;
}

const StyledExamples = withStyles(styles)(Examples);

ReactDOM.render(<StyledExamples/>, document.getElementById('app-root'));
