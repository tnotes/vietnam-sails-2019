var _ = require('@sailshq/lodash');
var actionUtil = require('../actionUtil');
var formatUsageError = require('../formatUsageError');


module.exports = async function findRecords (req, res) {
  var parseBlueprintOptions = req.options.parseBlueprintOptions || req._sails.config.blueprints.parseBlueprintOptions;

  // Set the blueprint action for parseBlueprintOptions.
  req.options.blueprintAction = 'find';

  var queryOptions = parseBlueprintOptions(req);
  var Model = req._sails.models[queryOptions.using];
  
  queryOptions.criteria.where.userId = req.session.userId;
  delete queryOptions.criteria.where['get-count'];
  if(req.query['get-count']) return res.send((await Model.count(queryOptions.criteria.where)).toString());

  if(queryOptions.criteria.select){
    queryOptions.criteria.select = queryOptions.criteria.select.filter(e=>e !== 'userId');
  }else{
    if(queryOptions.criteria.omit) {
      queryOptions.criteria.omit.push('userId');
    }else{
      queryOptions.criteria.omit = ['userId'];
    }
  }
  

  
  Model
  .find(queryOptions.criteria,queryOptions.populates ).meta(queryOptions.meta)
  .exec(function found(err, matchingRecords) {
    if (err) {
      // If this is a usage error coming back from Waterline,
      // (e.g. a bad criteria), then respond w/ a 400 status code.
      // Otherwise, it's something unexpected, so use 500.
      switch (err.name) {
        case 'UsageError': return res.badRequest(formatUsageError(err, req));
        default: return res.serverError(err);
      }
    }//-•

    if (req._sails.hooks.pubsub && req.isSocket) {
      Model.subscribe(req, _.pluck(matchingRecords, Model.primaryKey));
      // Only `._watch()` for new instances of the model if
      // `autoWatch` is enabled.
      if (req.options.autoWatch) { Model._watch(req); }
      // Also subscribe to instances of all associated models
      _.each(matchingRecords, function (record) {
        actionUtil.subscribeDeep(req, record);
      });
    }//>-

    return res.ok(matchingRecords);

  });//</ .find().exec() >

};
