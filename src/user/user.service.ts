import { Injectable } from '@nestjs/common';
import {
  ChangePasswordCommand,
  CognitoIdentityProviderClient,
  UpdateUserAttributesCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { UserConfig } from './user.config';
import UpdateUserDto from './dtos/UpdateUser.dto';
import UpdatePasswordDto from './dtos/UpdatePassword.dto';

@Injectable()
export class UserService {
  private client: CognitoIdentityProviderClient;
  constructor(private readonly userConfig: UserConfig) {
    this.client = new CognitoIdentityProviderClient({
      region: userConfig.region,
    });
  }

  public async updateUserDetails(
    accessToken: string,
    updateUserDto: UpdateUserDto,
  ) {
    const attributeList = [];
    for (const [key, value] of Object.entries(updateUserDto)) {
      const attribute = { Name: `${key}`, Value: `${value}` };
      const awsAttribute = new CognitoUserAttribute(attribute);
      attributeList.push(awsAttribute);
    }
    const updateUserDetails = new UpdateUserAttributesCommand({
      UserAttributes: attributeList,
      AccessToken: accessToken,
    });

    return await this.client.send(updateUserDetails);
  }

  public async updateUserPassword(
    accessToken: string,
    updatePasswordDto: UpdatePasswordDto,
  ) {
    const updateUserPassword = new ChangePasswordCommand({
      AccessToken: accessToken,
      PreviousPassword: updatePasswordDto.oldPassword,
      ProposedPassword: updatePasswordDto.password,
    });

    return await this.client.send(updateUserPassword);
  }
}
