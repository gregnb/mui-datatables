import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Checkbox from '@material-ui/core/Checkbox';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

const defaultSelectCellStyles = theme => ({
  root: {},
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
    backgroundColor: theme.palette.background.paper,
  },
  checkboxRoot: {},
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
    /** Is expandable option enabled */
    expandableOn: PropTypes.bool,
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
      isHeaderCell,
      expandableOn,
      selectableOn,
      isRowExpanded,
      onExpand,
      isRowSelectable,
      selectableRowsHeader,
      ...otherProps
    } = this.props;

    if (!expandableOn && selectableOn === 'none') return false;

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
      <TableCell className={cellClass} padding="checkbox">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {expandableOn && (
            <IconButton onClick={onExpand} disabled={isHeaderCell}>
              <KeyboardArrowRight id="expandable-button" className={iconClass} />
            </IconButton>
          )}
          {selectableOn !== 'none' && renderCheckBox()}
        </div>
      </TableCell>
    );
  }
}

export default withStyles(defaultSelectCellStyles, { name: 'MUIDataTableSelectCell' })(TableSelectCell);
