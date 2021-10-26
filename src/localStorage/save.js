export const save = (storageKey, state) => {
  const { selectedRows, data, displayData, ...savedState } = state;

  window.localStorage.setItem(storageKey, JSON.stringify(savedState));
};
