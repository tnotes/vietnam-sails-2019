module.exports = {
  tableName:'keyword',
  attributes: {
    userId: {type: 'string', required: true},
    key: {
      type: 'string',
      required: true,
    },
    status: {
      type:'boolean',
      defaultsTo:false
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
    },
    data:{
    	type:'json',
    	defaultsTo:[]
    }
  }

};

