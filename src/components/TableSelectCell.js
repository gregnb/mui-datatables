import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Checkbox from '@material-ui/core/Checkbox';
import TableCell from '@material-ui/core/TableCell';
import { withStyles } from '@material-ui/core/styles';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

const defaultSelectCellStyles = theme => ({
  root: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  fixedHeader: {
    position: 'sticky',
    top: '0px',
    left: '0px',
    zIndex: 100,
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
    zIndex: 110,
    backgroundColor: '#FFF',
  },
  checkboxRoot: {
    '&$checked': {
      color: '#027cb5',
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
          <Checkbox
            classes={{
              root: classes.checkboxRoot,
              checked: classes.checked,
              disabled: classes.disabled,
            }}
            disabled={!isRowSelectable}
            {...otherProps}
          />
        </div>
      </TableCell>
    );
  }
}

export default withStyles(defaultSelectCellStyles, { name: 'MUIDataTableSelectCell' })(TableSelectCell);
