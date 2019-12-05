/**
 * Scan.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
const Scan = require('../../module/min');

module.exports = {

  attributes: {
    userId:{
      type:'string',
      required:true
    },
    keyId:{
      type:'string',
      required:true
    },
    data:{
      type:'json',
      defaultsTo:{}
    }
  },
  beforeCreate:async function(content,cb){
    let keyword_data = await Keyword.find({id:content.keyId,userId:content.userId});
    if(keyword_data.length === 0) return cb(404);
    let data = await Scan({keyword:keyword_data[0].key,one:true});
    content.data = data;
    return cb();
  }
};

