function buildMap(rows) {
  return rows.reduce((accum, { dataIndex }) => {
    accum[dataIndex] = true;
    return accum;
  }, {});
}

const buildColumns = newColumns => {
  let columnData = [];
  let filterData = [];
  let filterList = [];

  newColumns.forEach((column, colIndex) => {
    let columnOptions = {
      display: 'true',
      empty: false,
      filter: true,
      sort: true,
      print: true,
      searchable: true,
      download: true,
      viewColumns: true,
      sortDirection: null,
    };

    if (typeof column === 'object') {
      if (column.options && column.options.display !== undefined) {
        column.options.display = column.options.display.toString();
      }

      columnOptions = {
        name: column.name,
        label: column.label ? column.label : column.name,
        ...columnOptions,
        ...(column.options ? column.options : {}),
      };
    } else {
      columnOptions = { ...columnOptions, name: column, label: column };
    }

    columnData.push(columnOptions);

    filterData[colIndex] = [];
    filterList[colIndex] = [];
  });

  return { columns: columnData, filterData, filterList };
};

function getCollatorComparator() {
  if (!!Intl) {
    const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
    return collator.compare;
  }

  const fallbackComparator = (a, b) => a.localeCompare(b);
  return fallbackComparator;
}

function sortCompare(order) {
  return (a, b) => {
    if (a.data === null) a.data = '';
    if (b.data === null) b.data = '';
    return (
      (typeof a.data.localeCompare === 'function' ? a.data.localeCompare(b.data) : a.data - b.data) *
      (order === 'asc' ? 1 : -1)
    );
  };
}

function createCSVDownload(columns, data, options) {
  const replaceDoubleQuoteInString = columnData =>
    typeof columnData === 'string' ? columnData.replace(/\"/g, '""') : columnData;
  const reduceData = data =>
    data
      .reduce(
        (soFar, column) =>
          column.download
            ? soFar + '"' + replaceDoubleQuoteInString(column.name) + '"' + options.downloadOptions.separator
            : soFar,
        '',
      )
      .slice(0, -1) + '\r\n';

  const CSVHead = reduceData(
    options.downloadOptions.onDownload.buildHead ? options.downloadOptions.onDownload.buildHead(columns) : columns,
  );

  const CSVBody = (options.downloadOptions.onDownload.buildBody
    ? options.downloadOptions.onDownload.buildBody(data)
    : data
  ).reduce(
    (soFar, row) =>
      soFar +
      '"' +
      row.data
        .filter((_, index) => columns[index].download)
        .map(columnData => replaceDoubleQuoteInString(columnData))
        .join('"' + options.downloadOptions.separator + '"') +
      '"\r\n',
    [],
  );

  const csv = `${CSVHead}${CSVBody}`.trim();

  const blob = new Blob([csv], { type: 'text/csv' });

  /* taken from react-csv */
  if (navigator && navigator.msSaveOrOpenBlob) {
    navigator.msSaveOrOpenBlob(blob, options.downloadOptions.filename);
  } else {
    const dataURI = `data:text/csv;charset=utf-8,${csv}`;

    const URL = window.URL || window.webkitURL;
    const downloadURI = typeof URL.createObjectURL === 'undefined' ? dataURI : URL.createObjectURL(blob);

    let link = document.createElement('a');
    link.setAttribute('href', downloadURI);
    link.setAttribute('download', options.downloadOptions.filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export { buildColumns, buildMap, getCollatorComparator, sortCompare, createCSVDownload };
