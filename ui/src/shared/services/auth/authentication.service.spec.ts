import { TestBed } from '@angular/core/testing';
import * as AWSCognito from 'amazon-cognito-identity-js';
import { AuthenticationService } from './authentication.service';
import { environment } from 'src/environments/environment';

 /*
  see authentication.service.complete.spec.ts for complete solution
 */

describe('AuthenticationServiceAuthenticationDetailsFocused', () => {
  let service: AuthenticationService;

  beforeEach(() => {
    // arrange
    TestBed.configureTestingModule({});
    service = TestBed.get(AuthenticationService);
  });

  describe('when .signInUser is working normally', () => {
    let spyAuthenticationDetails: jasmine.Spy;
    let spyCognitoUser: jasmine.Spy;
    let spyCognitoUserPool: jasmine.Spy;

    let result;

    beforeEach(async () => {
      /*
        If you don't do the Object.defineProperty, expect this error:
            Error: <spyOn> : AuthenticationDetails is not declared writable or has no setter
            Usage: spyOn(<object>, <methodName>)
                at <Jasmine>
                at UserContext.<anonymous> (http://localhost:9876/_karma_webpack_/src/shared/services/auth/authentication.service.spec.ts:33:40)
                at ZoneDelegate.invoke (http://localhost:9876/_karma_webpack_/node_modules/zone.js/dist/zone-evergreen.js:359:1)
                at ProxyZoneSpec.push../node_modules/zone.js/dist/zone-testing.js.ProxyZoneSpec.onInvoke (http://localhost:9876/_karma_webpack_/node_modules/zone.js/dist/zone-testing.js:308:1)
                at ZoneDelegate.invoke (http://localhost:9876/_karma_webpack_/node_modules/zone.js/dist/zone-evergreen.js:358:1)
                at Zone.run (http://localhost:9876/_karma_webpack_/node_modules/zone.js/dist/zone-evergreen.js:124:1)
                at runInTestZone (http://localhost:9876/_karma_webpack_/node_modules/zone.js/dist/zone-testing.js:561:1)
       */

      // why does this output `configurable: true` in Angular world but in node.js `configurable: false`???
      //      output: Object{get: function() { ... }, set: undefined, enumerable: true, configurable: true} 
      console.log(Object.getOwnPropertyDescriptor(AWSCognito, 'AuthenticationDetails'));

      // arrange
      Object.defineProperty(AWSCognito, 'AuthenticationDetails', {
        writable: true,
        value: 'foo'
      });

      spyAuthenticationDetails = spyOn(AWSCognito, 'AuthenticationDetails');

      // create the rest of the cognito spies needed just to get AuthenticationDetails tested.
      // in the authentication.service.complete.spec.ts, the spy of AuthenticationDetails also lives
      // inside the createSpies() function.
      // it is outside the function to show intent with this particular test.
      createSpies();

      // act
      service.signInUser({ userName: 'hello', password: 'password' }).subscribe(
        value => {
          result = value;
        },
        error => {
          console.log(error);
        }
      );
    });

    it('instantiate cognito AuthenticationDetails with correct user credentials', () => {
      // assert
      expect(spyAuthenticationDetails).toHaveBeenCalledTimes(1);
      expect(spyAuthenticationDetails).toHaveBeenCalledWith({
        Username: 'hello',
        Password: 'password'
      });
    });

    function createSpies() {
      defineWriteable(AWSCognito, 'CognitoUserPool');
      defineWriteable(AWSCognito, 'CognitoUser');
      spyCognitoUserPool = spyOn(AWSCognito, 'CognitoUserPool');
      spyCognitoUser = spyOn(AWSCognito, 'CognitoUser');
    }

    function defineWriteable(obj: any, functionName: string) {
      Object.defineProperty(obj, functionName, {
        writable: true,
        value: 'foo'
      });
    }
  });
});
