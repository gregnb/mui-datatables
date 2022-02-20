const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';

export const load = storageKey => {
  if (isBrowser) {
    return JSON.parse(window.localStorage.getItem(storageKey));
  } else if (storageKey !== undefined) {
    console.warn('storageKey support only on browser');
    return undefined;
  }
};
