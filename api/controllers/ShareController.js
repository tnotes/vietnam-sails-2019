module.exports = {
	add:async function(req,res){
		let {

			body:{
				email_invite
			},
			session:{
				userId
			}
		} = req;
		let find = await Share.find({where:{email_invite,userId}});
		if(find.length > 0) return res.send({error:'Quý khách đã thêm Email này vào trong danh sách'});
		let data = await Share.create({userId,email_invite}).fetch();
		return res.send(data);

	},
	invite:async function(req,res){
		let {

			session:{
				userId
			}

		} = req;
		return res.send(await Share.find({where:{id_invite:userId,status_invite:false},omit:['userId','id_invite']}));
	},
	verify:async function(req,res){
		let {

			body:{
				id,
				email_from
			},
			session:{
				userId
			}

		} = req;
		let data = await Share.update({id,id_invite:userId,email_from,status_invite:false}).set({status_invite:true}).fetch();
		if(data.length === 0) return res.send(false);
		await Share.create({userId,email_invite:email_from,status_invite:true})
		return res.send(true)

	},
	
	delete:async function(req,res){
		let {
			body:{
				email
			},
			session:{
				userId
			}

		} = req;

		if(!(email && userId)) return res.send(404);
		await Share.destroy({"email_invite": email,"userId": userId});
		await Share.destroy({"email_from": email,"id_invite": userId});
		return res.send(true);
	},
	'send-keyword':async function(req,res){
		let {
			body:{
				id_invite,key_share
			},
			session:{
				userId
			}

		} = req;
		await Share.update({userId:id_invite,id_invite:userId,status_invite:true}).set({key_share});
		return res.send(true);
	},
	'get-keyword':async function(req,res){
	  let {
	    body:{
	      id
      },
      session:{
	      userId
      }
    } = req;
	  let invite_info = await Share.find({where:{userId,id}});
	  if(invite_info.length  === 0) return res.sendStatus(404);
	  let {key_share,id_invite} = invite_info[0];
	  let result = [];
	  for(let keyId of key_share){
	    let keyword = await Keyword.find({where:{id:keyId,userId:id_invite},omit: ['userId']});
	    if(keyword.length > 0) result.push(keyword)
    }

		return res.send(result);

	}
};

