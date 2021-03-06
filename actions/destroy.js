/**
 * Module dependencies
 */

var _ = require('@sailshq/lodash');
var formatUsageError = require('../formatUsageError');

/**
 * Destroy One Record
 *
 * http://sailsjs.com/docs/reference/blueprint-api/destroy
 *
 * Destroys the single model instance with the specified `id` from
 * the data adapter for the given model if it exists.
 *
 */

module.exports = function destroyOneRecord (req, res) {

  var parseBlueprintOptions = req.options.parseBlueprintOptions || req._sails.config.blueprints.parseBlueprintOptions;

  // Set the blueprint action for parseBlueprintOptions.
  req.options.blueprintAction = 'destroy';

  var queryOptions = parseBlueprintOptions(req);
  var Model = req._sails.models[queryOptions.using];

  var criteria = {};
  queryOptions.criteria.where.userId = req.session.userId;
  criteria[Model.primaryKey] = queryOptions.criteria.where[Model.primaryKey];

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // FUTURE: Use a database transaction here, if supported by the datastore.
  // e.g.
  // ```
  // Model.getDatastore().transaction(function during(db, proceed){ ... })
  // .exec(function afterwards(err, result){}));
  // ```
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  let crite_obj = _.cloneDeep(criteria);
  crite_obj.userId = req.session.userId;
  if(!crite_obj.id) delete crite_obj.id;
  var query = Model.find(crite_obj, queryOptions.populates).meta(queryOptions.meta);
  query.exec(function foundRecord (err, record) {
    if (err) {
      // If this is a usage error coming back from Waterline,
      // (e.g. a bad criteria), then respond w/ a 400 status code.
      // Otherwise, it's something unexpected, so use 500.
      switch (err.name) {
        case 'UsageError': return res.badRequest(formatUsageError(err, req));
        default: return res.serverError(err);
      }
    }//-•

    if(!record) { return res.notFound('No record found with the specified `id`.'); }

    // (Note: this could be achieved in a single query, but a separate `findOne`
    // is used first to provide a better experience for front-end developers
    // integrating with the blueprint API out of the box.  If we didn't need
    // or care about that, we could just use `.meta({fetch: true})` when calling
    // `.destroy()`.
   
   
    Model.destroy(crite_obj).exec(function destroyedRecord (err) {
      if (err) {
        switch (err.name) {
          case 'UsageError': return res.badRequest(formatUsageError(err, req));
          default: return res.serverError(err);
        }
      }
    

      return res.ok(record);
    });
  });
};
