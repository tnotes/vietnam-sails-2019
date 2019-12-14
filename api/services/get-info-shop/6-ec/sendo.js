const request = require('request-promise');

function sanitize_for_regex(s) {
    var escaped = '';
    for (var i = 0; i < s.length; ++i) {
        switch (s[i]) {
            case '{':
            case '}':
            case '[':
            case ']':
            case '-':
            case '/':
            case '\\':
            case '(':
            case ')':
            case '*':
            case '+':
            case '?':
            case '.':
            case '^':
            case '$':
            case '|':
                escaped += '\\';
            default:
                escaped += s[i];
        }
    }
    return escaped;
}

let FINDid = (text, startS, lastS) => {
    startS = sanitize_for_regex(startS);
    lastS = sanitize_for_regex(lastS);
    let myRegEx = new RegExp('(?<=' + startS + ').*?(?=' + lastS + ')', 'gi');
    if (text.match(myRegEx)) {
        return [...new Set(text.match(myRegEx))]
    } else {
        return []
    }
};
module.exports = async (url) => {
    // 26 là số kí tự của 'https://www.sendo.vn/'

    if (!url.includes('https://www.sendo.vn/shop/')) throw 1001;

    if (url.includes('?')) {
        // https://www.sendo.vn/shop/microlab-vietnam?name=abc...

        url = url.slice(0, url.indexOf('?'));
    } else if (url.indexOf('/', 26) > 0) {
        // https://www.sendo.vn/shop/microlab-vietnam/san-pham

        url = url.slice(0, url.indexOf('/', 26));
    } else {
        // https://www.sendo.vn/shop/microlab-vietnam

    }


    let options = {
        url,
        method: 'GET',
        headers: {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36'
        }
    };
    let responseHTML = await request(options);
    let shop_name = FINDid(responseHTML, '"shop_name":"', '"')[0].trim();

    return {ecom_name: 'sendo', shopKey:shop_name, shop_name}

};