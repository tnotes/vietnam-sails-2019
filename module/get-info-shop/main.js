const lazadaInfo = require('./6-ec/lazada');
const tikiInfo = require('./6-ec/tiki');
const shopeeInfo = require('./6-ec/shopee');
const sendoInfo = require('./6-ec/sendo');
const adayroiInfo = require('./6-ec/adayroi');
const lotteInfo = require('./6-ec/lotte');

module.exports = async function(url){


        if(url.includes('lazada.vn')) return await lazadaInfo(url);
        if(url.includes('tiki.vn')) return await tikiInfo(url);
        if(url.includes('shopee.vn')) return await shopeeInfo(url);
        if(url.includes('adayroi.com')) return await adayroiInfo(url);
        if(url.includes('sendo.vn')) return await sendoInfo(url);
        if(url.includes('lotte.vn')) return await lotteInfo(url);

         throw 1001;
};