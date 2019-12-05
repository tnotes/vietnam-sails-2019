 module.exports = {

  attributes: {
  	userId:{
  		type:'string',
  		required:true
  	},
  	email_invite:{
  		type:'string',
      isEmail:true,
      required:true
  	},

    status_invite:{
      type:'boolean'
    },

    id_invite:{
      type:'string'
    },
    name_invite:{
      type:'string'
    },
    name_from:{
      type:'string',
    },
    email_from:{
      type:'string',
      isEmail:true
    },
    key_share:{
      type:'json',
      defaultsTo:[]
    }



  },
  beforeCreate:async function(obj,cb){
    
    let user = await User.find({emailAddress:obj["email_invite"] || null});
    let from = await User.find({id:obj.userId});
    if(user.length === 0) return cb(401);
    if(obj.userId === user[0].id) return cb(402);

  

    obj["name_invite"] =  user[0].fullName;
    obj["id_invite"] = user[0].id;

    obj["name_from"] = from[0].fullName;
    obj["email_from"] = from[0].emailAddress;
    
    
    return cb();
  },
  

};

