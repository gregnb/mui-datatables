function buildMap(rows) {
  return rows.reduce((accum, { dataIndex }) => {
    accum[dataIndex] = true;
    return accum;
  }, {});
}

function escapeDangerousCSVCharacters(data) {
  if (typeof data === 'string') {
    // Places single quote before the appearance of dangerous characters if they
    // are the first in the data string.
    return data.replace(/^\+|^\-|^\=|^\@/g, "'$&");
  }

  return data;
}

function warnDeprecated(warning) {
  if (process.env.NODE_ENV === 'development') {
    console.error(`Deprecation Notice:  ${warning}`);
  }
}

function getPageValue(count, rowsPerPage, page) {
  const totalPages = count <= rowsPerPage ? 1 : Math.ceil(count / rowsPerPage);

  // `page` is 0-indexed
  return page >= totalPages ? totalPages - 1 : page;
}

function getCollatorComparator() {
  if (!!Intl) {
    const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
    return collator.compare;
  }

  return (a, b) => a.localeCompare(b);
}

function sortCompare(order) {
  return (a, b) => {
    var aData = a.data === null || typeof a.data === 'undefined' ? '' : a.data;
    var bData = b.data === null || typeof b.data === 'undefined' ? '' : b.data;
    return (
      (typeof aData.localeCompare === 'function' ? aData.localeCompare(bData) : aData - bData) *
      (order === 'asc' ? 1 : -1)
    );
  };
}

function buildCSV(columns, data, options) {
  const replaceDoubleQuoteInString = columnData =>
    typeof columnData === 'string' ? columnData.replace(/\"/g, '""') : columnData;

  const buildHead = columns => {
    return (
      columns
        .reduce(
          (soFar, column) =>
            column.download
              ? soFar +
                '"' +
                escapeDangerousCSVCharacters(replaceDoubleQuoteInString(column.label || column.name)) +
                '"' +
                options.downloadOptions.separator
              : soFar,
          '',
        )
        .slice(0, -1) + '\r\n'
    );
  };
  const CSVHead = buildHead(columns);

  const buildBody = data => {
    if (!data.length) return '';
    return data
      .reduce(
        (soFar, row) =>
          soFar +
          '"' +
          row.data
            .filter((_, index) => columns[index].download)
            .map(columnData => escapeDangerousCSVCharacters(replaceDoubleQuoteInString(columnData)))
            .join('"' + options.downloadOptions.separator + '"') +
          '"\r\n',
        '',
      )
      .trim();
  };
  const CSVBody = buildBody(data);

  return options.onDownload
      ? options.onDownload(buildHead, buildBody, columns, data)
      : `${CSVHead}${CSVBody}`.trim();
}

function downloadCSV(csv, filename) {
  const blob = new Blob([csv], { type: 'text/csv' });

  /* taken from react-csv */
  if (navigator && navigator.msSaveOrOpenBlob) {
    navigator.msSaveOrOpenBlob(blob, filename);
  } else {
    const dataURI = `data:text/csv;charset=utf-8,${csv}`;

    const URL = window.URL || window.webkitURL;
    const downloadURI = typeof URL.createObjectURL === 'undefined' ? dataURI : URL.createObjectURL(blob);

    let link = document.createElement('a');
    link.setAttribute('href', downloadURI);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

function createCSVDownload(columns, data, options, downloadCSV) {
  const csv = buildCSV(columns, data, options);

  if (options.onDownload && csv === false) {
    return;
  }

  downloadCSV(csv, options.downloadOptions.filename);
}

function convertMaxHeight(maxHeight) {
  if(Number.isInteger(maxHeight) || !isNaN(parseInt(maxHeight, 10))){
    return maxHeight + 'px';
  } else if(['max-content', 'min-content', 'fit-content', 'fill-available'].includes(maxHeight)) {
    return maxHeight;
  } else if(maxHeight.endsWith('px')) {
    return maxHeight;
  }
  return '499px';
}

export {
  buildMap,
  convertMaxHeight,
  getPageValue,
  getCollatorComparator,
  sortCompare,
  createCSVDownload,
  buildCSV,
  downloadCSV,
  warnDeprecated,
  escapeDangerousCSVCharacters,
};
