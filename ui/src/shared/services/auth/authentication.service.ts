import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
    AuthenticationDetails,
    CognitoUser,
    CognitoUserPool,
    IAuthenticationDetailsData,
    CognitoUserSession,
    ICognitoUserData
} from 'amazon-cognito-identity-js';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    constructor() {}

    signInUser(model: { userName: string; password: string }): Observable<{ userName: string }> {
        const authenticationModel: IAuthenticationDetailsData = {
            Username: model.userName,
            Password: model.password
        };

        // test - Cognito.AuthenticationDetails instantiated with correct credentials?
        const authenticationDetails = new AuthenticationDetails(authenticationModel);

        const userData: ICognitoUserData = {
            Username: authenticationModel.Username,
            // test - Cognito.CognitoUserPool instantiated with the correct UserPoolId and ClientId
            Pool: new CognitoUserPool({
                UserPoolId: environment.userPoolData.userPoolId,
                ClientId: environment.userPoolData.appClientId
            })
        };

        // test - Cognito.CognitoUser instantiated with the correct ICognitoUserData object
        const cognitoUser = new CognitoUser(userData);

        return new Observable(observer => {
            // test - cognitoUser.authenticateUser was called only once
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: (session: CognitoUserSession) => {
                    // test - on successful login, username must be returned
                    console.log('*************** SUCCESSFULLY SIGNED-IN!!!!! ********************');
                    observer.next({ userName: model.userName });
                },
                onFailure: err => {
                    console.error(err);
                }
            });
        });
    }
}
