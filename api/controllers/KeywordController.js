
 module.exports = {
 	scan:async function(req,res){
 		let {session:{userId},body:{keyId}} = req;
 		let keyword_data = await Keyword.find({id:keyId,userId});
 		if(keyword_data.length === 0) return res.sendStatus(404);
 		let {key} = keyword_data[0];
 		let {errorCode,data} = await min({keyword:key,one:true});
 		if(errorCode) return res.send({code:errorCode,content:getError(errorCode)});
 		let update = await Keyword.update({id:keyId,userId}).set({data,status:true}).fetch();
 		return res.send(update);
 	},
 	reset:async function(req,res){
 		await Keyword.update({userId:req.session.userId}).set({data:[],status:false});
 		return res.send(true);
 	}
 };

