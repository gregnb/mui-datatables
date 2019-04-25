import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import TableCell from '@material-ui/core/TableCell';
import { withStyles } from '@material-ui/core/styles';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

const defaultSelectCellStyles = theme => ({
  root: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  sticky: {
    width: '75px',
    maxWidth: '75px',
    top: 0,
    zIndex: 2,
  },
  fixedHeader: {
    top: '0px',
    left: '0px',
    zIndex: 3,
  },
  icon: {
    cursor: 'pointer',
    transition: 'transform 0.25s',
  },
  expanded: {
    transform: 'rotate(90deg)',
  },
  hide: {
    visibility: 'hidden',
  },
  headerCell: {
    zIndex: 4,
    backgroundColor: theme.palette.background.paper,
  },
  checkboxRoot: {
    '&$checked': {
      color: theme.palette.primary.main,
    },
  },
  checked: {},
  disabled: {},
});

class TableSelectCell extends React.Component {
  static propTypes = {
    /** Select cell checked on/off */
    checked: PropTypes.bool.isRequired,
    /** Select cell part of fixed header */
    fixedHeader: PropTypes.bool.isRequired,
    /** Callback to trigger cell update */
    onChange: PropTypes.func,
    /** Extend the style applied to components */
    classes: PropTypes.object,
    /** Select cell disabled on/off */
    isRowSelectable: PropTypes.bool,
  };

  static defaultProps = {
    isHeaderCell: false,
    isExpandable: false,
    isRowExpanded: false,
  };

  render() {
    const {
      classes,
      radio,
      fixedHeader,
      isHeaderCell,
      isExpandable,
      isRowExpanded,
      onExpand,
      isRowSelectable,
      ...otherProps
    } = this.props;

    const cellClass = classNames({
      [classes.root]: true,
      [classes.fixedHeader]: fixedHeader,
      [classes.headerCell]: isHeaderCell,
      [classes.sticky]: true,
    });

    const iconClass = classNames({
      [classes.icon]: true,
      [classes.hide]: isHeaderCell,
      [classes.expanded]: isRowExpanded,
    });

    return (
      <TableCell className={cellClass} padding="checkbox">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {isExpandable && <KeyboardArrowRight className={iconClass} onClick={onExpand} />}

          {radio ? (
            <Radio color="primary" {...otherProps} />
          ) : (
            <Checkbox
              color="primary"
              classes={{
                root: classes.checkboxRoot,
                checked: classes.checked,
                disabled: classes.disabled,
              }}
              disabled={!isRowSelectable}
              {...otherProps}
            />
          )}
        </div>
      </TableCell>
    );
  }
}

export default withStyles(defaultSelectCellStyles, { name: 'MUIDataTableSelectCell' })(TableSelectCell);
