/**
 * Accseller.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    userId:{
        type:'string',
        required:true
    },
    status:{
        type:'boolean',
    },
    ecom_name:{
        type:'string',
        required:true
    },
    username:{
        type:'string'
    },
    password:{
        type:'string'
    },
    cookie:{
        type:'string'
    },
    authorization:{
        type:'string'
    }

  },
  beforeCreate:async function(context,cb){
    if(context.ecom_name === 'sendo'){
        if(!context.cookie) cb('')
        let {error,result} = await CheckAcc(context.cookie)
    }
  }

};

