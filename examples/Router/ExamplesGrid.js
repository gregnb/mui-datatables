import {Link} from "react-router-dom";
import {Card, CardContent, Grid, Typography} from "@material-ui/core";
import React from "react";
import examples from "../examples";
import {withStyles} from "@material-ui/core/styles/index";

const styles = {
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
    },
    card: {
        '&:hover': {
            background: 'lightgrey',
            fontWeight: 500,
        }
    },
    cardContent: {
        '&:last-child': {
            padding: 8,
        }
    },
    link: {
        textDecoration: 'none',
    },
    label: {
        fontWeight: 'inherit'
    }
};

function ExamplesGrid(props) {
    const {classes} = props;

    // Sort Examples alphabetically
    const examplesSorted = {};
    Object.keys(examples).sort().forEach(function (key) {
        examplesSorted[key] = examples[key];
    });

    const examplesSortedKeys = Object.keys(examplesSorted);

    return <React.Fragment>
        <Typography variant="h5" align="center">Choose an Example</Typography>
        <Typography variant="subtitle2" align="center">({examplesSortedKeys.length}) Examples</Typography>
        <Grid container className={classes.container} spacing={16}>
            {examplesSortedKeys.map((label, index) => (
                <Grid key={index} item md={2}>
                    <Link className={classes.link} to={`/${label.replace(/\s+/g, '-').toLowerCase()}`}>
                        <Card className={classes.card}>
                            <CardContent className={classes.cardContent}>
                                <Typography variant="subtitle1" className={classes.label} align="center">{label}</Typography>
                            </CardContent>
                        </Card>
                    </Link>
                </Grid>
            ))}
        </Grid>
    </React.Fragment>;
}

export default withStyles(styles)(ExamplesGrid);
