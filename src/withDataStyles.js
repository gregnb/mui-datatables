import React from "react";
import memoize from "lodash.memoize";
import merge from "lodash.merge";
import get from "lodash.get";
import { withStyles } from "material-ui/styles";

const getStyle = (obj, name) => {
  return get(obj, "styles." + name, null);
};

const withDataStyles = styles => component =>
  class extends React.Component {
    mergeStyles = memoize(
      (defaultStyle, provided) => merge({ ...defaultStyle }, provided),
      (...args) => JSON.stringify(args),
    );

    render() {
      const { classes, ...otherProps } = this.props;
      const finalStyles = this.mergeStyles(styles(), classes ? { ...classes } : {});

      const WrappedComponent = withStyles(finalStyles)(component);
      return <WrappedComponent {...otherProps} />;
    }
  };

export { getStyle, withDataStyles };
