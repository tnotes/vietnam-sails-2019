module.exports = {
  attributes: {

    userId: {type: 'string', required: true},
    key: {
      type: 'string',
      required: true,
    },
    brand: {
      type: 'string',
      defaultsTo: ''
    },
    level: {
      type: 'number',
      defaultsTo: 1
    },
    stock: {
      type: 'number',
      defaultsTo: 0
    }
  }

};

