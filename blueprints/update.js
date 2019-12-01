
var _ = require('@sailshq/lodash');
var formatUsageError = require('../formatUsageError');

module.exports = function updateOneRecord (req, res) {

  var parseBlueprintOptions = req.options.parseBlueprintOptions || req._sails.config.blueprints.parseBlueprintOptions;


  req.options.blueprintAction = 'update';

  var queryOptions = parseBlueprintOptions(req);
  var Model = req._sails.models[queryOptions.using];

  var criteria = {};
  criteria[Model.primaryKey] = queryOptions.criteria.where[Model.primaryKey];


  let cri_object = _.cloneDeep(criteria);
  cri_object.userId = req.session.userId;
  Model.findOne(cri_object,
    _.cloneDeep(queryOptions.populates)
  )
  .exec(function (err, matchingRecord) {
    if (err) {
      switch (err.name) {
        case 'UsageError': return res.badRequest(formatUsageError(err, req));
        default: return res.serverError(err);
      }
    }

    if (!matchingRecord) {
      return res.notFound();
    }

    // This should only update a single record
    Model.updateOne(_.cloneDeep(criteria))
    .set(queryOptions.valuesToSet)
    .meta(queryOptions.meta)
    .exec(function (err, updatedRecord) {

    
      if (err) {
        switch (err.name) {
          case 'AdapterError':
            switch (err.code) {
              case 'E_UNIQUE': return res.badRequest(err);
              default: return res.serverError(err);
            }//•
          case 'UsageError': return res.badRequest(formatUsageError(err, req));
          default: return res.serverError(err);
        }
      }//•

      if (!updatedRecord) {
        return res.notFound();
      }//•

      // If we have the pubsub hook, use the Model's publish method
      // to notify all subscribers about the update.
      if (req._sails.hooks.pubsub) {
        if (req.isSocket) {
          Model.subscribe(req, updatedRecord[Model.primaryKey]);
        }//ﬁ

        // The _.cloneDeep()s ensure that only plain dictionaries are broadcast.
        // > TODO: why is that important?
        var pk = updatedRecord[Model.primaryKey];
        Model._publishUpdate(pk, _.cloneDeep(queryOptions.valuesToSet), !req.options.mirror && req, {
          previous: _.cloneDeep(matchingRecord)
        });
      }//ﬁ

      // Do a final query to populate the associations of the record.
      //
      // (Note: again, this extra query could be eliminated, but it is
      //  included by default to provide a better interface for integrating
      //  front-end developers.)
      Model.findOne(
        cri_object,
        _.cloneDeep(queryOptions.populates)
      )
      .exec(function foundAgain(err, populatedRecord) {
        if (err) { return res.serverError(err); }
        if (!populatedRecord) { return res.serverError('Could not find record after updating!'); }
        res.ok(populatedRecord);
      }); // </.findOne() (for populating the updated record)>
    });// </.updateOne()>
  }); // </.findOne() to get the ORIGINAL populated record>
};
