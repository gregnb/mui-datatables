import React from 'react';
import PropTypes from 'prop-types';
import merge from 'lodash.merge';
import { withStyles } from '@material-ui/core/styles';

/*
 *  Material-UI does not yet support ability to grab props within style()
 *  https://github.com/mui-org/material-ui/issues/7633
 *
 *  This is a workaround provided from the thread
 */

const styles = (theme, props, style) => {
  return typeof style === 'function' ? style(theme, props) : style;
};

class StyledComponent extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
  };

  render() {
    const { classes, className = '', WrappedComponent, ...passThroughProps } = this.props;

    return <WrappedComponent classes={classes} className={className} {...passThroughProps} />;
  }
}

const styled = (WrappedComponent, customProps = {}) => {
  return (style, options = {}) => {
    const HOCProps = WrappedComponent => {
      return class _HOCProps extends React.Component {
        constructor(props) {
          super(props);
          this.FinalComponent = withStyles(theme => {
            const defaultStyles = styles(theme, props, style);
            const mergedStyles = merge(defaultStyles, props.styles ? props.styles : {});
            return mergedStyles;
          }, options)(StyledComponent);
        }

        render() {
          const { styles, ...otherProps } = this.props;
          return <this.FinalComponent {...customProps} {...otherProps} WrappedComponent={WrappedComponent} />;
        }
      };
    };
    return HOCProps(WrappedComponent);
  };
};

export default styled;
