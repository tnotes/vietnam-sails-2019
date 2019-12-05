const request = require('request-promise');
const random = require('randomstring');
let infoShop = async (shopId) => {
    shopId = parseInt(shopId);
    let options = {
        url: 'https://shopee.vn/api/v2/shop/get?is_brief=1&shopid=' + shopId,
        method: 'GET',
        headers: {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'
        }
    };
    let responseText = await request(options);
    let {data: {account: {username}}} = JSON.parse(responseText);
    return {
        ecom_name: 'shopee',
        shopKey: shopId,
        shop_name: username
    }
};
let get_id_shop = async (path_shop) => {
    let code = random.generate(32);
    let options = {
        url: 'https://shopee.vn/api/v1/shop_ids_by_username/',
        method: 'POST',
        headers:{
            'accept':'application/json',
            'content-length':18+path_shop.toString().length,
            'content-type':'application/json',
            'cookie':'csrftoken='+code,
            'origin':'https://shopee.vn',
            'referer':'https://shopee.vn',
            'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36',
            'x-api-source':'pc',
            'x-csrftoken':code,
            'x-requested-with':'XMLHttpRequest'
        },
        body: JSON.stringify({"usernames": [path_shop]})
    };
    let responseText = await request(options);
    return JSON.parse(responseText);
};
module.exports = async (url) => {
    if(!url.includes('https://shopee.vn/')) throw 1001;
    let path_shop = url.slice(18);
    let id = Object.values((await get_id_shop(path_shop))[0])[0];
    return await infoShop(id);
};