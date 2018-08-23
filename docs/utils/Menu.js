import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core";
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';

const styles = theme => ({
    list: {
        width: 250,
    },
    listTitle: {
        fontSize: 25,
    }
});

const sandboxes = [
    { name: "Simple", href: "https://codesandbox.io/s/new" },
    { name: "Customize columns", href: "https://codesandbox.io/s/new" },
    { name: "Customize footer", href: "https://codesandbox.io/s/new" },
    { name: "Customize styling", href: "https://codesandbox.io/s/new" },
    { name: "Customize toolbar", href: "https://codesandbox.io/s/new" },
    { name: "Customize toolbarselect", href: "https://codesandbox.io/s/new" },
    { name: "Resizable columns", href: "https://codesandbox.io/s/new" },
    { name: "Serverside options", href: "https://codesandbox.io/s/new" },
    { name: "Text localization", href: "https://codesandbox.io/s/new" },
];

const Exemple = props => (
    <ListItem button>
        <ListItemText onClick={() => window.open(props.href, "_blank")} primary={props.name} />
    </ListItem>
);

Exemple.propTypes = {
    href: PropTypes.string,
    name: PropTypes.string,
};

class Menu extends React.Component {
    render() {
        const { isOpen, toggle, classes } = this.props;
        return (
            <Drawer open={isOpen} onClose={toggle} >
                <div
                    tabIndex={0}
                    role="button"
                    onClick={toggle}
                    onKeyDown={toggle}
                    className={classes.list}
                >
                    <List
                        component="nav"
                        subheader={<ListSubheader className={classes.listTitle} component="h2">Exemples</ListSubheader>}
                    >
                        {sandboxes.map((item) => (
                            <Exemple href={item.href} name={item.name} />
                        ))}
                    </List>
                </div>
            </Drawer>
        );
    }
}

Menu.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Menu);