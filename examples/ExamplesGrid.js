import {Link} from "react-router-dom";
import {Card, CardContent, Grid, Typography} from "@material-ui/core";
import React from "react";
import examples from "./examples";
import {withStyles} from "@material-ui/core/styles";

const styles = {
    gridContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        marginTop: 16,
    }
};

function ExamplesGrid(props) {
    const {classes} = props;

    // Sort Examples alphabetically
    const examplesSorted = {};
    Object.keys(examples).sort().forEach(function (key) {
        examplesSorted[key] = examples[key];
    });

    return <React.Fragment>
        <Typography variant="h5" align='center'>Choose an Example</Typography>
        <Grid container className={classes.gridContainer} spacing={16}>
            {Object.keys(examplesSorted).map((label, index) => (
                <Grid key={index} item md={2}>
                    <Link to={`/${label}`}>
                        <Card>
                            <CardContent>
                                {label}
                            </CardContent>
                        </Card>
                    </Link>
                </Grid>
            ))}
        </Grid>
    </React.Fragment>;
}

export default withStyles(styles)(ExamplesGrid);
