/**
 * Shop.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
const shop = require('../../module/get-info-shop/main');
module.exports = {

  attributes: {
    url:{
      type:'string',
      required:true
    },
    userId: {
      type: 'string',
      required: true
    },
    shopKey:{
      type:'string'
    },
    shop_name:{
      type:'string'
    },
    ecom_name:{
      type:'string'
    },
    type:{
      type:'boolean',
      defaultsTo:false
    }

  },
  beforeCreate:async function(content,cb){
    let {url} = content;
    try{
      let {ecom_name,shopKey,shop_name} = await shop(url);
      content.ecom_name = ecom_name;
      content.shopKey = shopKey;
      content.shop_name = shop_name;
      return cb();
    }catch (errorCode) {
      return cb(errorCode)
    }
  }

};

