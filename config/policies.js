module.exports.policies = {

  '*': 'is-logged-in',
  
  'entrance/*': true,
  'account/logout': true,
  'view-homepage-or-redirect': true,
  'user':true
  

};
