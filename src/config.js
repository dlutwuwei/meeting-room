const { getQuery, setCookie, getCookie } = require('./lib/util');
let locale = getQuery('locale');
if(locale) {
    setCookie('locale', locale);
} else {
    locale = getCookie('locale') || 'zh-tw';
}

const languages = require(`./locale/${locale}.json`);

window.__ = function(key) {
    return languages[key] || key;
}

window.auth_url = 'http://mt.auth.ig66.com';
window.show_logo = true;