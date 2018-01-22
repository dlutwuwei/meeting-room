
function generateOptions(length, include) {
    const arr = [];
    for (let value = 0; value < length; value++) {
        if (include(value)) {
            arr.push(value);
        }
    }
    return arr;
}

function getQuery(name, search = (window.location && window.location.search.substr(1))) {
    const queries = {};
    search && search.split('&').forEach((c) => {
        if (c === '') {
            return;
        }

        const [key, value = ''] = c.split('=');
        queries[decodeURIComponent(key)] = value === '' ? true : decodeURIComponent(value);
    });
    return name ? queries[name] : queries;
}
export {
    generateOptions,
    getQuery
}