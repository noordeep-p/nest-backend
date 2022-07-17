import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { CognitoRefreshToken } from 'amazon-cognito-identity-js';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  async register(
    @Body()
    registerRequest: {
      username: string;
      password: string;
      email: string;
    },
  ) {
    return await this.authService.registerUser(registerRequest);
  }

  @Post('login')
  async login(
    @Body() authenticateRequest: { email: string; password: string },
  ) {
    try {
      return await this.authService.authenticateUser(authenticateRequest);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordRequest: { email: string }) {
    try {
      return await this.authService.forgotPassword(forgotPasswordRequest);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Post('reset-password')
  async resetPassword(
    @Body()
    resetPasswordRequest: {
      verificationCode: string;
      newPassword: string;
      email: string;
    },
  ) {
    try {
      return await this.authService.resetPassword(resetPasswordRequest);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Post('refreshTokens')
  async refreshTokens(
    @Body() refreshTokenRequest: { refreshToken: CognitoRefreshToken },
  ) {
    try {
      return await this.authService.refreshTokens(refreshTokenRequest);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
