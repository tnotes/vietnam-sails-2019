module.exports.models = {
  schema: true,

  migrate: 'alter',

  primaryKey:'id',
  attributes: {
    createdAt: { type: 'number', autoCreatedAt: true, },
    updatedAt: { type: 'number', autoUpdatedAt: true, },
    id: {unique:true }
  },

  dataEncryptionKeys: {
    default: 'Se1hZAwyDmeQWiko3+7Hj5zadRT7IJsXiRDpjHnugws='
  },

  cascadeOnDestroy: true


};
