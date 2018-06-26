const { getQuery, setCookie, getCookie } = require('./lib/util');
const locale = getQuery('locale') || getCookie('locale') || navigator.language.toLowerCase();
if(locale) {
    setCookie('locale', locale);
}

let languages;
try {
    languages = require(`./locale/${locale}.json`);
} catch(e) {
    languages = require('en.json');
}

window.__ = function(key) {
    return languages[key] || key;
}

window.auth_url = 'http://mt.auth.ig66.com';
window.show_logo = true;