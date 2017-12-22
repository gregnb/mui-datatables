import React from "react";
import PropTypes from "prop-types";
import { findDOMNode } from "react-dom";
import Grow from "material-ui/transitions/Grow";
import TextField from "material-ui/TextField";
import Typography from "material-ui/Typography";
import SearchIcon from "material-ui-icons/Search";
import IconButton from "material-ui/IconButton";
import ClearIcon from "material-ui-icons/Clear";
import FilterIcon from "material-ui-icons/FilterList";
import { getStyle, DataStyles } from "./DataStyles";

const defaultSearchStyles = {
  main: {
    display: "flex",
    flex: "1 0 auto",
  },
  searchIcon: {
    marginTop: "10px",
    marginRight: "8px",
  },
  searchText: {
    flex: "0.5 0",
  },
  clearIcon: {
    "&:hover": {
      color: "#FF0000",
    },
  },
};

/*
  issues to work out:
    - pass hooks from tabletoolbar to close this
    - return focus back to the search icon
    - WCAG issues. catch ESCAPE key to close

    use the rootRef
  
    const doc = ownerDocument(ReactDOM.findDOMNode(this));
    this.props.modalManager.add(this);
    this.onDocumentKeyUpListener = addEventListener(doc, 'keyup', this.handleDocumentKeyUp);

*/

class MUIDataTableSearch extends React.Component {
  handleTextChange = event => {
    this.props.onSearch(event.target.value);
  };

  render() {
    const { classes, onHide, onSearch, options } = this.props;

    return (
      <DataStyles defaultStyles={defaultSearchStyles} name="MUIDataTableSearch" styles={getStyle(options, "search")}>
        {headStyles => (
          <Grow appear in={true} timeout={300}>
            <div className={headStyles.main} ref={el => (this.rootRef = el)}>
              <SearchIcon className={headStyles.searchIcon} />
              <TextField
                className={headStyles.searchText}
                autoFocus={true}
                InputProps={{
                  "aria-label": "Search Table",
                }}
                onChange={this.handleTextChange}
                fullWidth={true}
                inputRef={el => (this.searchField = el)}
              />
              <IconButton className={headStyles.clearIcon} onClick={onHide}>
                <ClearIcon />
              </IconButton>
            </div>
          </Grow>
        )}
      </DataStyles>
    );
  }
}

export default MUIDataTableSearch;
