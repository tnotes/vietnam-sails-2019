/**
 * ScanController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
	'keyword-scan':async function(req,res){
		let ids = (await Keyword.find({userId:req.session.userId})).map(({id})=>id);
		let scan_ids = (await Scan.find({userId:req.session.userId})).map(({keyId})=>keyId);
		let result = ids.filter(e=>!scan_ids.includes(e));
		return res.send(result);


	}
};

