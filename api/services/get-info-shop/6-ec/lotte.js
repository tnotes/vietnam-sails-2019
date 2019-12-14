const request = require('request-promise');

module.exports = async (url) => {

    // https://www.lotte.vn/seller/1393/hoang-hai-digital

    if (!url.includes('https://www.lotte.vn/seller/')) throw 1001;
    let slug = url.slice(28, url.indexOf('/', 28));
    let options = {
        url: 'https://www.lotte.vn/api/v1/vendors/' + slug,
        method: 'GET',
        headers: {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36'
        }
    };
    let responseText = await request(options);
    let {id, name} = JSON.parse(responseText);
    return {
        ecom_name: 'lotte',
        shopKey: id,
        shop_name: name
    }

};