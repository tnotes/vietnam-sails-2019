const request = require('request-promise');
module.exports = async (url) => {

    if (!url.includes('https://tiki.vn/cua-hang/')) throw 1001;
    let slug = null;
    // 25 là số kí tự của 'https://tiki.vn/cua-hang'

    if (url.includes('?')) {
        // https://tiki.vn/cua-hang/microlabmiennam?name=abc...

        slug = url.slice(25, url.indexOf('?')).replace(/\//g, '');
    } else if (url.indexOf('/', 25) > 0) {
        // https://tiki.vn/cua-hang/microlabmiennam/products...

        slug = url.slice(25, url.indexOf('/', 25)).replace(/\//g, '');
    } else {
        // https://tiki.vn/cua-hang/microlabmiennam

        slug = url.slice(25);
    }


    let options = {
        url: 'https://tiki.vn/api/v2/seller/stores/' + slug,
        method: 'GET',
        headers: {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36'
        }
    };
    let responseText = await request(options);
    let {id, name} = JSON.parse(responseText);

    return {ecom_name: 'tiki', shopKey:id, shop_name:name.split('|')[0]};

};