import { Injectable } from '@nestjs/common';
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js';
import { UserConfig } from './user.config';

@Injectable()
export class UserService {
  private userPool: CognitoUserPool;
  private client: CognitoIdentityProvider;

  public constructor(userConfig: UserConfig) {
    this.client = new CognitoIdentityProvider({
      region: userConfig.region,
    });
    this.userPool = new CognitoUserPool({
      UserPoolId: userConfig.userPoolId,
      ClientId: userConfig.clientId,
    });
  }

  public async updateUserDetails(username, updateAttribute) {
    const attributeList = [];
    for (const [key, value] of Object.entries(updateAttribute)) {
      const attribute = { Name: `${key}`, Value: `${value}` };
      const awsAttribute = new CognitoUserAttribute(attribute);
      attributeList.push(awsAttribute);
    }
    const userData = {
      Username: username,
      Pool: this.userPool,
    };
    const cognitoUser = new CognitoUser(userData);
    return await cognitoUser.updateAttributes(attributeList, (err, result) => {
      if (err) {
        return err;
      }
      return result;
    });
  }
}
