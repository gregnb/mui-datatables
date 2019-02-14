import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import prism from 'prismjs';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-bash';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({});

class CodeSnippet extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    language: PropTypes.string,
    text: PropTypes.string.isRequired,
  };

  static defaultProps = {
    language: 'jsx',
  };

  render() {
    const { classes, language, text } = this.props;
    const hightlightedCode = prism.highlight(text, prism.languages[language]);

    return (
      <Paper elevation={4}>
        <pre>
          <code className={`language-${language}`} dangerouslySetInnerHTML={{ __html: hightlightedCode }} />
        </pre>
      </Paper>
    );
  }
}

export default withStyles(styles)(CodeSnippet);
