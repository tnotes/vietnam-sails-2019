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
    id_invite:{
      type:'string',
      unique:true
    },
    name_invite:{
      type:'string'
    },

    status_invite:{
      type:'boolean'
    }


  },
  beforeCreate:async function(obj,cb){
  
    let user = await User.find({emailAddress:obj["email_invite"] || null});
    if(user.length === 0) return cb(401);

    obj["status_invite"] = false;
    obj["name_invite"] =  user[0].fullName;
    obj["id_invite"] = user[0].id;
    
    
    return cb();
  }

};

