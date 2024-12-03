// utils.js
export const updateURL = (query, pageN) => {
    const url = new URL(window.location);
    url.searchParams.set('query', query);
    url.searchParams.set('page', pageN);
    window.history.pushState({}, '', url);
};
