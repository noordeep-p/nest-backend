import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthConfig } from './auth.config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt/jwt.strategy';
import { UnauthenticatedStrategy } from './jwt/unauthenticated.strategy';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [AuthConfig, AuthService, JwtStrategy, UnauthenticatedStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
