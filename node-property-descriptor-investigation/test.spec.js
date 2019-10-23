const cognito = require('amazon-cognito-identity-js');
describe('FML', () => {
  it('Works', () => {
    console.log(Object.getOwnPropertyDescriptor(cognito, 'CognitoUserPool'));

    Object.defineProperty(cognito, 'CognitoUserPool', {
      value: 'foo',
      writable: false
    });
    
    console.log(Object.getOwnPropertyDescriptor(cognito, 'CognitoUserPool'));
  });
});