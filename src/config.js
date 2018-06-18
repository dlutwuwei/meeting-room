const { getQuery, setCookie, getCookie } = require('./lib/util');
const locale = getQuery('locale') || getCookie('locale') || navigator.language.toLowerCase();
if(locale) {
    setCookie('locale', locale);
}

const languages = require(`./locale/${locale}.json`);

window.__ = function(key) {
    return languages[key] || key;
}

window.auth_url = 'http://mt.auth.ig66.com';
window.show_logo = true;