module.exports.custom = {
  baseUrl: 'http://localhost:1337',

  passwordResetTokenTTL: 24*60*60*1000,// 24 hours
  emailProofTokenTTL:    24*60*60*1000,// 24 hours

  rememberMeCookieMaxAge: 30*24*60*60*1000, // 30 days

  
  fromEmailAddress: 'noreply@example.com',
  fromName: 'The NEW_APP_NAME Team',

  internalEmailAddress: 'support+development@example.com',


  verifyEmailAddresses: false,
};
