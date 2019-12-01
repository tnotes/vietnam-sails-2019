/**
 * ShareController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
	invite:async function(req,res){
		return res.send(await Share.find({id_invite:req.session.userId}));
	}
};

