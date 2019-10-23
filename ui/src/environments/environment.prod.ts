/*
Some magic strings which will be replace in the back-end build pipeline.
format => ___XXX-XXX-XXX___
*/

export const environment = {
  production: true,

  region: "ap-southeast-2",
  userPoolData: {
      userPoolId: '___STAGE-USER-POOL-ID___',
      appClientId: '___STAGE-USER-APP-CLIENT-ID___'
  }
};
