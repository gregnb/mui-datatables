import React from "react";
import PropTypes from 'prop-types';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select'

class Titles extends React.Component {
  static propTypes = {
    value: PropTypes.string.isRequired
  }
    
  state = {
    value: this.props.value
  };
  
  handleChange = event => {
    this.setState({ value: event.target.value });
  };

  render() {
    
    const { value } = this.state;
    const titles = ["Agency Legal Counsel", "Attorney", "Business Analyst", "Business Consultant", "Business Management Analyst", "Business Process Consultant", "Commercial Specialist", "Computer Scientist", "Corporate Counselor", "Industrial Analyst"];
    
    return (
      <FormControl>
        <Select value={value} onChange={this.handleChange} style={{fontSize: 'inherit'}}>
          { titles.map((title, index) =>
            <MenuItem key={index} value={title}>{title}</MenuItem>
          )}
        </Select>
      </FormControl>
    );

  }
}

export default Titles;