const AWSCognito = require('amazon-cognito-identity-js');

describe('Investigaste Object.defineProperty of AWSCognito.AuthenticationDetails', () => {
  it('It should throw "TypeError: Cannot redefine property: AuthenticationDetails" because Object.getOwnPropertyDescriptor returns configurable: false', () => {
    
    console.log('Object.getOwnPropertyDescriptor(AWSCognito, "AuthenticationDetails"): ');
    console.log(Object.getOwnPropertyDescriptor(AWSCognito, 'AuthenticationDetails'));

    // this will throw exception because of 'configurable: false',
    // meaning the AWS team does not want you to fiddle with this...and I agree, you shouldn't.
    Object.defineProperty(AWSCognito, 'AuthenticationDetails', {
      writable: true,
      value: 'foo'
    });
    
    console.log(Object.getOwnPropertyDescriptor(AWSCognito, 'AuthenticationDetails'));
  });

});