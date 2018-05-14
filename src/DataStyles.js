import React from "react";
import merge from "lodash.merge";
import get from "lodash.get";
import { withStyles } from "@material-ui/core/styles";

const getStyle = (obj, name) => {
  return get(obj, "styles." + name, null);
};

const stylePass = (displayName, setFn) => {
  const result = class StylePass extends React.Component {
    componentWillMount() {
      setFn(this.props.classes);
    }

    componentWillReceiveProps(nextProps) {
      if (this.props.classes !== nextProps.classes) setFn(nextProps.classes);
    }

    render() {
      return this.props.children;
    }
  };
  result.displayName = displayName;
  return result;
};

/**
 * This wrapper was created because I needed the ability to pass styles as a prop that
 * were extracted from an object that was a prop as well. In order to avoid name collisions
 * I needed to be able to extract deeply with a dot notation from user suppplied styling.
 *
 */

class DataStyles extends React.Component {
  state = {
    data: null,
  };

  setStyleClass = data => {
    this.setState(() => ({
      styleData: data,
    }));
  };

  constructor(props) {
    super(props);
    this.buildComponent(props);
  }

  componentWillReceieveProps(nextProps) {
    if (nextProps.styles !== this.props.styles) this.buildComponent(nextProps);
  }

  buildComponent(props) {
    const defaultStyles = props.defaultStyles ? props.defaultStyles : {};
    const finalStyles = merge(defaultStyles, props.styles);

    // just a pass-through
    this.component = withStyles(finalStyles)(stylePass(props.name, this.setStyleClass));
  }

  render() {
    const { children } = this.props;
    const WrappedComponent = this.component;

    return <WrappedComponent>{this.state.styleData ? children(this.state.styleData) : false}</WrappedComponent>;
  }
}

export { DataStyles, getStyle };
