import { AuthConfig } from './auth.config';
import { Injectable } from '@nestjs/common';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js';

import {
  AuthFlowType,
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';

@Injectable()
export class AuthService {
  private userPool: CognitoUserPool;
  private client: CognitoIdentityProviderClient;
  constructor(private readonly authConfig: AuthConfig) {
    this.client = new CognitoIdentityProviderClient({
      region: authConfig.region,
    });
    this.userPool = new CognitoUserPool({
      UserPoolId: this.authConfig.userPoolId,
      ClientId: this.authConfig.clientId,
    });
  }

  registerUser(registerRequest: {
    username: string;
    email: string;
    password: string;
  }) {
    const { username, email, password } = registerRequest;
    return new Promise((resolve, reject) => {
      return this.userPool.signUp(
        email,
        password,
        [new CognitoUserAttribute({ Name: 'name', Value: username })],
        null,
        (error, result) => {
          if (!result) {
            reject(error);
          } else {
            resolve(result.user);
          }
        },
      );
    });
  }

  authenticateUser(user: { email: string; password: string }) {
    const { email, password } = user;

    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });
    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      return cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve({
            refreshToken: result.getRefreshToken().getToken(),
            accessToken: result.getAccessToken().getJwtToken(),
            idToken: result.getIdToken().getJwtToken(),
          });
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }

  forgotPassword(forgotPasswordRequest: { email: string }) {
    const { email } = forgotPasswordRequest;

    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      return cognitoUser.forgotPassword({
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }

  resetPassword(resetPasswordRequest: {
    verificationCode: string;
    newPassword: string;
    email: string;
  }) {
    const { verificationCode, newPassword, email } = resetPasswordRequest;

    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      return cognitoUser.confirmPassword(verificationCode, newPassword, {
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }

  public async refreshTokens({ refreshToken }) {
    const refreshTokenAuth = new InitiateAuthCommand({
      ClientId: this.authConfig.clientId,
      AuthFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
      },
    });

    const response = await this.client.send(refreshTokenAuth);
    const {
      AuthenticationResult: { AccessToken, IdToken },
    } = response;
    return {
      refreshToken,
      accessToken: AccessToken,
      idToken: IdToken,
    };
  }
}
