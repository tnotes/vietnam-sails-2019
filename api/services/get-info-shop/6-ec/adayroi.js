const request = require('request-promise');

module.exports = async key => {
    let url = key;
    if (!url.includes('https://www.adayroi.com/')) throw 1001;
    // 24 là số kí tự của 'https://www.adayroi.com/'

    if (key.includes('?')) {
        // https://www.adayroi.com/may-tinh-minh-phuong-mc333057?name=abc...

        url = url.slice(0, url.indexOf('?'));
    } else if (key.indexOf('/', 24) > 0) {
        // https://www.adayroi.com/may-tinh-minh-phuong-mc333057/products...

        url = url.slice(0, url.indexOf('/', 24));
    } else {
        // https://www.adayroi.com/may-tinh-minh-phuong-mc333057

    }
    let id = url.slice(url.lastIndexOf('-mc') + 3);
    let options = {
        url: 'https://rest.adayroi.com/cxapi/v2/adayroi/merchant?fields=FULL&q=&merchantId='+id+'&pageSize=32',
        method: 'GET',
        headers: {
            'Accept': ' application/json, text/plain, */*',
            'client-device': ' desktop',
            'clocation': ' 4:7:295',
            'province': ' 4',
            // 'Referer': ' https://www.adayroi.com/dmart-mc329019',
            'Sec-Fetch-Mode': ' cors',
            'User-Agent': ' Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36'
        }
    };
    let responseText = await request(options);
    let {merchantInfo: {merchantCode, merchantName}} = JSON.parse(responseText);
    return {ecom_name: 'adayroi', shopKey:merchantCode, shop_name:merchantName}
};
