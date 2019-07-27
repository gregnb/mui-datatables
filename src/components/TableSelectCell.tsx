import React from 'react';
import classNames from 'classnames';
import Checkbox from '@material-ui/core/Checkbox';
import TableCell from '@material-ui/core/TableCell';
import { withStyles, createStyles, Theme, WithStyles } from '@material-ui/core/styles';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

const defaultSelectCellStyles = (theme: Theme) =>
  createStyles({
    root: {
      [theme.breakpoints.down('sm')]: {
        backgroundColor: theme.palette.background.paper,
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

interface TableSelectCellProps extends WithStyles<typeof defaultSelectCellStyles> {
  /** Select cell checked on/off */
  checked: boolean;
  /** Select cell part of fixed header */
  fixedHeader: boolean;
  /** Callback to trigger cell update */
  onChange: any;
  /** Is expandable option enabled */
  expandableOn: boolean;
  /** Is selectable option enabled */
  selectableOn: string;
  /** Select cell disabled on/off */
  isRowSelectable: boolean;
  isHeaderCell: boolean;
  isRowExpanded?: boolean;
  id?: any;
  indeterminate?: boolean;
  onExpand?: () => void;
}

class TableSelectCell extends React.Component<TableSelectCellProps> {
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
      if (isHeaderCell && selectableOn !== 'multiple') {
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
          disabled={!isRowSelectable}
          {...otherProps}
        />
      );
    };

    return (
      <TableCell className={cellClass} padding="checkbox">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {expandableOn && <KeyboardArrowRight id="expandable-button" className={iconClass} onClick={onExpand} />}
          {selectableOn !== 'none' && renderCheckBox()}
        </div>
      </TableCell>
    );
  }
}

export default withStyles(defaultSelectCellStyles, { name: 'MUIDataTableSelectCell' })(TableSelectCell);
