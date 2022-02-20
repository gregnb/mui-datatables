import {Link} from "react-router-dom";
import { styled } from '@mui/material/styles';
import {Card, CardContent, Grid, Typography} from "@mui/material";
import React from "react";
import examples from "../examples";
import TextField from '@mui/material/TextField';

const PREFIX = 'ExamplesGrid';

const classes = {
  container: `${PREFIX}-container`,
  card: `${PREFIX}-card`,
  cardContent: `${PREFIX}-cardContent`,
  link: `${PREFIX}-link`,
  label: `${PREFIX}-label`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')({
    [`& .${classes.container}`]: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
    },
    [`& .${classes.card}`]: {
        '&:hover': {
            background: 'lightgrey',
            fontWeight: 500,
        }
    },
    [`& .${classes.cardContent}`]: {
        '&:last-child': {
            padding: 8,
        }
    },
    [`& .${classes.link}`]: {
        textDecoration: 'none',
    },
    [`& .${classes.label}`]: {
        fontWeight: 'inherit'
    }
});

class ExamplesGrid extends React.Component {

  state = {
    searchVal: ''
  }

  setSearchVal = (val) => {
    this.setState({
      searchVal: val
    });
  }

  render() {
    const {classes} = this.props;

    // Sort Examples alphabetically
    const examplesSorted = {};
    Object.keys(examples).sort().forEach(function (key) {
        examplesSorted[key] = examples[key];
    });

    const examplesSortedKeys = Object.keys(examplesSorted).filter((item) => {
      if (this.state.searchVal === '') return true;
      console.dir(item);
      return item.toLowerCase().indexOf( this.state.searchVal.toLowerCase() ) !== -1 ? true : false;
    });

    return (
      <Root>
        <Typography variant="h5" align="center">Choose an Example</Typography>
        <Typography variant="subtitle2" align="center">({examplesSortedKeys.length}) Examples</Typography>

        <Typography variant="subtitle2" align="center" style={{margin:'10px'}}>
          <TextField placeholder="Search Examples" value={this.state.searchVal} onChange={(e) => this.setSearchVal(e.target.value)} />
        </Typography>

        <Grid container className={classes.container} spacing={1}>
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
      </Root>
    );
  }
}

export default (ExamplesGrid);
