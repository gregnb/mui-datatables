import IconButton from '@material-ui/core/IconButton';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import FilterIcon from '@material-ui/icons/FilterList';
import PrintIcon from '@material-ui/icons/Print';
import SearchIcon from '@material-ui/icons/Search';
import ViewColumnIcon from '@material-ui/icons/ViewColumn';
import Chip from '@material-ui/core/Chip';
import { assert } from 'chai';
import { mount } from 'enzyme';
import React from 'react';
import TableToolbar from '../src/components/TableToolbar';
import getTextLabels from '../src/textLabels';

const CustomChip = props => {
  return <Chip variant="outlined" color="secondary" label={props.label} />;
};

const icons = {
  SearchIcon,
  DownloadIcon,
  PrintIcon,
  ViewColumnIcon,
  FilterIcon,
};
let setTableAction = () => {};
const options = {
  print: true,
  download: true,
  search: true,
  filter: true,
  viewColumns: true,
  textLabels: getTextLabels(),
  downloadOptions: {
    separator: ',',
    filename: 'tableDownload.csv',
    filterOptions: {
      useDisplayedRowsOnly: true,
      useDisplayedColumnsOnly: true,
    },
  },
};
const columns = ['First Name', 'Company', 'City', 'State'];
const data = [
  {
    data: ['Joe James', 'Test Corp', 'Yonkers', 'NY'],
    dataIndex: 0,
  },
  {
    data: ['John Walsh', 'Test Corp', 'Hartford', 'CT'],
    dataIndex: 1,
  },
  {
    data: ['Bob Herm', 'Test Corp', 'Tampa', 'FL'],
    dataIndex: 2,
  },
  {
    data: ['James Houston', 'Test Corp', 'Dallas', 'TX'],
    dataIndex: 3,
  },
];

const testCustomIcon = iconName => {
  const components = { icons: { [iconName]: CustomChip } };
  const wrapper = mount(<TableToolbar {...{ columns, data, options, setTableAction, components }} />);
  assert.strictEqual(wrapper.find(IconButton).length, 5); // All icons show
  assert.strictEqual(wrapper.find(CustomChip).length, 1); // Custom chip shows once
  Object.keys(icons).forEach(icon => {
    // The original default for the custom icon should be gone, the rest should remain
    assert.strictEqual(wrapper.find(icons[icon]).length, iconName === icon ? 0 : 1);
  });
};

describe('<TableToolbar /> with custom icons', function() {
  it('should render a toolbar with a custom chip in place of the search icon', () => {
    testCustomIcon('SearchIcon');
  });

  it('should render a toolbar with a custom chip in place of the download icon', () => {
    testCustomIcon('DownloadIcon');
  });

  it('should render a toolbar with a custom chip in place of the print icon', () => {
    testCustomIcon('PrintIcon');
  });

  it('should render a toolbar with a custom chip in place of the view columns icon', () => {
    testCustomIcon('ViewColumnIcon');
  });

  it('should render a toolbar with a custom chip in place of the filter icon', () => {
    testCustomIcon('FilterIcon');
  });
});
