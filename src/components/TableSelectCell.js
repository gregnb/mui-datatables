import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Checkbox from '@material-ui/core/Checkbox';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import Remove from '@material-ui/icons/Remove';

const defaultSelectCellStyles = theme => ({
  root: {
    '@media print': {
      display: 'none',
    },
  },
  fixedHeader: {
    position: 'sticky',
    top: '0px',
    zIndex: 100,
  },
  fixedLeft: {
    position: 'sticky',
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
    backgroundColor: theme.palette.background.paper,
  },
  expandDisabled: {},
  checkboxRoot: {},
  checked: {},
  disabled: {},
});

class TableSelectCell extends React.Component {
  static propTypes = {
    /** Select cell checked on/off */
    checked: PropTypes.bool.isRequired,
    /** Select cell part of fixed header */
    fixedHeader: PropTypes.bool,
    /** Callback to trigger cell update */
    onChange: PropTypes.func,
    /** Extend the style applied to components */
    classes: PropTypes.object,
    /** Is expandable option enabled */
    expandableOn: PropTypes.bool,
    /** Adds extra class, `expandDisabled` when the row is not expandable. */
    hideExpandButton: PropTypes.bool,
    /** Is selectable option enabled */
    selectableOn: PropTypes.string,
    /** Select cell disabled on/off */
  };

  static defaultProps = {
    isHeaderCell: false,
    isRowExpanded: false,
    expandableOn: false,
    selectableOn: 'none',
  };

  render() {
    const {
      classes,
      fixedHeader,
      fixedSelectColumn,
      isHeaderCell,
      expandableOn,
      selectableOn,
      isRowExpanded,
      onExpand,
      isRowSelectable,
      selectableRowsHeader,
      hideExpandButton,
      expandableRowsHeader,
      expandedRows,
      areAllRowsExpanded = () => false,
      selectableRowsHideCheckboxes,
      setHeadCellRef,
      ...otherProps
    } = this.props;
    let fixedHeaderClasses;

    if (!expandableOn && selectableOn === 'none') return false;

    const cellClass = classNames({
      [classes.root]: true,
      [classes.fixedHeader]: fixedHeader && isHeaderCell,
      [classes.fixedLeft]: fixedSelectColumn,
      [classes.headerCell]: isHeaderCell,
    });

    const buttonClass = classNames({
      [classes.expandDisabled]: hideExpandButton,
    });

    const iconClass = classNames({
      [classes.icon]: true,
      [classes.hide]: isHeaderCell && !expandableRowsHeader,
      [classes.expanded]: isRowExpanded || (isHeaderCell && areAllRowsExpanded()),
    });
    const iconIndeterminateClass = classNames({
      [classes.icon]: true,
      [classes.hide]: isHeaderCell && !expandableRowsHeader,
    });

    let refProp = {};
    if (setHeadCellRef) {
      refProp.ref = el => {
        setHeadCellRef(0, 0, el);
      };
    }

    const renderCheckBox = () => {
      if (isHeaderCell && (selectableOn !== 'multiple' || selectableRowsHeader === false)) {
        // only display the header checkbox for multiple selection.
        return null;
      }
      return (
        <Checkbox
          classes={{
            root: classes.checkboxRoot,
            checked: classes.checked,
            disabled: classes.disabled,
          }}
          color="primary"
          disabled={!isRowSelectable}
          {...otherProps}
        />
      );
    };

    return (
      <TableCell className={cellClass} padding="checkbox" {...refProp}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {expandableOn && (
            <React.Fragment>
              {isHeaderCell && !areAllRowsExpanded() && expandedRows && expandedRows.data.length > 0 ? (
                <IconButton
                  onClick={onExpand}
                  style={{ padding: 0 }}
                  disabled={expandableRowsHeader === false}
                  className={buttonClass}>
                  <Remove id="expandable-button" className={iconIndeterminateClass} />
                </IconButton>
              ) : (
                <IconButton
                  onClick={onExpand}
                  style={{ padding: 0 }}
                  disabled={expandableRowsHeader === false}
                  className={buttonClass}>
                  <KeyboardArrowRight id="expandable-button" className={iconClass} />
                </IconButton>
              )}
            </React.Fragment>
          )}
          {selectableOn !== 'none' && selectableRowsHideCheckboxes !== true && renderCheckBox()}
        </div>
      </TableCell>
    );
  }
}

export default withStyles(defaultSelectCellStyles, { name: 'MUIDataTableSelectCell' })(TableSelectCell);
