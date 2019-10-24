import { TestBed } from '@angular/core/testing';
import * as AWSCognito from 'amazon-cognito-identity-js';
import { AuthenticationService } from './authentication.service';
import { environment } from 'src/environments/environment';

fdescribe('AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(() => {
    // arrange
    TestBed.configureTestingModule({});
    service = TestBed.get(AuthenticationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when .signInUser is working normally', () => {
    let spyAuthenticationDetails;
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

      // why does this output `configurable: true` in Angular world but not in Node???
      //      Object{get: function() { ... }, set: undefined, enumerable: true, configurable: true} 
      console.log(Object.getOwnPropertyDescriptor(AWSCognito, 'AuthenticationDetails'));

      // arrange
      Object.defineProperty(AWSCognito, 'AuthenticationDetails', {
        writable: true,
        value: 'foo'
      });

      spyAuthenticationDetails = spyOn(AWSCognito, 'AuthenticationDetails');

      // act
      service.signInUser({ userName: 'hello', password: 'password' }).subscribe(
        value => {
          result = value;
        },
        error => {
          throw Error(error);
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

    xit('instantiate CognitoUser with correct CognitoUserData', async () => {
      fail('ToDo');
    });

    xit('it should return the username', () => {
      fail('ToDo');
    });
  });
});

xdescribe('AuthenticationService', () => {
  // backup environment values
  const envBackup = JSON.stringify(environment);
  let service: AuthenticationService;
  let spyAuthenticationDetails: jasmine.Spy;
  let spyCognitoUser: jasmine.Spy;
  let spyCognitoUserPool: jasmine.Spy;
  let result: { userName: string };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    createSpies();
    environment.userPoolData.userPoolId = 'pool-id';
    environment.userPoolData.appClientId = 'app-client-id';
  });

  afterEach(() => {
    // restore environment values
    Object.assign(environment, JSON.parse(envBackup));
  });

  it('should be created', () => {
    service = TestBed.get(AuthenticationService);
    expect(service).toBeTruthy();
  });

  describe('when .signInUser is working normally', () => {
    let spyCognitoUserArgs;
    beforeEach(async () => {
      const fakeCognitoUser = jasmine.createSpyObj<AWSCognito.CognitoUser>([
        'authenticateUser'
      ]);
      fakeCognitoUser.authenticateUser.and.callFake(
        (
          authDetails: AWSCognito.AuthenticationDetails,
          callback: AWSCognito.IAuthenticationCallback
        ) => {
          callback.onSuccess(createFakeCognitoUserSession());
        }
      );

      spyCognitoUser.and.callFake(args => {
        spyCognitoUserArgs = args;
        return fakeCognitoUser;
      });

      service = TestBed.get(AuthenticationService);

      // act
      service.signInUser({ userName: 'hello', password: 'password' }).subscribe(
        value => {
          result = value;
        },
        error => {
          throw Error(error);
        }
      );
    });

    it('instantiate cognito AuthenticationDetails with correct user credentials', () => {
      expect(spyAuthenticationDetails).toHaveBeenCalledTimes(1);
      expect(spyAuthenticationDetails).toHaveBeenCalledWith({
        Username: 'hello',
        Password: 'password'
      });
    });

    it('instantiate CognitoUser with correct CognitoUserData', async () => {
      expect(spyCognitoUser).toHaveBeenCalledTimes(1);
      expect(spyCognitoUserArgs.Username).toBe('hello');
      expect(spyCognitoUserPool).toHaveBeenCalledTimes(1);
      expect(spyCognitoUserPool).toHaveBeenCalledWith({
        UserPoolId: 'pool-id',
        ClientId: 'app-client-id'
      });
    });

    it('it should return the username', () => {
      expect(result).toEqual({ userName: 'hello' });
    });
  });

  function createSpies() {
    console.log(Object.getOwnPropertyDescriptor(AWSCognito, 'CognitoUserPool'));
    defineWriteable(AWSCognito, 'CognitoUserPool');
    defineWriteable(AWSCognito, 'AuthenticationDetails');
    defineWriteable(AWSCognito, 'CognitoUser');
    spyCognitoUserPool = spyOn(AWSCognito, 'CognitoUserPool');
    spyAuthenticationDetails = spyOn(AWSCognito, 'AuthenticationDetails');
    spyCognitoUser = spyOn(AWSCognito, 'CognitoUser');
  }
});

function defineWriteable(obj: any, functionName: string) {
  Object.defineProperty(obj, functionName, {
    writable: true,
    value: something => {}
  });
}

function createFakeCognitoUserSession() {
  const fakeCognitoUserSession = jasmine.createSpyObj<
    AWSCognito.CognitoUserSession
  >(['getIdToken', 'getAccessToken']);
  fakeCognitoUserSession.getIdToken.and.callFake(() => {
    const fakeToken = new AWSCognito.CognitoIdToken({
      IdToken: 'some token value'
    });
    fakeToken.payload = {
      email: 'hello@email.com',
      'cognito:username': 'hello',
      sub: 'user-database-Id'
    };
    return fakeToken;
  });
  fakeCognitoUserSession.getAccessToken.and.callFake(() => {
    const fakeToken = new AWSCognito.CognitoAccessToken({
      AccessToken: 'some AcccessToken value'
    });
    return fakeToken;
  });
  return fakeCognitoUserSession;
}
